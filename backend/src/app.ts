import express from 'express'
import UserController from "./controllers/User/index"
import OrderController, { orderMatching } from "./controllers/Order/index"
import AuthController from "./controllers/Auth/index"
import { createClient } from 'redis'
import { CronTestJob } from './utils/cron';
import { Server } from 'socket.io';
import http from 'http'
import prisma from './utils/prisma';
import jwt from 'jsonwebtoken';
import { UserPayload } from './types/UserPayload';
import { Socket } from 'socket.io';
import cors from "cors";
import { OrderCoinType } from '../generated/prisma_client'
import { addJobs } from './utils/bullmq'
import handleSendOrder from './sockets/handlers/sendOrder'

interface AuthenticatedSocket extends Socket {
    user?: UserPayload;
}
const redisClient = createClient({
    url: 'redis://redis:6379'
});
(async () => {
    await redisClient.connect();
})();

const app = express()
const port = 3000
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/user', UserController)
app.use('/order', OrderController)
app.use('/auth', AuthController)
app.get('/health', (req, res) => {res.status(200).send('ok')});

app.get('/', (req, res) => {
    res.send('hello world!!')
})

app.listen(port, () => {
    console.log(`wisiex project listening on port ${port}`)
})
CronTestJob.start()
// socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const jwt_secret = process.env.JWT_SECRET
    if (!jwt_secret) return
    if (!token) {
        return next(new Error('Authentication error: Token required'));
    }

    try {
        const user = jwt.verify(token, jwt_secret) as UserPayload;
        (socket as AuthenticatedSocket).user = user;
        next();
    } catch (err) {
        console.log("authentication error")
        next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', (socket) => {
    const authSocket = socket as AuthenticatedSocket;

    socket.on('send_message', async (message) => {

        console.log(message.text, "shenanigans")
        
    })
 // this handler works to abstract things, do that on all socket.on thingyes
    handleSendOrder(socket)
    socket.on('get_orders', async (callback) => {
        const orders = await prisma.order.findMany();
        callback(orders);
    });
    socket.on('get_orders_user', async (callback) => {
        const orders = await prisma.order.findMany({
            where: {
                userId: authSocket.user?.id,
                status: 'COMPLETED'
            }
        });
        callback(orders);
    });
    socket.on('get_active_orders_user', async (callback) => {
        const orders = await prisma.order.findMany({
            where: {
                userId: authSocket.user?.id,
                status: 'PENDING'
            }
        });
        callback(orders);
    });
    socket.on('cancel_order', async (data,callback) => {
         const { orderId } = data;
        const orders = await prisma.order.delete({where:{id:orderId}
        });
        callback(orders);
    });
});
io.on('connection', async (socket) => {
    const orders = await prisma.order.findMany();
    socket.emit('orders', orders);
});
server.listen(5000, () => {
    console.log("http(for some reason) but is socket.io Server is running on port 5000");
});
