type Order = {
    id: number,
    amount: number,
    coinType: number,
    price: number,
    status: string,
    userId: number,
}
type OrderHistoryProps = {
    orders: Order[];
};
export default function OrdersList({ orders }: OrderHistoryProps) {
    return (
        <div className=" is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">

            <h2 className="title has-text-centered">

                Orders list
            </h2>
            <div className="scroll-y">

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Quantia</th>
                            <th>Preço</th>
                            <th>Status</th>
                            <th>User ID</th>
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
                                <td >{order.userId}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    )
}