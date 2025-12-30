import {  useState } from "react";

type Order = {
    id: number,
    amount: number,
    coinType: string,
    price: number,
    status: string,
    userId: number,
}
type AskListProps = {
    orders: Order[];
};
export default function AskList({ orders }: AskListProps) {
    const [type, setType] = useState("USDtoBTC");

    return (
        <div className=" is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">

            <h2 className="title has-text-centered">
                Asks
            </h2>
            <div className="select">
                <select onChange={(e) => { setType(e.target.value) }}>
                    <option value={"BTCtoUSD"}>BTC asks</option>
                    <option value={"USDtoBTC"}>USD asks</option>
                </select>
            </div>
            <div className="scroll-y">

                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Price</th>
                            <th>Status</th>
                            {/* <th>User ID</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter(order => order.coinType !== type).map((order) => (
                            <tr>
                                {/* <td >{order.id}</td> */}
                                <td >{order.coinType}</td>
                                <td >{order.amount}</td>
                                <td >{order.price}</td>
                                <td >{order.status}</td>
                                {/* <td >{order.userId}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}