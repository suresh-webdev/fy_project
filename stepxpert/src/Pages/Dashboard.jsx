// export default Dashboard;
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import OEEmeter from '../Components/OEEmeter';
import Piechart from '../Components/Piechart';
import Notification from '../Components/Notfication';
import Sopc from '../Components/Sopc';
import Timer from '../Components/Timer';
import VideoStream from '../Components/VideoStream';
import PerformanceTracker from '../Components/PerformanceTracker';
import "../styles/dashboard.css" 

function Dashboard(){
    const[value,setValue]= useState(50);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const [oeeData, setOeeData] = useState({
      availability: 0,
      performance: 0,
      maintenance: 0
    });

    const [performanceData,setPerformanceData] = useState({
      totalCount:0,
      sopViolation:0,
      target:0,
      steps:0
    });

    const [userData, setUserData] = useState(null);

    const userId = '4'; // Default user_id for now

    useEffect(() => {
      const fetchData = () => {
        console.log('Fetching user data from API...');
        fetch("http://localhost:5500/api/user/100")
          .then(response => response.json())
          .then(data => {
            console.log('User data fetched:', data);
            if (data) {
              setOeeData({
                availability: data.availability,
                performance: data.performance,
                maintenance: data.maintenance,
              });
              setPerformanceData({
                totalCount: data.total_count,
                sopViolation: data.violated_count,
                target: data.target,
                steps: data.steps
              });
            }
          })
          .catch(error => console.error('Error fetching user data:', error));
      };

      // Initial fetch
      fetchData();

      // Fetch every 3 seconds
      const intervalId = setInterval(fetchData, 3000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }, [userId]);
    
    // Calculate total when any of the OEE data changes
    useEffect(() => {
      const total = Math.floor(oeeData.availability * oeeData.performance * oeeData.maintenance / 10000);
      setValue(total);
    }, [oeeData.availability, oeeData.performance, oeeData.maintenance]);

    // Timer Controllers
    const startTimer = () => {
      if (!isRunning) {
        setIsRunning(true);
        timerRef.current = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      }
    };
  
    const pauseTimer = () => {
      clearInterval(timerRef.current);
      setIsRunning(false);
    };
  
    const stopTimer = () => {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setTime(0);
    };
  
    useEffect(() => {
      return () => clearInterval(timerRef.current); // Clean up the interval on unmount
    }, []);

    return (
      <div className='dashboard-container'>
        <div className='header'>
            <Navbar startTimer={startTimer} pauseTimer={pauseTimer} stopTimer={stopTimer}/>
        </div>
        <div className='dashboard-top'>
            <OEEmeter availability={oeeData.availability} performance={oeeData.performance} maintenance={oeeData.maintenance} value={value}/>
            <Piechart />
            <Notification count={performanceData.sopViolation}/>
        </div>
        <div className='timer'>
            <Timer time={time} />
        </div>
        <div className='dashboard-btm'>
            <Sopc steps={performanceData.steps}/>
            <VideoStream />
            <PerformanceTracker totalCount={performanceData.totalCount} sopViolation={performanceData.sopViolation} target={performanceData.target}/>
        </div>
      </div>
    );
}

export default Dashboard;
