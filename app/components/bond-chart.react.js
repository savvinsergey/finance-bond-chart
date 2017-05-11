import React from 'react';
import Highcharts from 'highcharts-release';

import BondAPI from '../api/bond-api';
import BondActions from "../actions/bond-actions";
import BondStore from '../stores/bond-store';

export default class BondChart extends React.Component {

    constructor(props){
        super(props);
        let period = BondStore.getPeriod();
        let dataType = BondStore.getDataType();

        this.state = {
            period : period,
            dataType : dataType,
            data   : BondStore.getData(this.props.name, period, dataType),
        };

        this.changePeriod = this.changePeriod.bind(this);
        this.changeDataType = this.changeDataType.bind(this);
    }

    componentWillMount(){
        BondAPI.fetchData(this.props.name, BondStore.getPeriod(), BondStore.getDataType());
        BondStore.on('changeData',() => {
            this.onChangeData();
        });
        BondStore.on('changePeriod',() => {
            BondAPI.fetchData(this.props.name, BondStore.getPeriod(), BondStore.getDataType());
        });
        BondStore.on('changeDataType',() => {
            BondAPI.fetchData(this.props.name, BondStore.getPeriod(), BondStore.getDataType());
        });
    }

    renderChart(){
        this.chart = new Highcharts.chart({

            chart: {
                type: 'spline',
                renderTo: this.refs.chart
            },

            xAxis: {
                tickInterval: 24 * 3600 * 1000,
                tickWidth: 0,
                gridLineWidth: 1,
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e %b %Y'
                }
            },

            yAxis: {
                title: {
                    text: this.state.dataType.slice(0, 1).toUpperCase() + this.state.dataType.slice(1)
                }
            },

            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },

            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },

            title: {
                text: `${this.props.name} Bond historical data`
            },

            series: [{
                name: this.props.name,
                data: this.state.data,
                color: "#ccc"
            }]
            
        });
    }

    changePeriod(period){
        BondActions.receiveBondPeriod(period);
    }

    changeDataType(e){
        BondActions.receiveBondDataType(e.target.value);
    }

    onChangeData(){
        let period = BondStore.getPeriod();
        let dataType = BondStore.getDataType();
        let data = BondStore.getData(this.props.name, period, dataType);

        this.setState({ data, period, dataType },() => this.renderChart());
    }

    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-md-10">
                        <label className="center-block">Period: </label>
                        <div className="btn-group">
                            <button type="button"
                                    className={"btn " + ( this.state.period === "week"   ? "btn-success" : "btn-default")}
                                    onClick={() => this.changePeriod("week")}> Week </button>
                            <button type="button"
                                    className={"btn " + ( this.state.period === "month" ? "btn-success" : "btn-default")}
                                    onClick={() => this.changePeriod("month")}> Month </button>
                            <button type="button"
                                    className={"btn " + ( this.state.period === "quarter"  ? "btn-success" : "btn-default")}
                                    onClick={() => this.changePeriod("quarter")}> Quarter </button>
                            <button type="button"
                                    className={"btn " + ( this.state.period === "year"  ? "btn-success" : "btn-default")}
                                    onClick={() => this.changePeriod("year")}> Year </button>
                            <button type="button"
                                    className={"btn " + ( this.state.period === "max"  ? "btn-success" : "btn-default")}
                                    onClick={() => this.changePeriod("max")}> Max </button>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label>Type of values: </label>
                            <select className="form-control" onChange={this.changeDataType} value={this.state.dataType}>
                                <option value="yield">
                                    Yield
                                </option>
                                <option value="spread">
                                    Spread
                                </option>
                                <option value="price">
                                    Price
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={"chart " + ( this.state.data.length ? "show" : "hidden") } ref="chart"></div>
                <div className={ !this.state.data.length ? "show" : "hidden" } >
                    <h4>Data is not available</h4>
                </div>
                    <br/><br/>
            </div>
        )
    }

}