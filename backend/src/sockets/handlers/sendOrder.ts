import { UserPayload } from '../../types/UserPayload';
import { Socket } from 'socket.io';

import { OrderCoinType } from '../../../generated/prisma_client'
import prisma from '../../utils/prisma';
import { addJobs } from '../../utils/bullmq'

interface AuthenticatedSocket extends Socket {
    user?: UserPayload;
}
export default function handleSendOrder(socket: AuthenticatedSocket) {
    const authSocket = socket as AuthenticatedSocket;
    socket.on('send_order', async (orderData: { type: string, price: number; amount: number }) => {
        if (!authSocket.user) {
            console.error("User is not authenticated");
            return;
        }
        const order = await prisma.order.create({
            data: {
                coinType: orderData.type as OrderCoinType,
                price: orderData.price,
                amount: orderData.amount,
                userId: authSocket.user.id,
                status: 'PENDING',
            }
        })
        // here i need to trigger a match attempt, the one and only, using a job
        console.log(order, "order")
        await addJobs(order);
        console.log("order sucessfully created!")
    })
}