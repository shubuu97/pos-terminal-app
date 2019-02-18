import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _sample from 'lodash/sample';
/* Pose Imports */
import posed from "react-pose";
import { tween } from "popmotion";
/* Material import */

/* Redux Imports */

/* Images */
import profile1 from '../images/profile1.jpg'
import profile2 from '../images/profile2.jpg'
import profile3 from '../images/profile3.jpg'
import profile4 from '../images/profile4.jpg'

const Expand = posed.div({
    closed: {
        height: '0',
        opacity: 0,
        padding: 0,
        flip: true
    },
    expanded: {
        height: 'auto',
        opacity: 1,
        padding: '15px',
        flip: true
    },
})

class EachRow extends React.Component {

    constructor() {
        super();
        this.state = {
            image: '',
            isExtended: false,
            pose: 'top'
        }
    }

    componentDidMount() {
        this.setState({
            image: _get(_get(this, "props.data", []), 'Image', _sample([profile1, profile2, profile3, profile4]))
        })
    }

    expandCard = () => {
        this.setState(
            { isExtended: !this.state.isExtended }
        )
    }

    render() {
        let rowData = _get(this, "props.data", []);
        return (
            <div className='notification-cards '>
                <div className=' notification-body flex-row flex-space-between' onClick={this.expandCard}>
                    <div className='flex-column card-notification-main'>
                        <div className='notification-card-header-part'>
                            <div className='card-header-task'>{rowData.NotificationType}</div>
                            <div style={{ width: '5px', height: '5px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%' }}
                            ></div>
                            <div className='card-header-time'>{rowData.Time}</div>
                        </div>
                        <div className='notification-card-body-part'>
                            <div className='body-part-info-area'>
                                <div className='body-part-title'>
                                    {rowData.Title}
                                </div>
                                <div className='body-part-desc'>
                                    {rowData.Description}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card-notification-icon'>
                        <img className='card-notification-icon-img' src={_get(this, 'state.image')} />
                    </div>
                </div>

                <Expand className="notification-actions flex-row item" pose={this.state.isExtended ? 'expanded' : 'closed'}>
                    <div className='card-actions'>Reply</div>
                    <div className='card-actions'>Lorem Ispum</div>
                </Expand>
            </div>
        );
    }
}

export default EachRow;