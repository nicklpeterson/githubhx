import { Commit } from '@/api/types';
import { createTwoFilesPatch } from 'diff';
import {
  Checkbox,
  Code,
  Container,
  ScrollArea,
  Text,
  Timeline,
} from '@mantine/core';
import { IconGitCommit } from '@tabler/icons-react';
import moment from 'moment';
import { FC, useState } from 'react';
import classes from './styles.module.css';
import memoize from 'fast-memoize';

interface CommitListProps {
  commits: Commit[];
  index: number;
  setSelectedIndex: (index: number) => void;
  isDiff: boolean;
  onSelectDiff: (diff: string) => void;
}

export interface CommitSelection {
  commitA?: Commit;
  commitB?: Commit;
}

const getDiff = memoize(
  (commitA: Commit, commitB: Commit): string => {
    const dateA = moment(commitA.date);
    const dateB = moment(commitB.date);

    const options = { context: Number.MAX_SAFE_INTEGER };

    return dateB.diff(dateA) < 0
      ? createTwoFilesPatch(
          commitB.fileName,
          commitA.fileName,
          commitB.code.content,
          commitA.code.content,
          '',
          '',
          options,
        )
      : createTwoFilesPatch(
          commitA.fileName,
          commitB.fileName,
          commitA.code.content,
          commitB.code.content,
          '',
          '',
          options,
        );
  },
  {
    serializer: ([commitA, commitB]: Commit[]) =>
      commitA.sha < commitB.sha
        ? JSON.stringify([commitA.sha, commitB.sha])
        : JSON.stringify([commitB.sha, commitA.sha]),
  },
);

export const CommitList: FC<CommitListProps> = ({
  commits,
  index,
  setSelectedIndex,
  isDiff,
  onSelectDiff,
}) => {
  const [commitSelection, setCommitSelection] = useState<CommitSelection>({});

  const onClickItem = (index: number) => {
    if (!isDiff) {
      setSelectedIndex(index);
    } else {
      const commit = commits[index];
      if (
        commit.sha === commitSelection?.commitA?.sha ||
        commit.sha === commitSelection?.commitB?.sha
      ) {
        if (commit.sha === commitSelection?.commitA?.sha) {
          setCommitSelection({ ...commitSelection, commitA: undefined });
        } else {
          setCommitSelection({ ...commitSelection, commitB: undefined });
        }
      } else {
        if (!commitSelection?.commitA) {
          setCommitSelection({ ...commitSelection, commitA: commit });

          if (commitSelection?.commitB) {
            onSelectDiff(getDiff(commit, commitSelection.commitB));
          }
        } else if (!commitSelection?.commitB) {
          setCommitSelection({ ...commitSelection, commitB: commit });

          if (commitSelection?.commitA) {
            onSelectDiff(getDiff(commitSelection.commitA, commit));
          }
        }
      }
    }
  };

  const timeLineItems = commits.map((commit, index) => (
    <Timeline.Item
      key={commit.sha}
      className={classes.commit}
      title={commit.message.split('\n')[0].slice(0, 80)}
      onClick={() => onClickItem(index)}
      bullet={
        isDiff ? (
          <Checkbox
            size={'md'}
            checked={
              commit.sha === commitSelection?.commitA?.sha ||
              commit.sha === commitSelection?.commitB?.sha
            }
            disabled={
              commit.sha !== commitSelection?.commitA?.sha &&
              commit.sha !== commitSelection?.commitB?.sha &&
              commitSelection?.commitA !== undefined &&
              commitSelection?.commitB !== undefined
            }
            onChange={() => {
              /* do nothing */
            }}
          />
        ) : (
          <IconGitCommit size={12} />
        )
      }
    >
      <Text color="dimmed" size="sm">
        {commit.author.name}
      </Text>
      <Text size="xs" mt={4}>
        {moment(commit.date).fromNow(true)}
      </Text>
    </Timeline.Item>
  ));

  return (
    <nav className={classes.navbar}>
      <Container className={classes.codeBoxHeader} fluid>
        <Code className={classes.codeHeader}>{`commits`}</Code>
      </Container>
      <ScrollArea className={classes.scrollArea}>
        <Timeline
          className={classes.timeline}
          active={isDiff ? -1 : commits.length - index - 1}
          bulletSize={24}
          lineWidth={2}
          reverseActive
        >
          {timeLineItems}
        </Timeline>
      </ScrollArea>
    </nav>
  );
};
