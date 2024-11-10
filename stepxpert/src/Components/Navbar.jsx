import React from "react";
import "../styles/dashboard.css"
import { FaUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import logo from "../logo.png";

function Navbar({ startTimer, pauseTimer, stopTimer }){
    return (
        <div className="nav-container">
           <div className="timer controllers">
        <button
          type="button"
          className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={startTimer}
        >
          Start
        </button>
        <button
          type="button"
          className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
          onClick={pauseTimer}
        >
          Pause
        </button>
        <button
          type="button"
          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={stopTimer}
        >
          End
        </button>
      </div>
            <div className="logo">
                <img src={logo} alt="logo" className="nav-logo" /> 
            </div>
            <div className="profile-container">
                <FaUserCircle className="profile"/>
                <h2>User</h2>
                <LuLogOut className="profile logout"/>
            </div>
        </div>
    );
}

export default Navbar;