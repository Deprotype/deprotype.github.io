import { do_random_array_sort, random_integer_up_to_excluding } from "../../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js";
let OR = "||";
let AND = "&&";
let TRUE = "true";
let FALSE = "false";
function set_and_snippet_true(andSnippet) {
    for (let c = 0; c < andSnippet.length; c++) {
        andSnippet[c] = TRUE;
    }
}
function set_and_snippet_false(andSnippet) {
    andSnippet[0] = FALSE;
    for (let c = 1; c < andSnippet.length; c++) {
        andSnippet[c] = random_integer_up_to_excluding(2) == 1 ? TRUE : FALSE;
    }
    let new_array = do_random_array_sort(andSnippet);
    andSnippet.splice(0, andSnippet.length);
    for (let n of new_array) {
        andSnippet.push(n);
    }
}
function set_answer_position_into_and_snippets(and_snippets, answer_position) {
    for (let i = 0; i < and_snippets.length; i++) {
        if (i == (answer_position - 1)) {
            set_and_snippet_true(and_snippets[i]);
        }
        else {
            set_and_snippet_false(and_snippets[i]);
        }
    }
}
function print_and_snippets_into_string(and_snippets, wants_new_line) {
    let ret = [];
    for (let and_snippet of and_snippets) {
        ret.push(and_snippet.join(" && "));
    }
    return wants_new_line ? ret.join("\n|| ") : ret.join(" || ");
}
export function generate_boolean_expression_as_string(treat_var_format, answerPos) {
    let number_of_literals = 8;
    let literals = [];
    let operators = [OR, OR, OR, AND, AND, AND, AND];
    for (let c = operators.length; c < number_of_literals - 1; c++) {
        operators.push(random_integer_up_to_excluding(2) == 1 ? AND : OR);
    }
    operators = do_random_array_sort(operators);
    let and_snippets = [[FALSE]];
    for (let c = 0; c < number_of_literals - 1; c++) {
        if (operators[c] == AND) {
            and_snippets[and_snippets.length - 1].push(FALSE);
        }
        else {
            and_snippets.push([FALSE]);
        }
    }
    set_answer_position_into_and_snippets(and_snippets, answerPos);
    let ret = print_and_snippets_into_string(and_snippets, treat_var_format == "MultiLine");
    return ret;
}
// let dummy = generate_boolean_expression_as_string("MultiLine", 3);
// console.log(dummy);
//# sourceMappingURL=Bool_Expression_Generator.js.map