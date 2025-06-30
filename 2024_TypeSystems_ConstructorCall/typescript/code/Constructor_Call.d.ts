export declare class Constructor_Call {
    class_name: string;
    parameters: Constructor_Call[];
    constructor(className: string, parameters: Constructor_Call[]);
    call_string(): string;
    equals(constructorCall: Constructor_Call): boolean;
}
