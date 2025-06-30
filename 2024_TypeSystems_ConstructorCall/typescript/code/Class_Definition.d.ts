import { Classes } from "./Classes.js";
export declare class Class_Definition {
    class_name: string;
    parameter_names: string[];
    parameter_type_names: string[];
    parameter_ordering: number[];
    method_name: string;
    constructor(class_name: string, parameter_names: string[], type_names: string[], method_name: string);
    type_signature_string(): string;
    print_html_into_array(out: string[], classes: Classes, typed: boolean): void;
}
