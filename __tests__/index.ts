import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

import sized from "../src";

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
describe(`sized`, () => {
  let folder: string;
  beforeAll(() => {
    folder = fs.mkdtempSync(path.join(os.tmpdir(), `sized-`));
  });
  afterAll(() => {
    try {
      fs.rmdirSync(folder);
    } catch (e) {
      return;
    }
  });
  test(`Check to see if it can find file`, async () => {
    const id = guid();
    const size = Math.floor(Math.random() * (5000 - 25) + 25);
    fs.writeFileSync(path.join(folder, id), crypto.randomBytes(size));
    const r = await sized(
      path.join(folder, id),
      { ignore: [], debug: false },
      () => void 0
    );
    expect(r).toHaveLength(1);
  });
  test(`Check to see if it can calculate the correct file size`, async () => {
    const id = guid();
    const size = Math.floor(Math.random() * (5000 - 25) + 25);
    fs.writeFileSync(path.join(folder, id), crypto.randomBytes(size));
    const r = await sized(
      path.join(folder, id),
      { ignore: [], debug: false },
      () => void 0
    );
    expect(r[0].size).toBe(size);
  });
  test(`Check to see if it can find folder`, async () => {
    const id = guid();
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
      { ignore: [], debug: false },
      () => void 0
    );
    expect(r).toHaveLength(4);
  });
  test(`Check to see if it can calculate folder size`, async () => {
    const id = guid();
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
      { ignore: [], debug: false },
      () => void 0
    );
    expect(r.reduce((a, b) => a + b.size, 0)).toBe(
      sizes.reduce((a, b) => a + b)
    );
  });
  test(`Check to see if it can find nested folder`, async () => {
    const id = guid();
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
      { ignore: [], debug: false },
      () => void 0
    );
    expect(r).toHaveLength(8);
  });
  test(`Check to see if it can calculated nested folder size`, async () => {
    const id = guid();
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
      { ignore: [], debug: false },
      () => void 0
    );
    expect(r.reduce((a, b) => a + b.size, 0)).toBe(
      sizes.reduce((a, b) => a + b) * 2
    );
  });
  test(`Check to see if runs callback`, async () => {
    const id = guid();
    const sizes = [0, 0, 0, 0].map(() =>
      Math.floor(Math.random() * (5000 - 25) + 25)
    );
    const ids = [0, 0, 0, 0].map(guid);
    fs.mkdirSync(path.join(folder, id));
    ids.forEach((_, k) => {
      fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[k]));
    });
    let i = 0;
    const fn = jest.fn((size) => {
      i += size;
    });
    await sized(path.join(folder, id), { ignore: [], debug: false }, fn);
    expect(i).toBe(sizes.reduce((a, b) => a + b));
    expect(fn.mock.calls.length).toBe(4);
  });
  test(`Check to see if it can ignore a file`, async () => {
    const id = guid();
    const sizes = [0, 0].map(() =>
      Math.floor(Math.random() * (5000 - 25) + 25)
    );
    const ids = [0, 0].map(guid);
    fs.mkdirSync(path.join(folder, id));
    ids.forEach((_, i) => {
      fs.writeFileSync(path.join(folder, id, _), crypto.randomBytes(sizes[i]));
    });
    const r = await sized(
      path.join(folder, id),
      { ignore: [ids[1]], debug: false },
      () => void 0
    );
    expect(r).toHaveLength(1);
  });
});
