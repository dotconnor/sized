# sized

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/766b3fd71aed4ae2aa8a9d5b47a7843d)](https://app.codacy.com/app/dotconnor/sized?utm_source=github.com&utm_medium=referral&utm_content=dotconnor/sized&utm_campaign=Badge_Grade_Dashboard)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/13ae20bf91ed4a9787f9416031703d23)](https://www.codacy.com/app/dotconnor/sized?utm_source=github.com&utm_medium=referral&utm_content=dotconnor/sized&utm_campaign=Badge_Coverage)

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