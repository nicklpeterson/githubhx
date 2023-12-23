'use client';

import { useRouter } from 'next/navigation';
import { Button, Container, Group, Image, Text } from '@mantine/core';
import classes from './styles.module.css';

const DEMO_PATH = '/microsoft/TypeScript/blob/main/src/compiler/core.ts';

export const NotFound = () => {
  const router = useRouter();

  const onClickLink = () => {
    router.replace(DEMO_PATH);
  };

  return (
    <Container className={classes.root}>
      <Image src="/404-image.svg" width={'50%'} className={classes.image} />
      <Text c="dimmed" size="xl" ta="center" className={classes.description}>
        You may have mistyped the file path, or attempted to load a path that
        doesn't point to a file. Try navigating to a file in github and add
        "history" after git in the url. For example,
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="xl" onClick={onClickLink}>
          Check out the demo
        </Button>
      </Group>
    </Container>
  );
};
