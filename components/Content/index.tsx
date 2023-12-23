'use client';

import { Container } from '@mantine/core';
import { Header, Tab } from '../Header';
import classes from './styles.module.css';
import { Commit } from '@/api/types';
import { FC, useState } from 'react';
import { CommitList } from '../CommitList';
import { getLanguage } from '@/utilities/language';
import { CodeBlock } from '../CodeBlock';

interface ContentProps {
  commits: Commit[];
  filePath?: string;
}

export const Content: FC<ContentProps> = ({ commits, filePath }) => {
  const [tab, setTab] = useState<Tab>(Tab.COMMITS);
  const [commitIndex, setCommitIndex] = useState<number>(0);
  const [diff, setDiff] = useState<string | undefined>();
  const language = getLanguage(filePath ?? '');

  return (
    <>
      <Header onSelectTab={setTab} selectedTab={tab} />
      <Container className={classes.content} fluid>
        <CommitList
          commits={commits}
          index={commitIndex}
          setSelectedIndex={setCommitIndex}
          isDiff={tab === Tab.DIFFS}
          onSelectDiff={setDiff}
        />
        <CodeBlock
          commit={commits[commitIndex]}
          language={language}
          isDiff={tab === Tab.DIFFS}
          diff={diff}
        />
      </Container>
    </>
  );
};
