/// <reference types="node" />
declare function sized(dir: string, options: IOptions, cb: () => void): Promise<IBlock[]>;
export default sized;