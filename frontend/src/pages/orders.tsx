import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import OrderHistory from "../components/orderHistory";
import ActiveOrders from "../components/activeOrders";
import CreateOrder from "../components/createOrder";
import OrdersList from "../components/ordersList";
import Statistics from "../components/statistics";
import BidList from "../components/bid";
import AskList from "../components/ask";
import Sell from "../components/sell";

import { useNavigate } from "react-router-dom";


type Stats = {
    TotalTrades: number,
    USDBalance: number,
    BTCBalance: number,
}
const apiUrl = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats>({
        TotalTrades: 0,
        USDBalance: 0,
        BTCBalance: 0,
    });
    const navigate = useNavigate()

    // order variables
    const [type, setType] = useState('USDtoBTC');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/")
        }

        const newSocket = io(`${apiUrl}`, {
            auth: {
                token,
            },
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);
    // Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit('get_orders', (orders: any) => {
            setOrders(orders)
            console.log("Orders received from server:", orders);
        });
        socket.emit('get_stats', (stats: Stats) => {
            setStats(stats)
            console.log("Stats received from server:", stats);
        });
        return () => {
            socket.off('receive_message');
        };
    }, [socket]);


    // Create an order
    const handleCreateOrder = () => {
        if (socket) {
            console.log("message was sent")
            socket.emit('send_order', {
                type,
                amount,
                price,
                time: new Date().toLocaleTimeString()
            });


        }
    }
    return (
        <section className="hero is-fullheight fixed-grid has-4-cols p-4">
            <div className="grid">

                <Statistics stats={stats} />

                <CreateOrder
                    setType={setType}
                    setAmount={setAmount}
                    setPrice={setPrice}
                    handleCreateOrder={handleCreateOrder} />
                <Sell
                    setType={setType}
                    setAmount={setAmount}
                    setPrice={setPrice}
                    handleCreateOrder={handleCreateOrder}
                />
                <BidList orders={orders} />
                <OrdersList orders={orders} />
                <ActiveOrders socket={socket} />
                <OrderHistory socket={socket} />
                <AskList orders={orders} />
            </div>
        </section>

    );
}