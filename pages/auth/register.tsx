// pages/auth/register.tsx
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/company/register`,
        { name, email, password }
      );
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error al registrarse', err);
      alert('No se pudo crear la cuenta');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl mb-4">Registrarse</h2>
      <input
        type="text"
        placeholder="Nombre de Empresa"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="w-full p-2 rounded-xl border-2 border-matteBlack hover:bg-matteBlack hover:text-white transition"
      >
        Crear Cuenta
      </button>
    </div>
  );
}
