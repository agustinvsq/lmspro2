// components/courses/ModuleForm.tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function ModuleForm({ courseId, onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/module`,
      { title, content: { html: content } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onCreated();
  };

  return (
    <div className="p-6 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
      <input
        className="w-full p-2 border-2 border-matteBlack rounded-lg"
        placeholder="Título del módulo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 rounded-xl border-2 border-matteBlack hover:bg-matteBlack hover:text-white transition"
      >
        Crear módulo
      </button>
    </div>
  );
}
