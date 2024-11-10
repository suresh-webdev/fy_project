import React from "react";
import "../styles/dashboard.css"

function Sopc({steps}){
    return(
        <div className="sopc-container">
            <h2>SOP Compliance {steps} </h2>
            <div className="steps-wrapper">
                {Array.from({ length: steps }, (_, index) => (
                    <div 
                        key={index} 
                        className={`step ${index === 0 ? 'active' : ''}`}
                    >
                        STEP {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sopc;
