import {
  humanFileSize,
  lstatPromised,
  readdirPromised,
  throttled,
} from "../src/utils";
describe(`byte size formatter`, () => {
  describe(`SI`, () => {
    test(`bytes`, () => {
      expect(humanFileSize(2)).toBe(`2 B`);
    });
    test(`kB`, () => {
      expect(humanFileSize(29e2)).toBe(`2.9 kB`);
    });
    test(`MB`, () => {
      expect(humanFileSize(29e5)).toBe(`2.9 MB`);
    });
    test(`GB`, () => {
      expect(humanFileSize(29e8)).toBe(`2.9 GB`);
    });
    test(`TB`, () => {
      expect(humanFileSize(29e11)).toBe(`2.9 TB`);
    });
    test(`PB`, () => {
      expect(humanFileSize(29e14)).toBe(`2.9 PB`);
    });
  });
  describe(`normal`, () => {
    test(`bytes`, () => {
      expect(humanFileSize(2, false)).toBe(`2 B`);
    });
    test(`kB`, () => {
      expect(humanFileSize(29e2, false)).toBe(`2.8 KiB`);
    });
    test(`MB`, () => {
      expect(humanFileSize(29e5, false)).toBe(`2.8 MiB`);
    });
    test(`GB`, () => {
      expect(humanFileSize(29e8, false)).toBe(`2.7 GiB`);
    });
    test(`TB`, () => {
      expect(humanFileSize(29e11, false)).toBe(`2.6 TiB`);
    });
    test(`PB`, () => {
      expect(humanFileSize(29e14, false)).toBe(`2.6 PiB`);
    });
  });
});
test(`throttled`, async () => {
  let i = 0;
  const fn = throttled(200, () => {
    i += 1;
  });
  const a = setInterval(() => {
    fn();
  }, 100);
  await new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(a);
      resolve();
    }, 1000);
  });
  expect(i).toBe(5);
});

describe(`failed fs`, async () => {
  test(`lstat`, async () => {
    await expect(lstatPromised(`/does/not/exist`)).rejects.toThrow();
  });
  test(`readdir`, async () => {
    await expect(readdirPromised(`/does/not/exist`)).rejects.toThrow();
  });
});
