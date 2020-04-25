import User from './User';

export const getUsers = async (request, response) => {
  const users = await User.getAllUsers();
  response.json(users);
}
