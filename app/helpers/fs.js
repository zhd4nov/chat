import fs from 'fs';
import path from 'path';

export function readFile(filename) {
  return new Promise((resolve, reject) => {
    const _path = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '..', '..', 'app', 'data', filename)
      : path.resolve(__dirname, '..', 'data', filename);

    fs.readFile(
      _path,
      'utf8',
      (err, jsonString) => {
        if (err) {
          console.log('Error read file: ', err);
          reject(false);
          return;
        }

        try {
          const data = JSON.parse(jsonString);
          resolve(data.data);
          return;
        } catch (err) {
          console.log('Error parse JSON: ', err);
          reject(false);
          return;
        }
      }
    );
  });
}

export function updateFile(filename, data) {
  return new Promise((resolve, reject) => {
    const _path = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '..', '..', 'app', 'data', filename)
      : path.resolve(__dirname, '..', 'data', filename);

    fs.writeFile(_path, JSON.stringify({ data }), 'utf8', err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}
