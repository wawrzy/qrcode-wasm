interface IConfig {
    debug?: boolean;
}
export declare const ErrorCodes: {
    ERR_ENC: string;
    ERR_TLONG: string;
};
export declare class QrCodeWasm {
    private debug;
    private wasm;
    private memory;
    constructor(config?: IConfig);
    private __DEBUG__;
    private config;
    private env;
    encode(message: string): Promise<Int32Array>;
}
export {};
