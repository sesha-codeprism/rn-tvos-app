import React from 'react';

const SyntaxHighlighter = require('react-native-syntax-highlighter').default;
const codeStyles =
  require('react-syntax-highlighter/dist/esm/styles/hljs/darcula').default;

export interface CodeBlockProps {
  code: String;
}

const CodeBlock: React.FunctionComponent<CodeBlockProps> = props => {
  return (
    <SyntaxHighlighter
      code={props.code}
      style={{...codeStyles}}
      customStyle={{padding: 20, margin: 0}}
      fontSize={18}
      highlighter={'hljs'}
    />
  );
};

export default CodeBlock;
