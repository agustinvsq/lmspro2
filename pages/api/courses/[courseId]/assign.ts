import { prisma } from '../../../../lib/prisma';
import { authenticate } from '../../../../utils/auth';
import transporter from '../../../../lib/mailer';
import { nanoid } from 'nanoid';

export default authenticate(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { courseId } = req.query;
  const { employeeIds } = req.body;
  const enrollments = [];
  for (const id of employeeIds) {
    const token = nanoid(32);
    const enroll = await prisma.enrollment.create({
      data: { courseId: Number(courseId), employeeId: id, linkToken: token },
      include: { employee: true }
    });
    enrollments.push(enroll);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/take-course/${token}`;
    await transporter.sendMail({
      to: enroll.employee.email,
      subject: 'Nuevo curso asignado',
      html: `<a href="${url}">${url}</a>`
    });
  }
  res.json({ enrollments });
});
