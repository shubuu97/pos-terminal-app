import React, { Component } from 'react';
import _get from 'lodash/get';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToRender: props.data[0].component,
            activeItem: props.data[0].label
        }
    }

    handleComponentToRender = (label, pathname) => {
        this.props.history.push(`/${this.props.routePath}/${pathname}`)
        _get(this.props, 'data').map(listData => {
            if(listData.label == label) {
                this.setState({ 
                    componentToRender : listData.component,
                    activeItem: listData.label
                })
            }
        })
    }

    render() {
        return (
            <div className="about-section">
                <div className="col-sm-12 card" >
                    <div className="row">
                        <div className="col-sm-3" >
                            <ul className="about-tab">
                            {_get(this.props, 'data').map(listItem => {
                                return <li className={`${listItem.extraClass ? listItem.extraClass : ''} ${this.state.activeItem === listItem.label ? 'active' : ''}`} onClick={() => this.handleComponentToRender(listItem.label, listItem.path)}>{listItem.label}</li>
                            })}
                            </ul>
                        </div>
                        <div className="col-sm-9" >
                            <div className="mtrb-12">
                                <this.state.componentToRender />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SideBar;
