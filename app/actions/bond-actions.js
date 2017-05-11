import AppDispatcher from "../dispatcher/app-dispatcher";
import {ActionTypes} from "../constants/bond-constants";

export default {
    receiveBondData(data) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.RECEIVE_BOND_DATA,
            data
        })
    },
    receiveBondPeriod(period) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.RECEIVE_BOND_PERIOD,
            data: { period }
        })
    },
    receiveBondDataType(dataType) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.RECEIVE_BOND_DATATYPE,
            data: { dataType }
        })
    }
};