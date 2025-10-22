import express, { Request, Response, RequestHandler } from 'express'
import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../../middleware/auth';

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
       const token = generateToken({ id: user.id, name: user.name });
          res.status(200).send({
              message: "Sign Up successful",
              token: token,
              user: {
                  id: user.id,
                  name: user.name 
              }
          });
};
router.post('/', Create)

export default router