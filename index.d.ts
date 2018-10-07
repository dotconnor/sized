declare module "ora";
interface IBlock {
  path: string;
  size: number;
}
interface IOptions {
  ignore: string[];
  debug: boolean;
}