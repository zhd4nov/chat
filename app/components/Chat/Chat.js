import { nanoid } from "nanoid";
import { readFile, updateFile } from "../../helpers/fs";

export default class Chat {
  constructor(chatName, userID) {
    this.id = nanoid();
    this.name = chatName || 'default';
    this.hostUserID = userID || null;
    this.memberIDs = [this.hostUserID];
  }

  static async getAllChats() {
    const data = await readFile('chats.json');
    return data;
  }

  static async updateChats(chats) {
    try {
      await updateFile('chats.json', chats);
      return true;
    } catch (err) {
      console.log('Error update chats', err);
      return false;
    }
  }

  async saveChat() {
    const chats = await this.constructor.getAllChats();
    chats.push(this);
    this.constructor.updateChats(chats);
  }

  async removeChat() {
    const currentChats = await this.constructor.getAllChats(); // static method
    const newChats = currentChats.filter((chat) => chat.id !== this.id);
    this.constructor.updateChats(newChats);
  }

  async renameChat(newName) {
    const chats = await this.constructor.getAllChats(); // static method
    const [targetChat] = chats.filter((chat) => chat.id === this.id);
    targetChat.name = newName;
    this.constructor.updateChats(chats);
  }

  getChatID() {
    return this.id;
  }

  getMemberIDs() {
    return this.memberIDs;
  }

  appendMemberID(userID) {
    this.memberIDs.push(userID);
  }

  removeMemberID(userID) {
    this.memberIDs = this.memberIDs.filter((id) => userID !== id);
  }
}
