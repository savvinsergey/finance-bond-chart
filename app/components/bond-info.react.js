import React from 'react';

import BondStore from '../stores/bond-store';

export default class BondInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = BondStore.getMainInfo(this.props.name);
    }

    componentWillMount(){
        BondStore.on('changeData',() => {
            this.onChangeData();
        });
    }

    onChangeData(){
        const data = BondStore.getMainInfo(this.props.name);
        this.setState(data);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className={this.state.name ? "show" : "hidden"}>
                        <h1>
                            { this.state.name } { this.state.currentValue }
                            <small>{ this.state.currency.toUpperCase() }</small>
                        </h1>
                        <h4>{ this.state.code }</h4>
                        <h4>{ this.state.fullName }, till {this.state.till}</h4>
                    </div>
                    <hr/>
                </div>
            </div>
        )
    }

}