import React from 'react';
import "../styles/dashboard.css";

function VideoStream() {
  return (
    <div className='video-container'  style={{ display: 'flex', justifyContent: 'center',width: '50%'}}>
      <img src="http://localhost:5000/video_feed" alt="Loading..." width="450"  />
    </div>
  );
}

export default VideoStream;
