// pages/api/employees.ts
import nextConnect from 'next-connect';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../utils/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

const upload = multer();
const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(authenticate);
handler.use(upload.single('file'));

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const file = (req as any).file;
  if (!file) return res.status(400).json({ error: 'No file' });

  const records = parse(file.buffer.toString(), { columns: true });
  const created = [];
  for (const record of records) {
    const emp = await prisma.employee.create({
      data: {
        companyId: (req as any).companyId,
        name: record.name,
        email: record.email
      }
    });
    created.push(emp);
  }
  res.json({ employees: created });
});

export const config = { api: { bodyParser: false } };
export default handler;
