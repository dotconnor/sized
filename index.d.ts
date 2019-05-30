/// <reference types="node" />
export interface IBlock {
  path: string;
  size: number;
}
export interface IOptions {
  ignore: string[];
  debug: boolean;
}
declare function sized(
  dir: string,
  options: IOptions,
  cb: (size: number) => void
): Promise<IBlock[]>;
export default sized;
