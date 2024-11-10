import React from "react";
import "../styles/dashboard.css"

function Notification(count){
    return (
        <div className="notification-container">
            <h2>NOTIFICATION</h2>
            <p className="notification-cnt">{count?.count ?? 0}</p>
            <p className="error-msg">SOP Violation: Detected<br/>
               Critical motion failure reported at Hand 2 <br/>
               Possible Reason: Hand bearing malfunction</p>
        </div>
    );
}

export default Notification;