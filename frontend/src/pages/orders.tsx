import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import OrderHistory from "../components/orderHistory";
import ActiveOrders from "../components/activeOrders";
import CreateOrder from "../components/createOrder";
import OrdersList from "../components/ordersList";
import Statistics from "../components/statistics";

export default function OrdersPage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);

    // order variables
    const [type, setType] = useState('USDtoBTC');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const newSocket = io('http://localhost:5000', {
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
     
                <Statistics/>
                <OrdersList orders={orders} />
                <CreateOrder
                    setType={setType}
                    setAmount={setAmount}
                    setPrice={setPrice}
                    handleCreateOrder={handleCreateOrder} />
                <OrderHistory socket={socket} />
                <ActiveOrders socket={socket} />
            </div>
        </section>

    );
}