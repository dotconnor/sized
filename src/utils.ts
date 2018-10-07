import { access, lstat, PathLike, readdir, Stats } from "fs";

export function lstatPromised(path: PathLike): Promise<Stats> {
  return new Promise((resolve, reject) => {
    lstat(path, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

export function readdirPromised(path: PathLike): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(path, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

export function humanFileSize(bytes: number, si: boolean = true): string {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
      return `${bytes} B`;
  }
  const units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  do {
      bytes /= thresh;
      ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
}
export function flattenDeep(arr: any[]): any[] {
  return arr.reduce((acc, e) => Array.isArray(e) ? acc.concat(flattenDeep(e)) : acc.concat(e), []);
}

export type Procedure = (...args: any[]) => void;

export function throttled(delay: number, fn: Procedure) {
  let lastCall = 0;
  return function k(...args: any[]) {
    const now = (new Date()).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}
