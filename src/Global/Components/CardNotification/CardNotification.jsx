import React, { Component } from 'react';
import _get from 'lodash/get';
/* Pose Imports */
import posed from "react-pose";
/* Material Imports*/
import Button from '@material-ui/core/Button';
/* Style Imports*/
import './styles/cardNotification.less'
/* Components Imports*/
import EachRow from './features/EachRow'

// const Parent = posed.ul(config)
// const Child = posed.li(childConfig)

const Overlay = posed.div({
    open: {
        y: 0,
        transition: {
            duration: 1200,
            ease: 'linear'
        },
        delayChildren: 1000,
        staggerChildren: 100
    },
    closed: {
        y: '50vh',
        transition: {
            duration: 2000,
            ease: 'linear'
        },
    },
});

const Item = posed.div({
    open: {
        x: 0,
        opacity: 1
        
    },

    closed: {
        x: 500,
        opacity: 0
    }
})


class CardNotification extends Component {

    constructor() {
        super();
        this.state = {
            isExtended: false,
            isOpen: false,
        }
    }

    componentDidMount() {
        this.setState({
            isOpen: true
        })
    }

    expandCard = () => {
        this.setState(
            { isExtended: !this.state.isExtended }
        )
    }

    render() {
        let allData = _get(this, "props.data", []);
        return (
            <div className='card-notification-container'>

                {
                    this.props.header ?
                        <div className='card-notification-header'>
                            {this.props.header}
                        </div> :
                        null
                }

                <Overlay pose={this.state.isOpen ? 'open' : 'closed'} style={{padding: '10px 40px'}}>
                    {
                        allData ?
                            allData.map((data, index) => {
                                return (
                                    <Item>
                                        <EachRow
                                            data={data}
                                            index={index}
                                        />
                                    </Item>
                                );
                            }) :
                            null
                    }
                </Overlay>

            </div>
        )
    }
}

export default CardNotification;