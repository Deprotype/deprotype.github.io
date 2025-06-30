import { Task } from "../../../N-of-1-Experimentation/modules/Experimentation/Task";
declare abstract class Rule {
    abstract do_writer_on(writer: Code_Writer, bool_or_number: string, position: number): void;
    equals(that: Rule): boolean;
    abstract type_name(param: Feature_Term_with_Typing_rules): string;
}
declare abstract class Code_Writer {
    arr: any[];
    constructor(arr: any[]);
    protected write(a: string): void;
    protected writeln(a: string): void;
    write_rules(rules: Rules, left_type_name: string): void;
    write_function_rule(bool_or_number: string, position: number): void;
    write_left_outer_rule(type: string, position: number): void;
    write_right_outer_rule(type: string, position: number): void;
}
declare class Rules {
    x_y_z: Rule[];
    constructor(x_y_z: Rule[]);
    apply_writer(writer: Code_Writer, left_type_name: string): void;
}
export declare class Feature_Term_with_Typing_rules {
    first_type_in_function: string;
    term_typing_output_ordering: number[];
    feature_term: Rules;
    typing_rules: Rules;
    constructor(order: number[], first_type_in_function: string, feature_term: Rules, typing_rules: Rules);
    typing_rules_as_code_html_string(): string;
    inference_rules_as_html_string(): string;
    error_position(): number;
    private type_string_of_term_no;
    second_type_in_function(): "BOOL" | "NUMBER";
    ordered_terms(): Rule[];
    response_text(): string;
    debug_help(t: Task): void;
}
export declare function create_tasks_grouped_by_error_position(): {
    1: any[];
    2: any[];
    3: any[];
    0: any[];
};
export {};
