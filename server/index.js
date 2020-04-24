import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import socket from 'socket.io';
import path from 'path';
import morgan from 'morgan';

import events from './events';
import { readFile, updateFile } from './helpers/fs';

dotenv.config();
const port = process.env.SOCKET_PORT || 5000;
const app = express();
const logger = morgan('dev');

app
  .use(cors())
  .use(logger);

app.get('/users', async (req, res) => {
  const users = await getUsersData();
  res.json(users);
});

async function getUsersData() {
  const data = await readFile('users.json');
  return data;
}
