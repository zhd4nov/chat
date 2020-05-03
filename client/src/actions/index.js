import fetchData, { resource } from '../utils';
import { createAction } from 'redux-actions';

// Create actions for async users update
const updateUsersRequest = createAction('USERS_UPDATE_REQUEST');
const updateUsersSuccess = createAction('USERS_UPDATE_SUCCESS');
const updateUsersFailure = createAction('USERS_UPDATE_FAILURE');

// Async user update
const updateUsers = () => async (dispatch) => {
  // Starting...
  dispatch(updateUsersRequest());

  // Try to fetch users
  try {
    // First, get users from server
    const users = await fetchData(resource.users)();
    dispatch(updateUsersSuccess({ users })); // Dispatch success
  } catch (e) {
    // Debug log...
    console.error(e);
    // Dispatch fail
    dispatch(updateUsersFailure());
  }
};

// Create actions for async chats update
const updateChatsRequest = createAction('CHATS_UPDATE_REQUEST');
const updateChatsSuccess = createAction('CHATS_UPDATE_SUCCESS');
const updateChatsFailure = createAction('CHATS_UPDATE_FAILURE');

const updateChats = () => async (dispatch) => {
  // Starting...
  dispatch(updateChatsRequest());

  // Try to fetch chats
  try {
    // First, get chats from server
    const chats = await fetchData(resource.chats)();
    dispatch(updateChatsSuccess({ chats })); // Dispatch success
  } catch (e) {
    // Debug log...
    console.error(e);
    // Dispatch fail
    dispatch(updateChatsFailure());
  }
};

// Create actions for async messages update
const updateMessagesRequest = createAction('MESSAGES_UPDATE_REQUEST');
const updateMessagesSuccess = createAction('MESSAGES_UPDATE_SUCCESS');
const updateMessagesFailure = createAction('MESSAGES_UPDATE_FAILURE');

const updateMessages = () => async (dispatch) => {
  // Starting...
  dispatch(updateMessagesRequest());

  // Try to fetch messages
  try {
    // First, get messages from server
    const messages = await fetchData(resource.messages)();
    dispatch(updateMessagesSuccess({ messages })); // Dispatch success
  } catch (e) {
    // Debug log...
    console.error(e);
    // Dispatch fail
    dispatch(updateMessagesFailure());
  }
};

// User action
const setCurrentUser = createAction('USER_SET_CURRENT');

// Chat action
const setCurrentChat = createAction('CHAT_SET_CURRENT');

// Wait for refactor (x)
export {
  // Users
  updateUsers,
  updateUsersRequest,
  updateUsersSuccess,
  updateUsersFailure,
  setCurrentUser,
  // Chats
  updateChats,
  updateChatsRequest,
  updateChatsSuccess,
  updateChatsFailure,
  setCurrentChat,
  // Messages
  updateMessages,
  updateMessagesRequest,
  updateMessagesSuccess,
  updateMessagesFailure,
};
