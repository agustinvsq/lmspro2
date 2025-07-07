import { prisma } from '../../../../lib/prisma';
import { authenticate } from '../../../../utils/auth';

export default authenticate(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { courseId } = req.query;
  const { title, content } = req.body;
  const module = await prisma.module.create({
    data: { courseId: Number(courseId), title, content }
  });
  res.status(201).json(module);
});
