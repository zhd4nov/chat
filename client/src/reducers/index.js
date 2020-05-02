import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import * as actions from '../actions';

const defaultState = { ByIds: {}, AllIds: [] };
const defaultStateForCurrent = { id: '' };
const defaultUIState = {};


const chats = handleActions(
  {},
  defaultState,
);

const users = handleActions(
  {
    [actions.updateUserList]: (state, { payload: { users } }) => { // users is [objects]
      // Create array with all user ids
      const AllIds = users.map((user) => user.id);
      // Create object with users where key is user id and value is user object
      const ByIds = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

      return { ByIds, AllIds };
    }
  },
  defaultState,
);

const messages = handleActions(
  {},
  defaultState,
);

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
