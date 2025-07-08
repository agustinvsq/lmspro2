// pages/dashboard/index.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const [view, setView] = useState<'employees' | 'courses'>('employees');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return router.push('/auth/login');
    setToken(t);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      <nav className="flex space-x-4 mb-6">
        <button onClick={() => setView('employees')} className={`px-4 py-2 rounded ${view==='employees'? 'bg-matteBlack text-white':'border border-matteBlack'}`}>Empleados</button>
        <button onClick={() => setView('courses')} className={`px-4 py-2 rounded ${view==='courses'? 'bg-matteBlack text-white':'border border-matteBlack'}`}>Cursos</button>
      </nav>
      {view === 'employees' ? <EmployeesSection token={token!}/> : <CoursesSection token={token!}/>}
    </div>
  );
}

function EmployeesSection({ token }: { token: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [list, setList] = useState<any[]>([]);

  const upload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/employees`,
      form,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
    );
    setList(res.data.employees);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Gestionar Empleados</h2>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0]||null)} className="mb-2" />
      <button onClick={upload} className="px-4 py-2 rounded-xl border-2 border-matteBlack">Subir CSV</button>
      <ul className="mt-4">
        {list.map(e => <li key={e.id}>{e.name} - {e.email}</li>)}
      </ul>
    </div>
  );
}

function CoursesSection({ token }: { token: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/courses`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => setCourses(res.data));
  }, []);

  const create = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/courses`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCourses(prev => [...prev, res.data]);
    setTitle('');
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Gestionar Cursos</h2>
      <div className="flex mb-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título del curso" className="border p-2 flex-1 mr-2"/>
        <button onClick={create} className="px-4 py-2 rounded-xl border-2 border-matteBlack">Crear Curso</button>
      </div>
      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  );
}
