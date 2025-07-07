import nextConnect from 'next-connect';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../utils/auth';

const upload = multer();
const handler = nextConnect();
handler.use(authenticate);
handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file' });
  const records = parse(file.buffer.toString(), { columns: true });
  const created = [];
  for (const record of records) {
    const emp = await prisma.employee.create({
      data: { companyId: req.companyId, name: record.name, email: record.email }
    });
    created.push(emp);
  }
  res.json({ employees: created });
});

handler.get(async (req, res) => {
  const employees = await prisma.employee.findMany({ where: { companyId: req.companyId } });
  res.json({ employees });
});

export const config = { api: { bodyParser: false } };
export default handler;
