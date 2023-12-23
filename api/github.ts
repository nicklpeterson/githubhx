import { App, Octokit } from 'octokit';
import {
  Commit,
  FetchCommitsProps,
  FetchRepoProps,
  ParseGithuUrlProps,
  ParseGithuUrlResult,
  RepoFile,
  RepoFileList,
} from './types';

interface CodeResponse {
  status: number;
  data: {
    content: string;
    size: number;
  };
}

interface PendingCommit extends Omit<Commit, 'code'> {
  code: Promise<CodeResponse>;
}

let octokit: Octokit | undefined;

const app = new App({
  appId: process.env.GITHUB_APP_ID ?? '',
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY ?? '',
});

const getOctokit = async () => {
  if (octokit) {
    return octokit;
  } else {
    octokit = await app.getInstallationOctokit(
      Number(process.env.GITHUB_APP_INSTALLATION_ID),
    );
    return octokit;
  }
};

export const parseGithubUrl = async ({
  url,
}: ParseGithuUrlProps): Promise<ParseGithuUrlResult> => {
  const octokit = await getOctokit();

  const [owner, repo, type, ...params] = url?.split('/').slice(1) ?? [];
  const urlParams = decodeURI(params.join('/'));

  if (type === 'pull') {
    const pullNumber = Number(params[0]);

    const { data } = await octokit.request(
      `GET /repos/{owner}/{repo}/pulls/{pull_number}`,
      {
        owner,
        repo,
        pull_number: pullNumber,
      },
    );

    const branch = data.head.ref;

    return { owner, repo, type, branch };
  }

  const data = await octokit.paginate(`GET /repos/{owner}/{repo}/branches`, {
    owner,
    repo,
  });

  const {
    name: branch,
    commit: { sha },
  } = data.find(
    ({ name, commit: { sha } }) =>
      urlParams.includes(name) || urlParams.includes(sha),
  ) ?? { commit: {} };

  if (branch) {
    const filePath = urlParams.replace(new RegExp(`${branch}|${sha}`), '');

    return filePath === ''
      ? { owner, repo, type, branch, filePath: undefined }
      : { owner, repo, type, branch, filePath };
  } else {
    const {
      data: { default_branch },
    } = await octokit.request(`GET /repos/{owner}/{repo}`, {
      owner,
      repo,
    });

    const filePath = urlParams.includes(default_branch)
      ? urlParams.replace(default_branch, '')
      : urlParams;

    return { owner, repo, type, branch: default_branch, filePath };
  }
};

export const fetchRepoFilePaths = async ({
  owner,
  repo,
  branch,
}: FetchRepoProps): Promise<RepoFileList> => {
  const octokit = await getOctokit();

  if (!branch) {
    const {
      data: { default_branch },
    } = await octokit.request(`GET /repos/{owner}/{repo}`, {
      owner,
      repo,
    });

    branch = default_branch;
  }

  const {
    data: {
      commit: { sha: commitSha },
    },
  } = await octokit.request(`GET /repos/{owner}/{repo}/branches/{branch}`, {
    owner,
    repo,
    branch,
  });

  const {
    data: {
      tree: { sha: treeSha },
    },
  } = await octokit.request(
    `GET /repos/{owner}/{repo}/git/commits/{commitSha}`,
    { owner, repo, commitSha },
  );

  const {
    data: { tree },
  } = await octokit.request(
    `GET /repos/{owner}/{repo}/git/trees/{treeSha}?recursive=true`,
    { owner, repo, treeSha },
  );

  const fileNames: string[] = tree
    .filter((file: RepoFile) => file.type === 'blob')
    .map((file: RepoFile) => file.path);

  return {
    fileNames,
    branch,
    owner,
    repo,
  };
};

export const fetchCommits = async ({
  owner,
  repo,
  branch,
  filePath,
}: FetchCommitsProps): Promise<Commit[]> => {
  const octokit = await getOctokit();

  const commitsResponse = await octokit.request(
    `GET /repos/{owner}/{repo}/commits?sha=${branch}&path=${filePath}`,
    { owner, repo },
  );

  const pendingCommits: PendingCommit[] = commitsResponse.data.map(
    (commitSummary: any) => ({
      sha: commitSummary.sha,
      date: commitSummary.commit.committer.date,
      message: commitSummary.commit.message,
      url: commitSummary.html_url,
      fileName: filePath,
      author: {
        name: commitSummary.commit.author.name,
      },
      code: octokit.request(
        `GET /repos/{owner}/{repo}/contents/{path}?ref=${commitSummary.sha}`,
        { repo, owner, path: filePath },
      ),
    }),
  );

  const commits = await Promise.all(
    pendingCommits.map(async (commit: PendingCommit) => {
      try {
        const data = (await commit.code).data;

        return {
          ...commit,
          code: {
            content:
              Buffer.from(data.content, 'base64').toString('binary') ?? null,
            size: data.size,
          },
        };
      } catch (error) {
        return undefined;
      }
    }),
  );

  return commits.filter(
    (commit) => commit !== undefined && commit.code.content !== undefined,
  ) as Commit[];
};
