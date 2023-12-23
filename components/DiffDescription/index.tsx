import { Container, Text, Title } from '@mantine/core';
import classes from './styles.module.css';

export const DiffDescription = () => {
  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          Commit{' '}
          <Text component="span" className={classes.highlight} inherit>
            diffs
          </Text>{' '}
          for any file
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Select two commits to see the difference
          </Text>
        </Container>
      </div>
    </Container>
  );
};
