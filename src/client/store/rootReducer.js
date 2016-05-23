import {combineReducers} from 'redux';
import user from '../account/store/user';
import bars from '../main/store/bars';

const rootReducer = combineReducers ({
  user,
  bars
});

export default rootReducer;
