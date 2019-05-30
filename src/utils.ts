import { access, lstat, PathLike, readdir, Stats } from "fs";
import { IBlock } from "../index";
import { relative } from "path";

function promisify<T>(
  func: (...args: any[]) => void,
  path: PathLike
): Promise<T> {
  return new Promise((resolve, reject) => {
    func(path, (err: any, data: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

export function lstatPromised(path: PathLike): Promise<Stats> {
  return promisify(lstat, path);
}

export function readdirPromised(path: PathLike): Promise<string[]> {
  return promisify(readdir, path);
}

export function humanFileSize(bytes: number, si: boolean = true): string {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? [`kB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`]
    : [`KiB`, `MiB`, `GiB`, `TiB`, `PiB`, `EiB`, `ZiB`, `YiB`];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
}
export function flattenDeep(arr: any[]): any[] {
  return arr.reduce(
    (acc, e) => (Array.isArray(e) ? acc.concat(flattenDeep(e)) : acc.concat(e)),
    []
  );
}

export function humanNumbers(value: number): string {
  let newValue = value;
  const suffixes = [``, `K`, `M`, `B`, `T`];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  let num = newValue.toPrecision(3);

  num = `${num} ${suffixes[suffixNum]}`;
  return num;
}

export function humanTime(time: number): string {
  const units = [`s`, `m`];
  if (Math.abs(time) < 1000) {
    return `${time} ms`;
  }
  let u = -1;
  do {
    time /= 1000;
    ++u;
  } while (Math.abs(time) >= 1000 && u < units.length - 1);
  return `${time.toFixed(1)} ${units[u]}`;
}
export function getLengthOfBlock(block: IBlock): number {
  if (block.type === `file` || !block.children) {
    return 1;
  }
  return block.children.reduce((a, b) => {
    return a + (b.type === `dir` ? getLengthOfBlock(b) : 1);
  }, 0);
}
function pad(num: number) {
  return new Array(num + 1).fill(` `).join(``);
}

function colorPath(block: IBlock, dir: string): string {
  let s = ``;
  if (block.type === `dir`) {
    s += `\x1b[34m\x1b[1m`;
  } else {
    s += `\x1b[31m\x1b[1m`;
  }
  s += `${relative(dir, block.path)}${block.type === `dir` ? `/` : ``}\x1b[0m`;
  return s;
}

function getPadding(blocks: IBlock[], dir: string, depth: number) {
  return Math.max(
    ...blocks.map((block) => {
      let a = [relative(dir, block.path).length];
      if (depth > 1 && block.type === `dir` && block.children) {
        a = a.concat(getPadding(block.children, block.path, depth - 1));
      }
      return Math.max(...a);
    })
  );
}

export function getLargest(
  blocks: IBlock[],
  depth: number = 1,
  inset: number = 0,
  dir: string = `.`,
  padding?: number
) {
  const root =
    blocks.length === 1 && blocks[0].type === `dir`
      ? blocks[0].children!
      : blocks;
  const biggest = root.sort((a, b) => b.size - a.size).slice(0, 10);
  const totalSize = root.reduce((a, b) => {
    return a + b.size;
  }, 0);
  padding = padding || getPadding(biggest, dir, depth);
  return [
    ...biggest.map((a) => {
      let o = `${pad(inset + 1)}${colorPath(a, dir)} ${pad(
        padding! -
          depth -
          (relative(dir, a.path).length + (a.type === `dir` ? 1 : 0))
      )} ${humanFileSize(a.size)} (${((a.size / totalSize) * 100).toFixed(
        2
      )}%)`;
      if (depth > 1 && a.type === `dir` && a.children) {
        o += `\n`;
        o += getLargest(a.children, depth - 1, inset + 2, a.path, padding);
      }
      return o;
    }),
  ].join(`\n`);
}
