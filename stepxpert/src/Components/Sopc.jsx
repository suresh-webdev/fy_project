// import React from "react";
// import "../styles/dashboard.css"

// function Sopc({steps}){
//     return(
//         <div className="sopc-container">
//             <h2>SOP Compliance {steps} </h2>
//             <div className="steps-wrapper">
//                 {Array.from({ length: steps }, (_, index) => (
//                     <div 
//                         key={index} 
//                         className={`step ${index === 0 ? 'active' : ''}`}
//                     >
//                         STEP {index + 1}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Sopc;
import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";

function Sopc({ steps }) {
    const [activeStep, setActiveStep] = useState(0); // Initial active step is 0

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/stream');

        eventSource.onmessage = function(event) {
            console.log("Received message:", event.data);
            const stepNumber = JSON.parse(event.data); // Assuming the server sends an integer representing active steps
            setActiveStep(stepNumber); // Update the active step
        };

        eventSource.onerror = function(error) {
            console.error("Error occurred:", error);
        };

        return () => {
            eventSource.close(); // Clean up when the component is unmounted
        };
    }, []);

    return (
        <div className="sopc-container">
            <h2>SOP Compliance</h2>
            <div className="steps-wrapper">
                {Array.from({ length: steps }, (_, index) => (
                    <div
                        key={index}
                        className={`step ${index < activeStep ? 'active' : ''}`} // Set active class based on the step index
                    >
                        STEP {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sopc;
