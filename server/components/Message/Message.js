import { nanoid } from 'nanoid';
import { readFile, updateFile } from "../../helpers/fs";

export default class Message {
  constructor(userId, userName, chatId, text) {
    this.id = nanoid();
    this.text = text;
    this.authorName = userName;
    this.authorId = userId;
    this.chatId = chatId; // Always one
    this.timestamp = '16:30'; // TODO: Set a real timestamp
  }

  static async getAllMessages() {
    const data = await readFile('messages.json');
    return data;
  }

  static async getMessagesByChatId(chatId) {
    const allMessages = await this.getAllMessages();
    const messagesByChatID = allMessages.filter((msg) => msg.chatID === chatId);
    return messagesByChatID;
  }

  async saveMessage() {
    const messages = await this.constructor.getAllMessages();
    messages.push(this);
    this.updateMessages(messages);
  }

  async updateMessages(messages) {
    try {
      await updateFile('messages.json', messages);
      return true;
    } catch (err) {
      console.log('Error update messages', err);
      return false;
    }
  }
  // Delete messages by chatIDs implement .on(disconnect) (i)
}