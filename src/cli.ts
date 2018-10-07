
const settings = require("../package.json"); // tslint:disable-line
import ora from "ora";
import { cpus } from "os";
import * as path from "path";
import sized from "./index";
import { humanFileSize, throttled } from "./utils";
if (process.platform === "win32") {
  const rl = require("readline").createInterface({ // tslint:disable-line
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", () => {
    (process as any).emit("SIGINT");
  });
}
const argv = process.argv.slice(2);
const toggles = [
  "h",
  "debug",
];
const opts = [
  "i",
];
const options: IOptions = {
  debug: false,
  ignore: [],
};
const args = [];
let dir = "";
function printHelp() {
  console.log();
  console.log(`\x1b[36msized\x1b[0m ${settings.version}`);
  console.log(`  usage: sized [options] [path]`);
  console.log(`  options:`);
  console.log();
  console.log(`    --h       \tPrints this screen.`);
  console.log(`    --debug   \tToggles debug logging.`);
  console.log(`    --i [glob]\tAdds glob to be ignored.`);
  process.exit(0);
}
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i].startsWith("--")) {
    const t = argv[i].slice(2).split("=");
    if (toggles.indexOf(t[0]) > -1) {
      if (t[0] === "h") {
        printHelp();
      } else if (t[0] === "d") {
        options.debug = true;
      }
    } else if (opts.indexOf(t[0]) > -1) {
      let value;
      if (t.length === 2) {
        value = t[1];
      } else {
        if (i === argv.length - 1) {
          console.log(`\x1b[31m[error]\x1b[0m Was expecting some value after: --${t[0]}`);
          process.exit(1);
        } else {
          value = argv[i + 1];
          i += 1;
        }
        if (t[0] === "i" && value) {
          options.ignore.push(value);
        }
      }
    } else {
      console.log(`\x1b[31m[error]\x1b[0m Unknown option: ${t[0]} `);
      process.exit(1);
    }
  } else {
    dir = argv[i];
  }
}
if (!dir) {
  printHelp();
} else {
  const spinner = ora({color: "cyan"}).start();
  process.on("SIGINT", () => {
    spinner.stop();
    process.exit();
  });
  let currentsize = 0;
  const update = throttled(150, () => {
    spinner.text = `  Current Size: \x1b[32m${humanFileSize(currentsize)}\x1b[0m`;
  });
  function cb(size: number) {
    currentsize += size;
    update();
  }
  if (options.debug) {
    spinner.info(`Limited to ${cpus().length / 2} tasks at a time.`);
  }
  const start = Date.now();
  sized(dir, options, cb).then((data) => {
    const time = Date.now() - start;
    spinner.stop();
    const totalSize = data.reduce((a, b) => {
      return a + b.size;
    }, 0);
    console.log();
    console.log(`\x1b[36msized\x1b[0m - \x1b[33m${path.resolve(dir)}\x1b[0m`);
    console.log(`  Total Size:   \x1b[32m${humanFileSize(totalSize)}\x1b[0m`);
    console.log(`  Total Files:  \x1b[34m\x1b[1m${data.length}\x1b[0m`);
    console.log(`  Took:         \x1b[31m\x1b[1m${time}ms\x1b[0m`);
    process.exit();
  }).catch((err) => {
    if (options.debug) {
      spinner.stopAndPersist(`\x1b[31m[error]\x1b[0m ${err}`);
    }
  });
}
