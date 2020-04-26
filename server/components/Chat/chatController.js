import Chat from './Chat';

export const getChats = async (request, response) => {
  const chats = await Chat.getAllChats();
  response.json(chats);
};

export const addNewChat = (request, response) => {
  const { userid, chatname } = request.query;

  const chat = new Chat(chatname, userid);
  chat.saveChat();

  response.redirect('/chats');
}
