import { do_random_array_sort, random_array_element, random_array_element_and_remove, random_array_elements_without_repetitions, random_integer_up_to_excluding, random_lower_case_letter_except, random_upper_case_letter_except } from "../../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js";
import { repeat, repeat_ } from "../../../N-of-1-Experimentation/modules/utils/loops/loop.js";
import { integer_partitions_of_fix_length, integer_partitions_of_fix_length_with_constraint } from "../../../N-of-1-Experimentation/modules/numeric/integer_partition.js";
import { RefObject } from "../../../N-of-1-Experimentation/modules/utils/Utils.js";
let number_of_projections = 2;
let DEBUG_ERROR = false;
export function set_DEBUG_ERROR(b) {
    DEBUG_ERROR = b;
}
export function set_number_of_projections(n) {
    number_of_projections = n;
}
export function generate_query(tables, forbidden_names, number_of_subqueries) {
    if (number_of_subqueries == 1) {
        return new Single_Table_Query(random_array_element_and_remove(tables), number_of_projections);
    }
    else {
        let left_name = random_upper_case_letter_except(forbidden_names);
        forbidden_names.push(left_name);
        let right_name = random_upper_case_letter_except(forbidden_names);
        forbidden_names.push(right_name);
        let partitions = random_array_element(integer_partitions_of_fix_length_with_constraint(number_of_subqueries, 2, a_number => a_number >= 1));
        let left_from = new Subquery(left_name, generate_query(tables, forbidden_names, partitions[0]));
        let right_from = new Subquery(right_name, generate_query(tables, forbidden_names, partitions[1]));
        let ret = new Join_On_Query(left_from, right_from);
        ret.init_position_with(new RefObject(0));
        ret.init_position_subquery(new RefObject(0));
        return ret;
    }
}
export function generate_tables(number_of_tables, number_of_attributes) {
    let tables = [];
    repeat_(number_of_tables)._times(() => tables.push(generate_table(tables.map(t => t.name), number_of_attributes)));
    return tables;
}
class Table {
    constructor(name, attributes) {
        this.name = name;
        this.attributes = attributes;
    }
    random_qualified_attribute_string() {
        return this.name + "." + random_array_element(this.attributes);
    }
    random_qualified_attribute_strings_without_repetition(number_of_attributes) {
        let atts = this.random_attribute_strings_without_repetition(number_of_attributes);
        return atts.map(e => this.name + "." + e);
    }
    random_attribute_strings_without_repetition(number_of_attributes) {
        let atts = random_array_elements_without_repetitions(this.attributes, number_of_attributes);
        return atts;
    }
}
class Query {
    query_string_with_subqueries() {
        let ret = [];
        this.write_into_array_with_subqueries(ret, 0);
        return ret.join("");
    }
    inject_error(target_line, notation) { }
    query_string_with_WITH() {
        let arr = [];
        let subqueries = [];
        this.collect_sub_queries(subqueries);
        this.write_subqueries(arr, subqueries);
        this.write_main_query_for_with(arr);
        return arr.join("");
    }
    write_subqueries(arr, subqueries) {
        let is_first = true;
        arr.push("WITH ");
        for (let subquerie of subqueries) {
            if (!is_first) {
                arr.push("\n" + " ".repeat(10) + "),\n" + " ".repeat(5));
            }
            is_first = false;
            arr.push(subquerie.name + " AS (\n");
            subquerie.query.write_into_with(arr, 12);
        }
        arr.push("\n" + " ".repeat(10) + "),\n");
    }
}
class Subquery extends Query {
    accessible_field_names() {
        return this.query.accessible_field_names().map(e => this.name + "." + e[e.length - 1]);
    }
    init_position_with(current_position) {
        this.query.init_position_with(current_position);
    }
    init_position_subquery(counter) {
        this.query.init_position_subquery(counter);
    }
    inject_error(target_line, notation) {
        this.query.inject_error(target_line, notation);
    }
    constructor(name, query) {
        super();
        this.name = name;
        this.query = query;
    }
    random_attribute_strings(num) {
        return this.query.random_attribute_strings(num).map(e => this.name + "." + e);
    }
    write_into_array_with_subqueries(arr, indentation_depth) {
        arr.push("(\n");
        this.query.write_into_array_with_subqueries(arr, indentation_depth + 4);
        arr.push(" ".repeat(indentation_depth));
        arr.push(") " + this.name + "\n");
    }
    collect_sub_queries(arr) {
        this.query.collect_sub_queries(arr);
        arr.push(this);
    }
    write_main_query_for_with(arr) {
        throw "should never be called";
    }
}
class Projection {
    constructor(qualified_string, rename) {
        this.qualified_string = qualified_string;
        this.rename = rename;
    }
}
class Query_with_Explicit_Projections extends Query {
    constructor(projections) {
        super();
        this.explicit_projections = this.create_projections(projections);
    }
    write_into_array_with_subqueries(arr, indentation_depth) {
        arr.push(" ".repeat(indentation_depth));
        arr.push("SELECT ");
        arr.push(this.explicit_projections.map(e => e.qualified_string + " AS " + e.rename).join(", ") + "\n");
    }
    create_projections(qualified_strings) {
        let forbidden_names = [];
        let new_projections = [];
        for (let qualified_string of qualified_strings) {
            let new_name = random_lower_case_letter_except(forbidden_names);
            forbidden_names.push(new_name);
            new_projections.push(new Projection(qualified_string, new_name));
        }
        return new_projections;
    }
    inject_error_into_selection() {
        throw "'inject_error_into_selection' not implemented";
    }
}
class Single_Table_Query extends Query_with_Explicit_Projections {
    accessible_field_names() {
        return this.explicit_projections.map(e => this.from.name + "." + e.rename);
    }
    inject_error(target_line, notation) {
        if (notation == "With") {
            if (this.position_with == target_line) {
                this.inject_error_into_selection();
            }
        }
        else if (notation == "Subquery") {
            if (this.position_subquery == target_line) {
                this.inject_error_into_selection();
            }
        }
    }
    inject_error_into_selection() {
        let unknown_attribute = random_lower_case_letter_except(this.from.attributes);
        let random_target_projection = random_array_element(this.explicit_projections);
        random_target_projection.qualified_string =
            (DEBUG_ERROR ? "XXXXX" : "") +
                unknown_attribute;
    }
    init_position_with(counter) {
        this.position_with = ++counter.value;
    }
    init_position_subquery(counter) {
        this.position_subquery = ++counter.value;
    }
    write_main_query_for_with(arr) {
        throw new Error("Method not implemented.");
    }
    write_into_with(arr, offset) {
        arr.push(" ".repeat(offset));
        arr.push("SELECT ");
        arr.push(this.explicit_projections.map(e => e.qualified_string + " AS " + e.rename).join(", ") + "\n");
        arr.push(" ".repeat(offset));
        arr.push("FROM ");
        arr.push(this.from.name);
    }
    constructor(from, number_of_projections) {
        super(from.random_attribute_strings_without_repetition(number_of_projections));
        this.from = from;
    }
    random_attribute_strings(num) {
        return random_array_elements_without_repetitions(this.explicit_projections.map(p => p.rename), num);
    }
    write_into_array_with_subqueries(arr, indentation_depth) {
        super.write_into_array_with_subqueries(arr, indentation_depth);
        arr.push(" ".repeat(indentation_depth));
        arr.push("FROM ");
        arr.push(this.from.name + "\n");
    }
    collect_sub_queries(subqueries) { }
}
class Join_On_Query extends Query_with_Explicit_Projections {
    accessible_field_names() {
        return this.left_query.accessible_field_names().concat(this.right_query.accessible_field_names());
    }
    inject_error_into_selection() {
        let this_fieldnames = this.accessible_field_names();
        let projection_to_change = random_array_element(this.explicit_projections);
        projection_to_change.qualified_string =
            (DEBUG_ERROR ? "XXXXX" : "") +
                projection_to_change.qualified_string[0] + "." + random_lower_case_letter_except(this_fieldnames.filter(e => e[0] == (projection_to_change.qualified_string[0])).map(e => e[e.length - 1]));
    }
    inject_error_into_on() {
        let this_fieldnames = this.accessible_field_names();
        let should_change_left = (random_integer_up_to_excluding(2) == 1);
        if (should_change_left) {
            this.on_left =
                (DEBUG_ERROR ? "XXXXX" : "") +
                    this.on_left[0] + "." + random_lower_case_letter_except(this_fieldnames.filter(e => e[0] == (this.on_left[0])).map(e => e[e.length - 1]));
        }
        else {
            this.on_right =
                (DEBUG_ERROR ? "XXXXX" : "") +
                    this.on_right[0] + "." + random_lower_case_letter_except(this_fieldnames.filter(e => e[0] == (this.on_right[0])).map(e => e[e.length - 1]));
        }
    }
    inject_error(target_line, notation) {
        if (notation == "With") {
            if (this.position_with == target_line) {
                this.inject_error_into_selection();
                return;
            }
            else if (this.position_with_on == target_line) {
                this.inject_error_into_on();
                return;
            }
        }
        else if (notation == "Subquery") {
            if (this.position_subquery == target_line) {
                this.inject_error_into_selection();
                return;
            }
            else if (this.position_subquery_on == target_line) {
                this.inject_error_into_on();
                return;
            }
        }
        this.left_query.inject_error(target_line, notation);
        this.right_query.inject_error(target_line, notation);
    }
    init_position_with(counter) {
        this.left_query.init_position_with(counter);
        this.right_query.init_position_with(counter);
        this.position_with = ++counter.value;
        this.position_with_on = ++counter.value;
    }
    init_position_subquery(counter) {
        this.left_query.init_position_subquery(counter);
        this.right_query.init_position_subquery(counter);
        this.position_subquery_on = ++counter.value;
        this.position_subquery = ++counter.value;
    }
    write_main_query_for_with(arr) {
        arr.push("SELECT ");
        arr.push(this.explicit_projections.map(e => e.qualified_string + " AS " + e.rename).join(", ") + "\n");
        arr.push("FROM " + this.left_query.name + " JOIN " + this.right_query.name + "\n");
        arr.push(" ".repeat(5) + "ON (" + this.on_as_string() + ")");
    }
    write_into_with(arr, offset) {
        arr.push(" ".repeat(offset) + "SELECT ");
        arr.push(this.explicit_projections.map(e => e.qualified_string + " AS " + e.rename).join(", ") + "\n");
        arr.push(" ".repeat(offset));
        arr.push("FROM " + this.left_query.name + " JOIN " + this.right_query.name + "\n");
        arr.push(" ".repeat(offset));
        arr.push("ON (" + this.on_as_string() + ")");
    }
    collect_sub_queries(subqueries) {
        this.left_query.collect_sub_queries(subqueries);
        this.right_query.collect_sub_queries(subqueries);
    }
    constructor(left_query, right_query) {
        super([]);
        this.left_query = left_query;
        this.right_query = right_query;
        this.explicit_projections = this.create_random_projections(number_of_projections);
        this.on_left = this.left_query.random_attribute_strings(1)[0];
        this.on_right = this.right_query.random_attribute_strings(1)[0];
    }
    create_random_projections(num) {
        let partitions = random_array_element(integer_partitions_of_fix_length(num, 2));
        let left_elements = this.left_query.random_attribute_strings(partitions[0]);
        let right_elements = this.right_query.random_attribute_strings(partitions[1]);
        return this.create_projections(do_random_array_sort(left_elements.concat(right_elements)));
    }
    random_attribute_strings(num) {
        return do_random_array_sort(random_array_elements_without_repetitions(this.explicit_projections, num)).map(e => e.rename);
    }
    write_into_array_with_subqueries(arr, indentation_depth) {
        super.write_into_array_with_subqueries(arr, indentation_depth);
        arr.push(" ".repeat(indentation_depth));
        arr.push("FROM ");
        this.left_query.write_into_array_with_subqueries(arr, indentation_depth + 5);
        arr.push(" ".repeat(indentation_depth));
        arr.push("JOIN ");
        this.right_query.write_into_array_with_subqueries(arr, indentation_depth + 5);
        arr.push(" ".repeat(indentation_depth));
        arr.push("ON (" + this.on_as_string() + ")\n");
    }
    on_as_string() {
        return this.on_left + " = " + this.on_right;
    }
}
function generate_table(forbidden_names, number_of_attributes) {
    let table = new Table(random_upper_case_letter_except(forbidden_names), []);
    repeat_(number_of_attributes)._times(() => table.attributes.push(random_lower_case_letter_except(table.attributes)));
    return table;
}
export function tables_as_string(tables) {
    let arr = [];
    for (let table of tables) {
        arr.push(table.name + "(");
        arr.push(table.attributes.join(", "));
        arr.push(")\n");
    }
    return arr.join("");
}
let tables = generate_tables(5, 3);
let forbidden_names = tables.map(e => e.name);
repeat(5, (number) => {
    let query = generate_query([...tables], forbidden_names, 3);
    if (number == 1) {
        // console.log("NUMBER " + number + "************************************************")
        // console.log(query.query_string_with_subqueries());
        //
        // console.log("dummy");
        query.inject_error(4, "With");
        console.log(query.query_string_with_WITH());
        console.log("************************************************");
        console.log("dummy");
        // console.log("************************************************")
    }
});
//# sourceMappingURL=SQL_Generator_trial02.js.map