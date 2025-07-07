import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  const company = await prisma.company.findUnique({ where: { email } });
  if (!company || !await bcrypt.compare(password, company.password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ companyId: company.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
}
