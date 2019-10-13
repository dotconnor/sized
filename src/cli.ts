const settings = require(`../package.json`); // tslint:disable-line
import Ora from "ora";
import { cpus } from "os";
import * as path from "path";
import { argv } from "yargs";
import logUpdate from "log-update";
import updateNotifier from "update-notifier";
import { IOptions, IBlock } from "../index";
import sized from "./index";
import {
  humanFileSize,
  humanNumbers,
  humanTime,
  getLargest,
  getLengthOfBlock,
} from "./utils";

if (process.platform === `win32`) {
  const rl = require(`readline`).createInterface({
    // tslint:disable-line
    input: process.stdin,
    output: process.stdout,
  });

  rl.on(`SIGINT`, () => {
    (process as any).emit(`SIGINT`);
  });
}

function printHelp(): void {
  console.log();
  console.log(`\x1b[36msized\x1b[0m ${settings.version}`);
  console.log(`  usage: sized [options] [path]`);
  console.log(`  options:`);
  console.log();
  console.log(`    -h, --help             Prints this screen.`);
  console.log(`    --debug                Toggles debug logging.`);
  console.log(`    -i, --ignore [glob]    Adds glob to be ignored.`);
  console.log(
    `    --depth [num]          The number of nested directories to display.`
  );
  console.log();
  process.exit(0);
}

if (argv.h || argv.help) {
  printHelp();
}

const dir: string = (argv._[0] as string) || `.`;

const options: IOptions = {
  debug: Boolean(argv.debug) || false,
  ignore: [],
  limit: cpus().length,
};
if (argv.i) {
  let i;
  if (!Array.isArray(argv.i)) {
    i = [argv.i];
  } else {
    // eslint-disable-next-line prefer-destructuring
    i = argv.i;
  }

  options.ignore = options.ignore.concat(i);
}

if (argv.ignore) {
  let i;
  if (!Array.isArray(argv.ignore)) {
    i = [argv.ignore];
  } else {
    // eslint-disable-next-line prefer-destructuring
    i = argv.ignore;
  }

  options.ignore = options.ignore.concat(i);
}

if (argv.c) {
  if (Number.isInteger(argv.c as number)) {
    options.limit = argv.c as number;
  }
}

if (argv.depth) {
  if (Number.isInteger(argv.depth as number)) {
    options.depth = argv.depth as number;
  }
}

const spinner = Ora({ color: `cyan` });
process.on(`SIGINT`, () => {
  spinner.stop();
  process.exit();
});
let currentsize = 0;
let currentFile = ``;
function render(): void {
  const output = `
  ${spinner.frame()}  Current Sized:    \x1b[32m${humanFileSize(
    currentsize
  )}\x1b[0m
      Current File:     \x1b[32m${currentFile}\x1b[0m
  `;
  logUpdate(output);
}

const cb = (block: IBlock): void => {
  currentsize += block.size;
  currentFile = path.relative(dir, block.path);
};

const start = Date.now();

const clearRender = setInterval(render, 50);

sized(dir, options, cb)
  .then((data) => {
    const time = Date.now() - start;
    const totalSize = data.reduce((a, b) => {
      return a + b.size;
    }, 0);
    const totalFiles = data.reduce((a, b) => a + getLengthOfBlock(b), 0);
    clearInterval(clearRender);
    let output = `
  \x1b[36msized\x1b[0m - \x1b[33m${path.resolve(dir)}\x1b[0m
    Total Size:   \x1b[32m${humanFileSize(totalSize)}\x1b[0m
    Total Files:  \x1b[34m\x1b[1m${humanNumbers(totalFiles)}\x1b[0m
    Took:         \x1b[31m\x1b[1m${humanTime(time)}\x1b[0m\n\n`;
    output += getLargest(data, options.depth);
    output += `\n`;
    logUpdate(output);
    updateNotifier({ pkg: settings }).notify();
    process.exit();
  })
  .catch((err) => {
    if (options.debug) {
      spinner.stopAndPersist({ text: `\x1b[31m[error]\x1b[0m ${err}` });
    }
  });
