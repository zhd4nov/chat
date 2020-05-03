import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import * as actions from '../actions';

const defaultState = { byIds: {}, allIds: [] };
const defaultStateForCurrent = {};
const defaultUIState = {};

const users = handleActions(
  {
    [actions.updateUsersSuccess]: (state, { payload: { users } }) => { // users is [objects]
      // Create array with all user ids
      const allIds = users.map((user) => user.id);
      // Create object with users where key is user id and value is user object
      const byIds = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

      return { byIds, allIds };
    },
  },
  defaultState,
);


const chats = handleActions(
  {
    [actions.updateChatsSuccess]: (state, { payload: { chats } }) => { // chats is [objects]
      // Create array with all chat ids
      const allIds = chats.map((chat) => chat.id);
      // Create object with chats where key is chat id and value is chat object
      const byIds = chats.reduce((acc, chat) => ({ ...acc, [chat.id]: chat }), {});

      return { byIds, allIds };
    },
  },
  defaultState,
);

const messages = handleActions(
  {
    [actions.updateMessagesSuccess]: (state, { payload: { messages } }) => { // messages is [objects]
      // Create array with all messages ids
      const allIds = messages.map((messages) => messages.id);
      // Create object with messages where key is messages id and value is messages object
      const byIds = messages.reduce((acc, messages) => ({ ...acc, [messages.id]: messages }), {});

      return { byIds, allIds };
    },
  },
  defaultState,
);

const currentUser = handleActions(
  {
    [actions.setCurrentUser]: (state, { payload: { user } }) => {
      return user;
    },
  },
  defaultStateForCurrent,
);

const currentChat = handleActions(
  {
    [actions.setCurrentChat]: (state, { payload: { chatId } }) => chatId,
  },
  defaultStateForCurrent,
);

const UIState = handleActions({}, defaultUIState);

export default combineReducers({
  users,
  chats,
  messages,
  currentUser,
  currentChat,
  UIState,
});
