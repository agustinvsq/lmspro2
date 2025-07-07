import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const company = await prisma.company.create({ data: { name, email, password: hash } });
  const token = jwt.sign({ companyId: company.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.status(201).json({ token, company: { id: company.id, name: company.name, email: company.email } });
}
