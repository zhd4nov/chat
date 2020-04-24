import fs from 'fs';
import path from 'path';

export function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, '..', 'data', filename),
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
    )
  });
}

export function updateFile() { }
