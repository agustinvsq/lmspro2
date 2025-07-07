import { prisma } from '../../../lib/prisma';
import { authenticate } from '../../../utils/auth';

export default authenticate(async (req, res) => {
  if (req.method === 'POST') {
    const { title } = req.body;
    const course = await prisma.course.create({ data: { companyId: req.companyId, title } });
    return res.status(201).json(course);
  }
  const courses = await prisma.course.findMany({ where: { companyId: req.companyId } });
  res.json(courses);
});
