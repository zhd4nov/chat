import User from './User';

export const createUser = (request, response) => {
  const { name, type } = request.query;
  const user = !type ? new User(name, 'solo') : new User(name, type);
  user.save()
  response.redirect('/users');
};
