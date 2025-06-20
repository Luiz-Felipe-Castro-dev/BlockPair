import express, { Request, Response, RequestHandler } from 'express'
import prisma from '../../utils/prisma';
import { } from '@prisma/client';

const router = express.Router()

// this is for tests, i can't use this with sockets basically
const Create: RequestHandler = async (req: Request, res: Response) => {
    const userID = 1

    const order = await prisma.order.create({
        data: {
            coinType: 'BTCtoUSD',
            price: 30,
            status: 'PENDING',
            userId: userID,
        },
    })
    console.log('Received order:');
    res.send('Order Created successfully');
};
const Get: RequestHandler = async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany();
    res.send(orders)
}

export const orderMatching = async (order: any) => {
    //i don't remember what i need to do
    // 1 - find matching orders
    // find the opposite of the order type to make a match
    const coinOfSeller = order.coinType == "BTCtoUSD" ? "USDtoBTC" : "BTCtoUSD"
    const matchedOrder = await prisma.order.findFirst({
        where: {
            amount: order.price,
            price: order.amount,
            coinType: coinOfSeller,
            status: "PENDING",
            userId: {
                not: order.userId
            },
        },
        orderBy: { created_at: 'desc' }
    });
    if (!matchedOrder) return;

    // 2 - do the transaction
    // i have to write logic for subtracting the correct  balance with the correct amount
    // const coinOfSeller = order.coinType == "BTCtoUSD" ? "USDtoBTC" : "BTCtoUSD"

    // if buying usd, btc balance should go down and usd balance up, if the opposite happens
    // then it's vice versa
    const buyingUserBalanceExchange = order.coinType == "BTCtoUSD" ?
        { BTCbalance: { decrement: order.price }, USDbalance: { increment: order.amount } } :
        { USDbalance: { decrement: order.price }, BTCbalance: { increment: order.amount } };
    // the exact same, but for the matchedOrder
    const sellingUserBalanceExchange = matchedOrder?.coinType == "BTCtoUSD" ?
        { BTCbalance: { decrement: matchedOrder?.price }, USDbalance: { increment: matchedOrder?.amount } } :
        { USDbalance: { decrement: matchedOrder?.price }, BTCbalance: { increment: matchedOrder?.amount } };


    const updateBuyingUser = await prisma.user.update({
        where: { id: order.userId },
        data: buyingUserBalanceExchange
    });

    const updateSellingUser = await prisma.user.update({
        where: { id: matchedOrder.userId },
        data: sellingUserBalanceExchange
    });
    // 3 - alter the order status
    const updatedBuyingOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "COMPLETED" }
    })
    const updatedSellingOrder = await prisma.order.update({
        where: { id: matchedOrder.id },
        data: { status: "COMPLETED" }
    })

}

router.post('/', Create)
router.get('/', Get)

export default router