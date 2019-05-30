/// <reference types="node" />
export interface IBlock {
  path: string;
  type: `file` | `dir`;
  children?: IBlock[];
  size: number;
}
export interface IOptions {
  ignore: string[];
  debug: boolean;
  limit: number;
  depth?: number;
}
declare function sized(
  dir: string,
  options: IOptions,
  cb: (size: number) => void
): Promise<IBlock[]>;
export default sized;
