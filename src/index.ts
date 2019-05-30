import { Stats } from "fs";
import minimatch from "minimatch";
import { cpus } from "os";
import pLimit from "p-limit";
import * as path from "path";
import { IBlock, IOptions } from "../index";
import { flattenDeep, lstatPromised, readdirPromised } from "./utils";

const limit = pLimit(cpus().length);

async function sizeOfDir(
  dir: string,
  options: IOptions,
  cb: (size: number) => void
): Promise<IBlock[]> {
  let files = await readdirPromised(dir);
  files = files.map((file) => path.join(dir, file));
  files = files.filter((file) => {
    return !options.ignore.some((ignore) =>
      minimatch(file, ignore, { matchBase: true })
    );
  });
  let blocks: IBlock[] = [];
  const stats = await Promise.all(
    files.map((file) => limit(lstatPromised, file))
  );
  let data = files.map((file, i) => {
    return { path: file, stat: stats[i] };
  });
  data = data.filter((p) => {
    if (!p.stat.isDirectory()) {
      if (cb) {
        cb(p.stat.size);
      }
      blocks.push({ path: p.path, size: p.stat.size });
      return false;
    }
    return true;
  });
  const t = await Promise.all(data.map((p) => sizeOfDir(p.path, options, cb)));
  blocks = blocks.concat(flattenDeep(t));
  return blocks;
}

async function sized(
  dir: string,
  options: IOptions,
  cb: (size: number) => void
): Promise<IBlock[]> {
  const opts: IOptions = Object.assign(
    {
      debug: false,
      ignore: [],
    },
    options
  );
  let blocks: IBlock[] = [];
  const stat = await lstatPromised(dir);
  if (stat.isDirectory()) {
    blocks = blocks.concat(await sizeOfDir(dir, opts, cb));
  } else {
    blocks.push({
      path: dir,
      size: stat.size,
    });
  }
  return blocks;
}
export = sized;
