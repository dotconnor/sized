# sized

Command line utility to calculate folder sizes.

## Usage
```shell
sized [options] [dir]

sized .
```

## Options

|     flag     |           description           |             usage             |
|--------------|---------------------------------|-------------------------------|
| --h          | prints out the help screen      | `sized --h`                   |
| --i \[path]  | Adds path glob to ignored list  | `sized --i node_modules/**/*` |
| --debug      | Shows debugging logs            | `sized --debug`               |