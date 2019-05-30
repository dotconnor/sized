import test from "ava";
import { humanFileSize } from "../src/utils";

test(`SI - bytes`, (t) => {
  t.is(humanFileSize(2), `2 B`);
});
test(`SI - kB`, (t) => {
  t.is(humanFileSize(29e2), `2.9 kB`);
});
test(`SI - MB`, (t) => {
  t.is(humanFileSize(29e5), `2.9 MB`);
});
test(`SI - GB`, (t) => {
  t.is(humanFileSize(29e8), `2.9 GB`);
});
test(`SI - TB`, (t) => {
  t.is(humanFileSize(29e11), `2.9 TB`);
});
test(`SI - PB`, (t) => {
  t.is(humanFileSize(29e14), `2.9 PB`);
});

test(`bytes`, (t) => {
  t.is(humanFileSize(2, false), `2 B`);
});
test(`kB`, (t) => {
  t.is(humanFileSize(29e2, false), `2.8 KiB`);
});
test(`MB`, (t) => {
  t.is(humanFileSize(29e5, false), `2.8 MiB`);
});
test(`GB`, (t) => {
  t.is(humanFileSize(29e8, false), `2.7 GiB`);
});
test(`TB`, (t) => {
  t.is(humanFileSize(29e11, false), `2.6 TiB`);
});
test(`PB`, (t) => {
  t.is(humanFileSize(29e14, false), `2.6 PiB`);
});
