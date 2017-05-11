import moment from 'moment';

import AppDispatcher from "../dispatcher/app-dispatcher";
import {ActionTypes} from "../constants/bond-constants";
import {EventEmitter} from "events";

//------------- private ----------------//

let _bonds = {},
    _currentName = "NII CAPITAL", // name is hardcoded
    _currentDataType = "price",
    _currentPeriod = "week";

function _initMainInfoStructure(name) {
    _bonds[name] = {
        "mainInfo" : {
            "name" : "",
            "fullName" : "",
            "code" : "",
            "currentValue" : "",
            "currency" : "",
            "till" : ""
        }
    }
}

function _initHistoricalDataStructure() {
    if (!_bonds[_currentName]) {
        _bonds[_currentName] = {};
    }

    if (!_bonds[_currentName][_currentPeriod]) {
        _bonds[_currentName][_currentPeriod] = {};
    }

    if (!_bonds[_currentName][_currentPeriod][_currentDataType]) {
        _bonds[_currentName][_currentPeriod][_currentDataType] = [];
    }
}

function _parseMainInfo(action) {
    _bonds[_currentName]['mainInfo'] = {
        "name" : action.data.name,
        "fullName" : action.data.fullName,
        "code" : action.data.code,
        "currentValue" : action.data.currentValue,
        "currency" : action.data.currency,
        "till" : action.data.till
    };
}

function _parseHistoricalData(action) {
    if (!action.data.historicalData[_currentPeriod][_currentDataType]) {
        alert("Mock data is available only for Week and Month periods");
        return;
    }

    _bonds[_currentName][_currentPeriod][_currentDataType] = action.data.historicalData[_currentPeriod][_currentDataType].map(item => {
        let timestamp = +moment(item[0],"YYYY-MM-DD").format('x');
        return [timestamp, +item[1]];
    }).sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0;
    });
}

function _parseData(action){
    _parseMainInfo(action);
    _parseHistoricalData(action);
}

//------------- public ----------------//

class StockStore extends EventEmitter{
    constructor(props){
        super(props);

        AppDispatcher.register(action => {
            switch(action.actionType){
                case ActionTypes.RECEIVE_BOND_DATA:
                    _initHistoricalDataStructure();

                    if (!_bonds[_currentName][_currentPeriod][_currentDataType].length) {
                        _parseData(action);
                    }

                    this.emit("changeData");
                    break;
                case ActionTypes.RECEIVE_BOND_PERIOD:
                    _currentPeriod = action.data.period;
                    this.emit("changePeriod");
                    break;
                case ActionTypes.RECEIVE_BOND_DATATYPE:
                    _currentDataType = action.data.dataType;
                    this.emit("changeDataType");
                    break;
            }
        });
    }

    getMainInfo(name) {
        if (!_bonds[name]) {
            _initMainInfoStructure(name);
        }

        return _bonds[name]["mainInfo"];
    }

    getData(name, period, dataType) {
        if (!_bonds[name] ||
            !_bonds[name][period] ||
            !_bonds[name][period][dataType]) {
            return [];
        }

        return _bonds[name][period][dataType];
    }

    getName() {
        return _currentName;
    }

    getPeriod() {
        return _currentPeriod;
    }

    getDataType() {
        return _currentDataType;
    }
}

export default new StockStore();