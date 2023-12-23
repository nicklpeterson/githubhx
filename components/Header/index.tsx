import { FC } from 'react';
import { Container, Group, rem, Tabs, Title } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { GithubIcon } from '../GithubIcon';
import classes from './styles.module.css';

interface HeaderProps {
  onSelectTab: (key: Tab) => void;
  selectedTab: Tab;
}

export enum Tab {
  COMMITS = 'commits',
  DIFFS = 'diffs',
  GITHUB = 'github',
}

export const Header: FC<HeaderProps> = ({ onSelectTab, selectedTab }) => {
  const pathname = usePathname();

  const onClickGithubTab = () => {
    if (typeof window !== undefined) {
      window.location.href = `https://github.com${pathname}`;
    }
  };

  return (
    <Title className={classes.header} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          <h1 className={classes.title}>Commit History</h1>
        </Group>
      </Container>
      <Container fluid>
        <Tabs
          defaultValue={Tab.COMMITS}
          value={selectedTab}
          classNames={{
            root: classes.tabs,
            tab: classes.tab,
          }}
        >
          <Tabs.List color="blue">
            <Tabs.Tab
              value={Tab.COMMITS}
              key={Tab.COMMITS}
              onClick={() => onSelectTab(Tab.COMMITS)}
            >
              Versions
            </Tabs.Tab>
            <Tabs.Tab
              value={Tab.DIFFS}
              key={Tab.DIFFS}
              onClick={() => onSelectTab(Tab.DIFFS)}
            >
              Diffs
            </Tabs.Tab>
            <Tabs.Tab
              className={classes.githubTab}
              value={Tab.GITHUB}
              key={Tab.GITHUB}
              onClick={onClickGithubTab}
              leftSection={<GithubIcon size={rem(22)} />}
            >
              Back to Github
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Container>
    </Title>
  );
};
