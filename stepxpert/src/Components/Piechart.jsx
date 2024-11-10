import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "../styles/dashboard.css" 


// Register the components required for the chart
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ completed, violated, yetToComplete }) => {
  // Chart data
  const data = {
    labels: ['Completed Success', 'Violated', 'Yet to Complete'],
    datasets: [
      {
        label: 'Production Statistics',
        data: [completed, violated, yetToComplete], // Values passed as props
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'], // Custom colors for the chart segments
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Ensure chart fits the container
    cutout: '60%', // Make it a donut chart by cutting out the middle
    plugins: {
      legend: {
        display: true, // Display the legend
        position: 'right', // Position the legend at the bottom
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '130px' }}> {/* Set width and height of the chart */}
      <Doughnut data={data} options={options} />
    </div>
  );
};

function Piechart() {
  const completed = 60;
  const violated = 20;
  const yetToComplete = 20;

  return (
    <div className='chart-container'>
      <h2>Production Statistics:</h2>
      <DonutChart
        className="donut"
        completed={completed}
        violated={violated}
        yetToComplete={yetToComplete}
      />
    </div>
  );
};

export default Piechart;
