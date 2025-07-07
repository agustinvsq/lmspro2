import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/courses`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => setCourses(res.data));  
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
}
