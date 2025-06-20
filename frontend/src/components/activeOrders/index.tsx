import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
type OrderHistoryProps = {
    socket: Socket | null;
};
export default function ActiveOrders({ socket }: OrderHistoryProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (!socket) return;


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit('get_active_orders_user', (orders: any) => {
            setOrders(orders)
            console.log("Orders for user received from server:", orders);
        });


        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    async function cancelOrder(orderID: number) {
        if (!socket) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.emit('cancel_order', { orderId: orderID }, (orderID: any) => {
            alert(`${orderID} order cancelled`)
            console.log("Orders cancelled", orderID);
        });

    }
    return (
        <div className="is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">
            <h1 className="title">Active Orders</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Quantia</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>User ID</th>
                        <th>Cancel</th>
                    </tr>
                </thead>
                <tbody>

                    {orders.map((order) => (
                        <tr>
                            <td >{order.id}</td>
                            <td >{order.coinType}</td>
                            <td >{order.amount}</td>
                            <td >{order.price}</td>
                            <td >{order.status}</td>
                            <td >{order.userId  }</td>
                            <td onClick={() => { cancelOrder(order.id) }}>X</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
} 
