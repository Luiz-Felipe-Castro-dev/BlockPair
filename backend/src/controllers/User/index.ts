import express, { Request, Response, RequestHandler } from 'express'
import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';

const router = express.Router()

const Create: RequestHandler = async (req: Request, res: Response) => {
  console.log(req.body,"ayoo")
  const { name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      password: hashedPassword,
      name,
    },
  })
  res.send('User Created successfully');
};
router.post('/', Create)

export default router