import test from "ava";
import { lstatPromised, readdirPromised } from "../src/utils";

test(`lstat`, async (t) => {
  await t.throwsAsync(lstatPromised(`/does/not/exist`));
});
test(`readdir`, async (t) => {
  await t.throwsAsync(readdirPromised(`/does/not/exist`));
});
