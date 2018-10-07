# sized

[![Maintainability](https://api.codeclimate.com/v1/badges/047cf68ed683bd4cc6b5/maintainability)](https://codeclimate.com/github/dotconnor/sized/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/047cf68ed683bd4cc6b5/test_coverage)](https://codeclimate.com/github/dotconnor/sized/test_coverage)

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