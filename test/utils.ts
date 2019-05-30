import test from "ava";
import { lstatPromised, readdirPromised, throttled } from "../src/utils";
test(`throttled`, async (t) => {
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
  t.is(i, 5);
});

test(`lstat`, async (t) => {
  await t.throwsAsync(lstatPromised(`/does/not/exist`));
});
test(`readdir`, async (t) => {
  await t.throwsAsync(readdirPromised(`/does/not/exist`));
});
