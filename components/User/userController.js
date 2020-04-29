import User from './User';

export const getUsers = async (request, response) => {
  const users = await User.getAllUsers();
  response.json(users);
}

export const welcomeFriend = (request, response) => {
  // get chatId
  const { chatId } = request.params;
  response.cookie('invite', chatId);
  response.redirect('http://localhost:5001');
};
