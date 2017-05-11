// import axios from 'axios';

import BondActions from "../actions/bond-actions";
import data from '../../data/data.json';

//------------- private ----------------//

function _requestToServer(bondName, periodType, dataType) {
    setTimeout(() => {
        BondActions.receiveBondData(data);
    },1000);

    /* Request to external API. Example
    axios.get('http://data.com/data.json', {
        params: {
            name: bondName ,
            period: periodType,
            dataType : dataType
        }
    }).then(response => {
        if (response.data) {
            BondActions.receiveBondData(response.data);
        }
    })
    */
}

//------------- public ----------------//

export default {
    fetchData(bondName, periodType, dataType){
        return _requestToServer(bondName, periodType, dataType);
    }
}