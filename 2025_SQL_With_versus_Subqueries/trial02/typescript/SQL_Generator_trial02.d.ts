import { RefObject } from "../../../N-of-1-Experimentation/modules/utils/Utils.js";
export declare function set_DEBUG_ERROR(b: any): void;
export declare function set_number_of_projections(n: number): void;
export declare function generate_query(tables: Table[], forbidden_names: string[], number_of_subqueries: number): Query_with_Explicit_Projections;
export declare function generate_tables(number_of_tables: number, number_of_attributes: number): Table[];
declare class Table {
    name: string;
    attributes: string[];
    constructor(name: string, attributes: string[]);
    random_qualified_attribute_string(): string;
    random_qualified_attribute_strings_without_repetition(number_of_attributes: number): string[];
    random_attribute_strings_without_repetition(number_of_attributes: number): string[];
}
declare abstract class Query {
    position_subquery: number;
    position_with: number;
    abstract random_attribute_strings(num: number): string[];
    abstract write_into_array_with_subqueries(arr: any, indentation_depth: any): any;
    abstract collect_sub_queries(subqueries: Subquery[]): any;
    abstract accessible_field_names(): string[];
    query_string_with_subqueries(): string;
    inject_error(target_line: number, notation: string): void;
    abstract init_position_with(current_position: RefObject<number>): any;
    abstract init_position_subquery(counter: RefObject<number>): any;
    query_string_with_WITH(): string;
    private write_subqueries;
    abstract write_main_query_for_with(arr: string[]): any;
}
declare class Subquery extends Query {
    accessible_field_names(): string[];
    init_position_with(current_position: RefObject<number>): void;
    name: string;
    query: Query_with_Explicit_Projections;
    init_position_subquery(counter: RefObject<number>): void;
    inject_error(target_line: number, notation: string): void;
    constructor(name: string, query: Query_with_Explicit_Projections);
    random_attribute_strings(num: number): string[];
    write_into_array_with_subqueries(arr: string[], indentation_depth: number): void;
    collect_sub_queries(arr: Subquery[]): void;
    write_main_query_for_with(arr: string[]): void;
}
declare class Projection {
    qualified_string: string;
    rename: string;
    constructor(qualified_string: string, rename: string);
}
declare abstract class Query_with_Explicit_Projections extends Query {
    explicit_projections: Projection[];
    constructor(projections: string[]);
    write_into_array_with_subqueries(arr: string[], indentation_depth: number): void;
    create_projections(qualified_strings: string[]): Projection[];
    abstract write_into_with(arr: string[], length: number): any;
    inject_error_into_selection(): void;
}
export declare function tables_as_string(tables: Table[]): string;
export {};
