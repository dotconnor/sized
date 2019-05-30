import test from "ava";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

import sized from "../src";
import { IBlock } from "../index";

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
const getFolder = () => fs.mkdtempSync(path.join(os.tmpdir(), `sized-`));

test(`Check to see if it can find file`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const size = Math.floor(Math.random() * (5000 - 25) + 25);
  fs.writeFileSync(path.join(folder, id), crypto.randomBytes(size));
  const r = await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r.length, 1);
});
test(`Check to see if it can calculate the correct file size`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const size = Math.floor(Math.random() * (5000 - 25) + 25);
  fs.writeFileSync(path.join(folder, id), crypto.randomBytes(size));
  const r = await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r[0].size, size);
});
test(`Check to see if it can find folder`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const sizes = [0, 0, 0, 0].map(() =>
    Math.floor(Math.random() * (5000 - 25) + 25)
  );
  const ids = [0, 0, 0, 0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  });
  const r = await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r[0].type, `dir`);
  t.is(r[0].children!.length, 4);
});
test(`Check to see if it can calculate folder size`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const sizes = [0, 0, 0, 0].map(() =>
    Math.floor(Math.random() * (5000 - 25) + 25)
  );
  const ids = [0, 0, 0, 0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  });
  const r = await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r.reduce((a, b) => a + b.size, 0), sizes.reduce((a, b) => a + b));
});
test(`Check to see if it can find nested folder`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const sizes = [0, 0, 0, 0].map(() =>
    Math.floor(Math.random() * (5000 - 25) + 25)
  );
  const ids = [0, 0, 0, 0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  });
  const id2 = guid();
  fs.mkdirSync(path.join(folder, id, id2));
  ids.forEach((_, i) => {
    fs.writeFileSync(
      path.join(folder, id, id2, _),
      crypto.randomBytes(sizes[i])
    );
  });
  const r = await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r.length, 1);
  t.is(r[0].children!.length, 5);
  t.is(r[0].children![4].children!.length, 4);
});
test(`Check to see if it can calculated nested folder size`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const sizes = [0, 0, 0, 0].map(() =>
    Math.floor(Math.random() * (5000 - 25) + 25)
  );
  const ids = [0, 0, 0, 0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  });
  const id2 = guid();
  fs.mkdirSync(path.join(folder, id, id2));
  ids.forEach((_, i) => {
    fs.writeFileSync(
      path.join(folder, id, id2, _),
      crypto.randomBytes(sizes[i])
    );
  });
  const r = await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r.reduce((a, b) => a + b.size, 0), sizes.reduce((a, b) => a + b) * 2);
});
test(`Check to see if runs callback`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const sizes = [0, 0, 0, 0].map(() =>
    Math.floor(Math.random() * (5000 - 25) + 25)
  );
  const ids = [0, 0, 0, 0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, k) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[k]));
  });
  let i = 0;
  let k = 0;
  const fn = (block: IBlock) => {
    i += block.size;
    k++;
  };
  await sized(
    path.join(folder, id),
    { ignore: [], debug: false, limit: 1 },
    fn
  );
  t.is(i, sizes.reduce((a, b) => a + b));
  t.is(k, 4);
});
test(`Check to see if it can ignore a file`, async (t) => {
  const id = guid();
  const folder = getFolder();
  const sizes = [0, 0].map(() => Math.floor(Math.random() * (5000 - 25) + 25));
  const ids = [0, 0].map(guid);
  fs.mkdirSync(path.join(folder, id));
  ids.forEach((_, i) => {
    fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
  });
  const r = await sized(
    path.join(folder, id),
    { ignore: [ids[1]], debug: false, limit: 1 },
    () => void 0
  );
  t.is(r.length, 1);
});
