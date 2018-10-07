declare module "ora";
declare module "update-notifier";

interface IBlock {
  path: string;
  size: number;
}
interface IOptions {
  ignore: string[];
  debug: boolean;
}