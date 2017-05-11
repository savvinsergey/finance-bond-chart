import React from 'react';

import BondChart from './bond-chart.react';
import BondInfo from './bond-info.react';

import BondStore from '../stores/bond-store';

export default class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            name: ''
        };
    }

    componentWillMount(){
        this.setState({
            name : BondStore.getName()
        });
    }

    render(){
        return (
            <div>
                <BondInfo name={this.state.name}/>
                <BondChart name={this.state.name}/>
            </div>
        ); 
    }
    
}