import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import OrderHistory from "../components/orderHistory";
import ActiveOrders from "../components/activeOrders";
import CreateOrder from "../components/createOrder";
import OrdersList from "../components/ordersList";

export default function OrdersPage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);

    // order variables
    const [type, setType] = useState('USDtoBTC');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const navigate = useNavigate()
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

    // log out
    const handleLogOut = () => {
        localStorage.removeItem("token")
        navigate('/')
    }
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
                <div className=" is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">
                    <h2>statistics</h2>
                    <div className="">
                        <button className='button' onClick={() => { handleLogOut() }}>Log Out</button>
                    </div>
                </div>
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