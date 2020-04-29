import User from './User';

export const getUsers = async (request, response) => {
  const users = await User.getAllUsers();
  response.json(users);
}

export const welcomeFriend = (request, response) => {
  // get chatId
  const { chatId } = request.params;
  // define path to app entry
  const homePath = process.env.NODE_ENV === 'production'
    ? '/'
    : 'http://localhost:5001';
  response.cookie('invite', chatId);
  response.redirect(homePath);
};
