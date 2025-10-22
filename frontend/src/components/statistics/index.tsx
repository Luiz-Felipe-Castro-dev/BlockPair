import { useNavigate } from "react-router-dom"

export default function Statistics() {
        const navigate = useNavigate()
        // log out
    const handleLogOut = () => {
        localStorage.removeItem("token")
        navigate('/')
    }
    return (
        <div className=" is-flex is-flex-direction-column 
        is-justify-content-center is=align-items-space-between is-gap-2 box">
                    <h2>statistics</h2>
                    <div className="">
                        <button className='button' onClick={() => { handleLogOut() }}>Log Out</button>
                    </div>
                </div>
    )
}