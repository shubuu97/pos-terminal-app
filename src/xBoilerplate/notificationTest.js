import React, {Component} from 'react';
import Notification from '../Global/Notification/notification';

const notificationData = [
    {
        "title": "Requests",
        "time": "Sun, 14th Oct'18",
        "message": "You have got an offer from xyz company. You have got an offer from xyz company. You have got an offer from xyz company."
    },
    {
        "title": "Offer",
        "time": "Mon, 26th Oct'20",
        "message": "You have got an offer from xyz company. You have got an offer from xyz company. You have got an offer from xyz company."
    },
    {
        "title": "Requests",
        "time": "Sun, 14th Oct'18",
        "message": "You have got an offer from xyz company. You have got an offer from xyz company. You have got an offer from xyz company."
    },
]

class Notifications extends Component {
    
    render() {
        return (
            <div>
                {notificationData.map(notification => {
                    return <Notification 
                        title={notification.title}
                        time={notification.time}
                        message={notification.message}
                    />
                })}
            </div>
        )
    }
}

export default Notifications;
