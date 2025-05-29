import React from 'react';
import { Editor } from '@monaco-editor/react';

const CodeEditor = ({ language, code, setCode }) => {
  return (
    <Editor
      defaultLanguage={language}
      value={code}
      onChange={(value) => setCode(value)}
      theme="vs-dark"
      options={{
        fontSize: 14,
      }}
      style={{ width: "100%",
        height: "100%",
       }}
    />
  );
};

// back-color : #1e1e2f
export default CodeEditor;
