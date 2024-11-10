import React from 'react';
import "../styles/dashboard.css";

function PerformanceTracker({totalCount,sopViolation,target}){
    return(
        <div className='performance-container'>
            <div className='total-count'>
                <h2 className='pc-heading'>TOTAL COUNT</h2>
                <p className='pc-values'>{totalCount}</p>
            </div>
            <div className='sop-violation'>
                <h2 className='pc-heading'>SOP VIOLATION</h2>
                <p className='pc-values'>{sopViolation}</p>
            </div>
            <div className='target'>
                <h2 className='pc-heading'>TARGET</h2>
                <p className='pc-values'>{target}</p>
            </div>
        </div>
    );
}

export default PerformanceTracker;