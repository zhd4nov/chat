import Message from './Message';

export const getAllUsers = async (request, response) => {
  const messages = await Message.getAllMessages();
  response.json(messages);
};

export const getChatMessages = async (request, response) => {
  const { chatid } = request.params;
  const messages = await Message.getMessagesByChatId(chatid);
  response.json(messages);
};
