'use client';

import { RepoFileList } from '@/api/types';
import { Autocomplete, Button, Container, Title } from '@mantine/core';
import { FC, useState } from 'react';
import classes from './styles.module.css';

export interface FileSearchProps {
  files: RepoFileList;
}

export const FileSearch: FC<FileSearchProps> = ({ files }) => {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);

  const onClick = () => {
    if (filePath && typeof window !== undefined) {
      const url = `/${files.owner}/${files.repo}/blob/${files.branch}/${filePath}`;
      window.location.assign(url);
    }
  };

  return (
    <Container className={classes.root}>
      <Title className={classes.title}>Select a file from this repo</Title>
      <Autocomplete
        className={classes.input}
        placeholder="File Path"
        data={files.fileNames}
        onChange={setFilePath}
      />

      <Container className={classes.buttonContainer}>
        <Button
          className={classes.button}
          disabled={filePath === undefined}
          onClick={onClick}
        >
          Display History
        </Button>
      </Container>
    </Container>
  );
};
