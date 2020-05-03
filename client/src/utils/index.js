import axios from 'axios';
import consts from '../consts';

// Use closure to building a universal fetch
const fetchData = (resource, ...restPath) => async () => {
  // ** [, ...restPath] is optional, should contain strings **
  let path;
  if (restPath.length > 0) {
    path = restPath.join('/') // restPath contains something
  } else {
    path = ''; // restPath is empty
  }

  // Use destructuring to get data from server response
  const { data } = await axios.get(
    `${consts.SOCKET_URL}/${resource}/${path}`,
  );

  return data;
};

export default fetchData;

// Resources for request builder
export const resource = {
  messages: 'messages',
  chats: 'chats',
  users: 'users',
};
