const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const os = require('os');

const sized = require('../lib/index');
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'sized-'))
test('Check to see if it can find file', async () => {
  const id = guid();
  const size = Math.floor(Math.random() * (5000 - 25) + 25);
  fs.writeFileSync(path.join(folder, id), crypto.randomBytes(size));
  const r = await sized(path.join(folder, id))
  expect(r).toHaveLength(1);
});
test('Check to see if it can calculate the correct file size', async () => {
  const id = guid();
  const size = Math.floor(Math.random() * (5000 - 25) + 25);
  fs.writeFileSync(path.join(folder, id), crypto.randomBytes(size));
  const r = await sized(path.join(folder, id))
  expect(r[0].size).toBe(size);
});
test('Check to see if it can find folder', async () => {
  const id = guid();
  const sizes = [0,0,0,0].map(() => Math.floor(Math.random() * (5000 - 25) + 25));
  const ids = [0,0,0,0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  })
  const r = await sized(path.join(folder, id))
  expect(r).toHaveLength(4);
});
test('Check to see if it can calculate folder size', async () => {
  const id = guid();
  const sizes = [0,0,0,0].map(() => Math.floor(Math.random() * (5000 - 25) + 25));
  const ids = [0,0,0,0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  })
  const r = await sized(path.join(folder, id))
  expect(r.reduce((a,b) => a + b.size, 0)).toBe(sizes.reduce((a,b) => a + b));
});