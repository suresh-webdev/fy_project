import React,{ useState, useEffect } from "react";
import "../styles/dashboard.css"
import ReactSpeedometer from "react-d3-speedometer";




function OEEmeter({availability,performance,maintenance,value}){

    return (
      <div className="oee-container">
      <h2>OEE: {value}</h2>
      <div className="oee-wrapper">
        <div className="speedometer">
          <ReactSpeedometer
            value={value}
            maxValue={100}
            segments={3}
            needleColor="black"
            customSegmentStops={[0, 30, 70, 100]}  // Start of each segment
            segmentColors={["red", "yellow", "green"]}
            startColor="red"
            endColor="green"
            width={250}
            height={140}
            valueTextFontSize="0"
            needleTransition="easeQuadInOut"
            needleTransitionDuration={1000}  // Duration in ms
            needleHeightRatio={0.8}  // Adjust needle length
          />
        </div>
        <div className="bar-container">
          <div className="progress-bar">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium dark:text-black">Availability</span>
              <span className="text-sm font-medium text-blue-700 dark:text-black">{availability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${availability}%` }}></div>
            </div>
          </div>

          <div className="progress-bar">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium dark:text-black">Performance</span>
              <span className="text-sm font-medium dark:text-black">{performance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${performance}%` }}></div>
            </div>
          </div>

          <div className="progress-bar">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium dark:text-black">Maintenance</span>
              <span className="text-sm font-medium dark:text-black">{maintenance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${maintenance}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}

export default OEEmeter;