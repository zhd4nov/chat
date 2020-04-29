import { updateFile, readFile } from '../../helpers/fs';

export default class User {
  // User can be invite (comes by an invitation link) or direct (direct link)
  constructor(userID, name, type = 'direct') {
    this.id = userID;
    this.name = name;
    this.type = type;
  }

  static async getAllUsers() {
    const data = await readFile('users.json');
    return data;
  }

  getUserID() {
    return this.id;
  }

  getUserType() {
    return this.type;
  }

  getUserName() {
    return this.name;
  }

  setUserName(name) { // string
    // TODO guard expression
    // if user made a mistake user can update his name
    this.name = name;
    // return new name
    return this.name;
  } // TODO: implement feture

  async save() {
    const users = await this.constructor.getAllUsers(); // static method
    users.push(this);
    this.updateUsers(users);
  }

  async remove() {
    const currentUsers = await this.constructor.getAllUsers(); // static method
    const newUsers = currentUsers.filter((user) => user.id !== this.id);
    this.updateUsers(newUsers);
  }

  async updateUsers(users) {
    try {
      await updateFile('users.json', users);
      return true;
    } catch (err) {
      console.log('Error update users', err);
      return false;
    }
  }
}