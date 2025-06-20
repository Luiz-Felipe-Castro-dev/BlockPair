import { SetStateAction, Dispatch } from "react";

type CreateOrderProps = {
    setType: Dispatch<SetStateAction<string>>,
    setAmount: Dispatch<SetStateAction<number>>,
    setPrice: Dispatch<SetStateAction<number>>,
    handleCreateOrder: () => void,
};

export default function CreateOrder({
    setType,
    setAmount,
    setPrice,
    handleCreateOrder
}: CreateOrderProps) {

    return (
        <div className="is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">
            <h1 className="title">Create order</h1>
            <label htmlFor="Type" className="label">Type</label>
            <div className="select">
                <select onChange={(e) => { setType(e.target.value) }}>
                    <option value={"USDtoBTC"}>Buy BTC</option>
                    <option value={"BTCtoUSD"}>Buy USD</option>
                </select>
            </div>

            <label htmlFor="amount" className="label">Amount</label>
            <input type="number" className="input" id="amount"
                onChange={(e) => { setAmount(Number(e.target.value)) }} />

            <label htmlFor="price" className="label">Price</label>
            <input type="number" className="input" id="price"
                onChange={(e) => { setPrice(Number(e.target.value)) }} />
            <button className="button" onClick={() => { handleCreateOrder() }}
            >Confirm</button>
        </div>
    )
} 
