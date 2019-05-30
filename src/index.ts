import { Stats } from "fs";
import { inspect } from "util";
import minimatch from "minimatch";
import pLimit from "p-limit";
import * as path from "path";
import { IBlock, IOptions } from "../index";
import { flattenDeep, lstatPromised, readdirPromised } from "./utils";

async function sizeOfDir(
  dir: string,
  options: IOptions,
  limit: (...args: any[]) => any,
  cb: (size: IBlock) => void
): Promise<IBlock> {
  let files = await readdirPromised(dir);
  files = files.map((file) => path.join(dir, file));
  files = files.filter((file) => {
    return !options.ignore.some((ignore) =>
      minimatch(file, ignore, { matchBase: true })
    );
  });
  const block: IBlock = {
    size: 0,
    path: dir,
    children: [],
    type: `dir`,
  };
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
        cb({ path: p.path, size: p.stat.size, type: `file` });
      }
      blocks.push({ path: p.path, size: p.stat.size, type: `file` });
      return false;
    }
    return true;
  });
  const t = await Promise.all(
    data.map((p) => sizeOfDir(p.path, options, limit, cb))
  );
  blocks = blocks.concat(t);
  block.children = blocks;
  block.size = blocks.reduce((a, b) => a + b.size, 0);
  return block;
}

async function sized(
  dir: string,
  options: IOptions,
  cb: (size: IBlock) => void
): Promise<IBlock[]> {
  const opts: IOptions = Object.assign(
    {
      debug: false,
      ignore: [],
    },
    options
  );
  const limit = pLimit(opts.limit);
  let blocks: IBlock[] = [];
  const stat = await lstatPromised(dir);
  if (stat.isDirectory()) {
    blocks = blocks.concat({
      type: `dir`,
      ...(await sizeOfDir(dir, opts, limit, cb)),
    });
  } else {
    blocks.push({
      path: dir,
      size: stat.size,
      type: `file`,
    });
  }
  return blocks;
}
export = sized;
