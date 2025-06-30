import { Class_Definition } from "./Class_Definition.js";
import { Constructor_Call } from "./Constructor_Call.js";
export declare class Classes {
    class_definitions: Class_Definition[];
    constructor(class_definitions: Class_Definition[]);
    type_check(constructor_call: Constructor_Call): void;
    execute(constructor_call: Constructor_Call): void;
    get_class_named(class_name: string): Class_Definition;
    get_classes_named(names: string[]): any[];
    number_of_classes(): number;
    html_table_string(num_columns: any, with_types: boolean): string;
    sort_class_definitions(): void;
}
