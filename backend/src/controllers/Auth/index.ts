import express, { Request, Response, RequestHandler } from 'express'
import prisma from '../../utils/prisma';
import bcrypt from "bcrypt"
import { generateToken } from '../../middleware/auth';

const router = express.Router()

const Auth: RequestHandler = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({
        where: {
            name: username,
        },
    })
    if (!user) return
    const isPasswordMatch = await bcrypt.compare(password, user?.password)
    if (isPasswordMatch) {
        const token = generateToken({ id: user.id, name: user.name });
        res.status(200).send({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name 
            }
        });

    } else {
        res.status(404).send('Username and/or password does not match');

    }
};
router.post('/', Auth)

export default router