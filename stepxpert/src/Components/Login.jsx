import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/dashboard.css";
import { FaUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import logo from "../login_logo.png";

function Login() {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState("");
    const [targetCount, setTargetCount] = useState("");
    const [workingArea, setWorkingArea] = useState("");
    const[productID,setProductID]=useState("");

    const handleSubmit = () => {
        // Store details in localStorage
        localStorage.setItem("loginId", loginId);
        localStorage.setItem("targetCount", targetCount);
        localStorage.setItem("workingArea", workingArea);
        localStorage.setItem("productID", productID);
        // Redirect to /dashboard
        navigate("/dashboard");
    };

    return (
        <div className='login-container'>
            <div className="nav-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="profile-container">
                    <FaUserCircle className="profile" />
                    <h2>User</h2>
                    <LuLogOut className="profile logout" />
                </div>
            </div>

            <div className="login-form">
                <img src={logo} alt="logo" className="login-logo" style={{ width: "30%" }} />
                <form className='login-form-container' onSubmit={(e) => e.preventDefault()}>
                    <div className='login input'>
                        <input
                            className="login id"
                            id="login_id"
                            type="text"
                            placeholder='Enter ID'
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </div>

                    <div className="login input">
                        <input
                            className="target-count"
                            id="target_count"
                            type="text"
                            placeholder='Enter Target Count'
                            value={targetCount}
                            onChange={(e) => setTargetCount(e.target.value)}
                        />
                    </div>

                    <div className="login input">
                        <select
                            className="working-area"
                            id="grid-state"
                            value={workingArea}
                            onChange={(e) => setWorkingArea(e.target.value)}
                        >
                            <option disabled selected>Enter the number of working areas</option>
                            {[...Array(8).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="login input">
                        <input
                            className="target-count"
                            id="target_count"
                            type="text"
                            placeholder='Enter Product ID'
                            value={targetCount}
                            onChange={(e) => setProductID(e.target.value)}
                        />
                    </div>

                    <div className="login-btn-container">
                        <button className="login-btn" type="button" onClick={handleSubmit}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
