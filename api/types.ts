export interface FetchCommitsProps {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
}

export interface FetchRepoProps {
  owner: string;
  repo: string;
  branch?: string;
}

export interface ParseGithuUrlProps {
  url?: string;
}

export interface ParseGithuUrlResult {
  filePath?: string;
  branch?: string;
  owner?: string;
  repo?: string;
  type: string;
}

export interface RepoFileList {
  fileNames: string[];
  branch: string;
  repo: string;
  owner: string;
}

export interface RepoFile {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
}

export interface Author {
  name: string;
  avatar: string;
}

export interface Commit {
  sha: string;
  author: Author;
  date: string;
  message: string;
  code: {
    content: string;
    size: number;
  };
  url: string;
  fileName: string;
}