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
  // TODO: It's not safe. NEED to forbid usage a few tabs with app (x).
  // There is risk of bugs because app can't recognize user yet
  response.cookie('invite', chatId, { expires: 0 });
  response.redirect(homePath);
};
