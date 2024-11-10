import React from 'react';

import "../styles/dashboard.css"


function Timer({time}) {
    const formatTime = (timeInSeconds) => {
        const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(timeInSeconds % 60).padStart(2, '0');
        return `${hours} Hr :${minutes} Min : ${seconds} Sec`;
      };
      
      return (
      <div className='timer-container'>
        <h1>{formatTime(time)}</h1>
      </div>
    );
  }
  
  export default Timer;