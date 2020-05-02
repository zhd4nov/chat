import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

const defaultState = {};

const UIState = handleActions({}, defaultState);

export default combineReducers({
  UIState,
});
