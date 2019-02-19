import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */ 

/* Component Imports */
import CardNotification from '../Global/Components/CardNotification/CardNotification'
/* Images */
import pic1 from './images/pic1.jpg'

// // Todo : Dummy Data Structure
// Todo : Get non copyright images for random pool
// Todo : 

let dummyData = [
    {
        NotificationType : 'Investor Requesting data',
        Time: 'now',
        Title: 'Some Title 1',
        Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        AllowedActions: [],
    },
    {
        NotificationType : 'Investor Offer',
        Time: 'yesterday',
        Title: 'Some Title 2',
        Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        Image:pic1,
        AllowedActions: [],
    },
    {
        NotificationType : 'Loan Approved',
        Time: '12/01/19',
        Title: 'Some Title 3',
        Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        AllowedActions: [],
    },
    {
        NotificationType : 'Account Created',
        Time: '20/12/18',
        Title: 'Some Title 4',
        Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        AllowedActions: [],
    },
]

class CardNotificationTest extends React.Component {

    constructor(){
        super();
        this.state = {
            
        }
    }
    
    render() {
        return (
            <div>
                <CardNotification
                    header='Notifications'
                    data = {dummyData}
                />
            </div>
        );
    }
}

export default CardNotificationTest;