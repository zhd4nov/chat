import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

const defaultState = { AllIds: {}, ByIds: [] };
const defaultStateForCurrent = { id: '' };
const defaultUIState = {};


const chats = handleActions({}, defaultState);
const users = handleActions({}, defaultState);
const messages = handleActions({}, defaultState);

const currentUser = handleActions({}, defaultStateForCurrent);
const currentChat = handleActions({}, defaultStateForCurrent);

const UIState = handleActions({}, defaultUIState);

export default combineReducers({
  users,
  chats,
  messages,
  currentUser,
  currentChat,
  UIState,
});
