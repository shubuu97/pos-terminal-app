import React, { Component } from 'react';

export default class DynamicImport extends Component {
    constructor(props) {
        super(props);
        this.state={
            component:null
        }

    }
    componentWillMount() {
        this.props.load().then((module) =>this.setState({component:module.default})
    )
    }

    render() {
   return  this.props.children(this.state.component)
    }

}
