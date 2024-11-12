import React,{useState,useEffect} from "react";
import "../styles/dashboard.css"
import { FaUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import logo from "../logo.png";
import { Link } from 'react-router-dom';

function Navbar({ startTimer, pauseTimer, stopTimer }){

  const [username, setUsername] = useState("");

  useEffect(() => {
      // Retrieve the username from localStorage
      const storedUsername = localStorage.getItem("loginId");
      if (storedUsername) {
          setUsername(storedUsername);
      }
  }, []);
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
                <h2>{username}</h2>
                <Link to="/login"> 
                  <LuLogOut className="profile logout" />
                </Link>
            </div>
        </div>
    );
}

export default Navbar;