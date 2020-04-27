import { nanoid } from 'nanoid';
import { readFile, updateFile } from "../../helpers/fs";

export default class Message {
  constructor(userId, userName, chatId, text) {
    this.id = nanoid();
    this.text = text;
    this.authorName = userName;
    this.authorId = userId;
    this.chatId = chatId; // Always one
    this.timestamp = new Date(); // REFACTOR ME (x)
    this.time = `${this.timestamp.getHours()}:${this.timestamp.getMinutes()}`;
  }

  static async getAllMessages() {
    const data = await readFile('messages.json');
    return data;
  }

  static async getMessagesByChatId(chatId) {
    const allMessages = await this.getAllMessages();
    const messagesByChatID = allMessages.filter((msg) => msg.chatId === chatId);
    return messagesByChatID;
  }

  static async updateMessages(messages) {
    try {
      await updateFile('messages.json', messages);
      return true;
    } catch (err) {
      console.log('Error update messages', err);
      return false;
    }
  }

  async saveMessage() {
    const messages = await this.constructor.getAllMessages();
    messages.push(this);
    this.constructor.updateMessages(messages);
  }
  // Delete messages by chatIDs implement .on(disconnect) (i)
}