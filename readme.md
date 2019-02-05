# sized

[![Maintainability](https://api.codeclimate.com/v1/badges/047cf68ed683bd4cc6b5/maintainability)](https://codeclimate.com/github/dotconnor/sized/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/047cf68ed683bd4cc6b5/test_coverage)](https://codeclimate.com/github/dotconnor/sized/test_coverage)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdotconnor%2Fsized.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdotconnor%2Fsized?ref=badge_shield)

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

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdotconnor%2Fsized.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdotconnor%2Fsized?ref=badge_large)