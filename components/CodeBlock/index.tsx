import { Commit } from '@/api/types';
import { formatBytes } from '@/utilities/bytes';
import { Language } from '@/utilities/language';
import {
  Code,
  Container,
  DefaultMantineColor,
  ScrollArea,
} from '@mantine/core';
import { FC } from 'react';
import { DiffDescription } from '../DiffDescription';
import SyntaxHighlighter, { createElement } from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import classes from './sytles.module.css';

interface CodeBlockProps {
  commit: Commit;
  isDiff?: boolean;
  diff?: string;
  language?: Language;
}

type CodeContainerProps = CodeBlockProps;

type HighlightLines = Record<
  string,
  {
    color: DefaultMantineColor;
    label?: string | undefined;
  }
>;

const NEW_LINE_REGEX = /\r\n|\r|\n/;

const GREEN_HIGHLIGHT = '#dbffdb';
const RED_HIGHLIGHT = '#ffecec';

const getHighlightedLines = (diffLines: string[]) => {
  const deleted = { color: RED_HIGHLIGHT, label: '-' };
  const added = { color: GREEN_HIGHLIGHT, label: '+' };

  return diffLines.reduce((obj, line, index) => {
    if (line.startsWith('-')) {
      diffLines[index] = line.replace('-', ' ');
      obj[`${index + 1}`] = deleted;
    } else if (line.startsWith('+')) {
      diffLines[index] = line.replace('+', ' ');
      obj[`${index + 1}`] = added;
    }
    return obj;
  }, {} as Record<string, { color: DefaultMantineColor; label?: string | undefined }>);
};

const getCodeRenderer =
  (highlightLines: HighlightLines | undefined) =>
  ({ rows, stylesheet, useInlineStyles }: rendererProps) => {
    let lineNumber = 0;
    return (
      <>
        {rows.map((node: any, index: number) => {
          if (highlightLines && highlightLines[index + 1]?.label === '-') {
            node.children[0].children[0].value = ' ';
          } else {
            lineNumber++;
            node.children[0].children[0].value = lineNumber;
          }
          return createElement({
            node,
            stylesheet,
            useInlineStyles,
            key: `code-segement${index}`,
          });
        })}
      </>
    );
  };

const CodeContainer = ({
  language = 'javascript',
  isDiff,
  diff,
  commit,
}: CodeContainerProps) => {
  const diffLines = diff !== undefined ? diff.split(NEW_LINE_REGEX) : undefined;
  diffLines?.splice(0, 5);

  const highlightLines =
    isDiff && diffLines !== undefined
      ? getHighlightedLines(diffLines)
      : undefined;

  const content =
    isDiff && diffLines
      ? diffLines
          .map((line, index) => {
            if (highlightLines && highlightLines[index + 1]) {
              return `${highlightLines[index + 1].label} ${line.substring(1)}`;
            } else {
              return '  ' + line.substring(1);
            }
          })
          .join('\n')
      : commit.code.content;

  if (isDiff && !diffLines) {
    return <DiffDescription />;
  } else {
    const lineNumberStyle = isDiff
      ? {}
      : {
          marginRight: '16px',
        };

    return (
      <SyntaxHighlighter
        className={classes.code}
        style={githubGist}
        language={language}
        wrapLines={true}
        showLineNumbers
        lineNumberStyle={lineNumberStyle}
        renderer={getCodeRenderer(highlightLines)}
        lineProps={(lineNumber) => {
          const style: { display?: string; backgroundColor?: string } = {
            display: 'block',
          };
          if (highlightLines && highlightLines[lineNumber]) {
            style.backgroundColor = highlightLines[lineNumber].color;
          }
          return { style };
        }}
      >
        {content}
      </SyntaxHighlighter>
    );
  }
};

export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const { commit } = props;
  const numberOfLines = commit.code.content.split(/\r\n|\r|\n/).length - 1;

  return (
    <ScrollArea className={classes.scrollArea}>
      <Container className={classes.codeWrapper} fluid>
        <Container className={classes.codeBoxHeader} fluid>
          <Code className={classes.codeHeader}>
            {`${numberOfLines} lines  |  ${formatBytes(
              commit.code.size,
            )} | ${commit.fileName.split('/').pop()}`}
          </Code>
        </Container>
        <CodeContainer {...props} />
      </Container>
    </ScrollArea>
  );
};
