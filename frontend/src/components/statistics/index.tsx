import { useNavigate } from "react-router-dom"
import logo from "../../assets/blockPairLogo.png";

type Stats = {
    TotalTrades: number,
    USDBalance: number,
    BTCBalance: number,
}
type StatsProps = {
    stats: Stats
};

export default function Statistics({stats}:StatsProps) {
    const navigate = useNavigate()
    // log out
    const handleLogOut = () => {
        localStorage.removeItem("token")
        navigate('/')
    }
    return (
        <div className=" is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">
            <div className="is-flex is-justify-content-center is-gap-2" >
                <div className="has-text-centered" >

                    <figure className=" image is-48x48 is-inline-block" >
                        <img src={logo} />
                    </figure>
                </div>
                <h2 className="title has-text-centered">Statistics</h2>
            </div>
            <div>
                <h3 className="title is-5">Total trades</h3>
                <p>{stats.TotalTrades}</p>
            </div>
            <div>
                <h3 className="title is-5">Current Balance USD</h3>
                <p>{stats.USDBalance}</p>
            </div>
            <div>
                <h3 className="title is-5">Current Balance BTC</h3>
                <p>{stats.BTCBalance}</p>

            </div>
            <div className="">
                <button className='button' onClick={() => { handleLogOut() }}>Log Out</button>
            </div>
        </div>
    )
}