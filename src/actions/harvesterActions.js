import appDispatcher from '../dispatcher/appDispatcher.js';
import {actionType,basketAPI} from '../constants/constants.js';


export default {
    filterByMonth(month) {
        appDispatcher.dispatch({
            type : actionType.GET_HARVESTER_BY_MONTH,
            month
        });
    }
}