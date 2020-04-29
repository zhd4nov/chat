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

export const getUserChats = async (request, response) => {
  const { userid } = request.params;
  const chats = await Chat.getAllChats();
  const userChats = chats.filter((chat) => chat.memberIDs.includes(userid));
  response.json(userChats); // array.json
}

export const getChatById = async (request, response) => {
  const { chatid } = request.params; // Unzip params
  const chats = await Chat.getAllChats(); // Get all chats
  // Get target chat from the invite with destructuring
  const [targetChat] = chats.filter((chat) => chat.id === chatId);
  // Mission complete
  return targetChat;
};
