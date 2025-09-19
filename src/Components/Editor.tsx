'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });



interface EditorProps {
  placeholder?: string;
  description?: string;                  // initial content
  onChange?: (content: string) => void; // callback to parent
}

const Editor: React.FC<EditorProps> = ({ placeholder, description, onChange }) => {
  const [editorHtml, setEditorHtml] = useState<string>(description || '');
  const [theme, setTheme] = useState<'snow' | 'bubble' | null>('snow');

  // Update editor content if description prop changes dynamically
  useEffect(() => {
    if (description !== undefined && description !== editorHtml) {
      setEditorHtml(description);
    }
  }, [description]);

  const handleChange = (html: string) => {
    setEditorHtml(html);
    if (onChange) onChange(html); // notify parent
  };

  const handleThemeChange = (newTheme: string) =>
    setTheme(newTheme === 'core' ? null : (newTheme as 'snow' | 'bubble'));

  return (
    <div className="app">
      <ReactQuill
        // theme={theme || undefined}
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        bounds=".app"
        placeholder={placeholder}
        style={{ height: '200px',fontSize:20}}
      />


<style>{`
  .ql-editor {
    font-size: 20px;
  }
`}</style>


      {/* <div className="themeSwitcher mt-4">
        <label className="mr-2">Theme</label>
        <select onChange={(e) => handleThemeChange(e.target.value)} value={theme ?? 'core'}>
          <option value="snow">Snow</option>
          <option value="bubble">Bubble</option>
          <option value="core">Core</option>
        </select>
      </div> */}
    </div>
  );
};

// Quill modules
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullets' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: { matchVisual: false },
};

// Quill formats
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
];




Editor.propTypes = {
  placeholder: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

export default Editor;
