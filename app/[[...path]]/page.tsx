'use server';

import { fetchCommits, fetchRepoFilePaths, parseGithubUrl } from '@/api/github';
import {
  Commit,
  FetchCommitsProps,
  FetchRepoProps,
  RepoFileList,
} from '@/api/types';
import { FileSearch } from '@/components/FileSearch';
import { NotFound } from '@/components/NotFound';
import { Content } from '@/components/Content';
import { Container } from '@mantine/core';
import { headers } from 'next/headers';

interface GithubData {
  commits?: Commit[];
  filePath?: string;
  branch?: string;
  owner?: string;
  repo?: string;
  files?: RepoFileList;
}

const fetchFileVersions = async ({
  owner,
  repo,
  branch,
  filePath,
}: FetchCommitsProps): Promise<GithubData> => {
  const commits = await fetchCommits({
    owner,
    repo,
    branch,
    filePath,
  });

  return { repo, owner, branch, commits, filePath };
};

const fetchFileTree = async ({
  owner,
  repo,
  branch,
}: FetchRepoProps): Promise<GithubData> => {
  const files: RepoFileList = await fetchRepoFilePaths({
    owner,
    repo,
    branch,
  });

  return { files, owner, repo };
};

const fetchGithubFileData = async (): Promise<GithubData> => {
  try {
    const path = headers().get('x-pathname');

    if (!path) return {};

    const { owner, repo, branch, filePath, type } = await parseGithubUrl({
      url: decodeURIComponent(path),
    });

    if (
      (type === 'pull' || type === 'tree' || type === undefined) &&
      repo &&
      owner
    ) {
      return await fetchFileTree({ owner, repo, branch });
    } else if (type === 'blob' && owner && repo && branch && filePath) {
      return await fetchFileVersions({
        owner,
        repo,
        branch,
        filePath,
      });
    }

    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const Landing = async () => {
  const { commits, filePath, files } = await fetchGithubFileData();

  if (files && files.fileNames.length > 0) {
    return <FileSearch files={files} />;
  }

  if (!commits || commits.length === 0) {
    return <NotFound />;
  }

  return (
    <Container fluid>
      <Content commits={commits} filePath={filePath} />
    </Container>
  );
};

export default Landing;