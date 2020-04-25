import { nanoid } from 'nanoid';
import { updateFile, readFile } from '../../helpers/fs';

export default class {
  // User can be invited (comes by an invitation link) or himself (direct link)
  constructor(name, type = 'himself') {
    this.id = nanoid();
    this.name = name;
    this.type = type;
  }

  getUserID() {
    return this.id;
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
  }

  async save() {
    const users = await this.getAllUsers();
    console.log(users);
    users.push(this);
    this.updateUsers(users);
  }

  async remove() {
    const currentUsers = await this.getAllUsers();
    const newUsers = currentUsers.filter((user) => user.id !== this.id);
    this.updateUsers(newUsers);
  }

  async getAllUsers() {
    return await readFile('users.json');
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