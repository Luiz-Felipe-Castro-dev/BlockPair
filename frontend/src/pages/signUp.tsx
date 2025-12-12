import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/blockPairLogo.png";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleSignUp = async () => {
        try {

            const response = await axios.post(`${apiUrl}/user`, {
                name: name,
                password: password
            })
            if (response.status == 200) {

                const token = response.data.token
                localStorage.setItem("token", token)
                navigate('/orders')
            } else {
                alert("senha e/ou usuário incorretos")
            }
        } catch (error) {
            console.log(error)
            alert("senha e/ou usuário incorretos")
        }
    }
    return (
        <section className=" hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="box is-flex is-flex-direction-column 
            is-justify-content-center is=align-items-space-between is-gap-2">
                
                <div className="has-text-centered" >

                    <figure className=" image is-128x128 is-inline-block" >
                        <img src={logo} />
                    </figure>
                </div>
                <h2 className="title has-text-centered">

                    Sign Up Page
                </h2>

                <p className="has-text-centered"> Please use the form bellow to Sign Up</p>
                <form action="" className="form">
                    <label htmlFor="username" className="label">Username</label>
                    <input type="text" className="input" id="username"
                        onChange={(e) => { setName(e.target.value) }} />

                    <label htmlFor="password" className="label">Password</label>
                    <input type="password" className="input" id="password"
                        onChange={(e) => { setPassword(e.target.value) }} />
                </form>
                <button className="button" onClick={() => { handleSignUp() }}> Sign Up</button>
                <button className="button" onClick={() => { navigate('/') }}> Back To Login</button>

            </div>
        </section>

    );
}