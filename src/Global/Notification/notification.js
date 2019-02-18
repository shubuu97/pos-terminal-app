import React from 'react';

const Notification = (props) => {
    return (
        <div className="notification-card">
            <div className="notification-title">
                <span>{props.title}</span>
            </div>
            <div className="notification-time">
                <span>{props.time}</span>
            </div>
            <div className="notification-body">
                <span className="notiifcation-msg">{props.message}</span>
            </div>
        </div>
    )
}

export default Notification;