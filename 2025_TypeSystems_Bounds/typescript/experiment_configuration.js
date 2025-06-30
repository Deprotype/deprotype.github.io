import { BROWSER_EXPERIMENT } from "../../N-of-1-Experimentation/modules/Experimentation/Browser_Output_Writer.js";
import { alternatives, random_array_element, SET_SEED, text_input_experiment, Time_to_finish } from "../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js";
const SEED = "321";
SET_SEED(SEED);
// Utility to randomly pick n unique elements from an array
function random_letters(n) {
    const alphabet = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
    const result = [];
    while (result.length < n) {
        const letter = random_array_element(alphabet);
        if (!result.includes(letter))
            result.push(letter);
    }
    return result;
}
const NUM_PARAMS_OPTIONS = [2, 3, 4, 5];
const experiment_configuration_function = (writer) => ({
    experiment_name: "Generic-Static-Dynamic-Treatment",
    seed: SEED,
    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(`
      In this experiment, you will see a Java-like code snippet and a method call.
      Your task: enter the resulting type, given the code. Example: Map<A, B>
    `)
    ]),
    pre_run_training_instructions: writer.string_page_command(writer.convert_string_to_html_string("TEST You entered the training phase. You can skip the training by pressing [Esc].")),
    pre_run_experiment_instructions: writer.string_page_command(writer.convert_string_to_html_string("Now the experiment begins. Provide the correct resulting types.")),
    post_questionnaire: [
        alternatives("impression", "How difficult was this?", ["Easy", "Neutral", "Hard"])
    ],
    finish_pages: [
        writer.string_page_command(`<p>Thank you! Please download the data and send it to the experimenter...</p>`)
    ],
    layout: [
        { variable: "Treatment", treatments: ["Static Type", "Dynamic Type"] },
        { variable: "Number_of_parameters", treatments: NUM_PARAMS_OPTIONS.map(String) }
    ],
    repetitions: 2,
    measurement: Time_to_finish(text_input_experiment),
    task_configuration: (task) => {
        var _a;
        const treatment = task.treatment_value("Treatment");
        const num_params = parseInt(task.treatment_value("Number_of_parameters"));
        const letters = random_letters(num_params); // e.g., [B, J, F, H, K]
        // --- Classes
        const class_defs = letters.map(l => `class ${l} {}`).join("\n");
        let method_sig;
        let call_line;
        if (treatment === "Static Type") {
            method_sig = `static Map<${letters.join(", ")}> organize(${letters.map((l, i) => `${l} param${i + 1}`).join(", ")}) { /* ... */ }`;
            const param_list = letters.map((_, i) => `param${i + 1}`).join(", ");
            call_line = `Map<${letters.join(", ")}> result = organize(${param_list});`;
        }
        else {
            const typeVars = letters.map((_, i) => `T${i}`);
            // Shuffle: Which param index each typeVar will match
            const paramIndexes = [...Array(num_params).keys()];
            const shuffledParamIndexes = [...paramIndexes].sort(() => Math.random() - 0.5);
            // Each Tn is bound to the class of the corresponding param it will stand in for
            const mappings = typeVars.map((typeVar, i) => {
                const paramIndex = shuffledParamIndexes[i];
                return {
                    typeVar,
                    paramName: `param${paramIndex + 1}`,
                    boundClass: letters[paramIndex]
                };
            });
            // Shuffle again just for display (order of <T0 extends ...>)
            const shuffledMappingsForDisplay = [...mappings].sort(() => Math.random() - 0.5);
            const generic_bounds = shuffledMappingsForDisplay.map(m => `${m.typeVar} extends ${m.boundClass}`).join(", ");
            const params = mappings.map(m => `${m.typeVar} ${m.paramName}`).join(", ");
            const wildcards = mappings.map(() => "?").join(", ");
            const callParams = mappings.map(m => `${m.paramName}`).join(", ");
            method_sig = `static <${generic_bounds}>\nMap<${wildcards}> organize(${params}) { /* ... */ }`;
            call_line = `Map<${wildcards}> result = organize(${callParams});`;
        }
        // --- Parameter declarations
        const param_decls = letters.map((l, i) => `${l} param${i + 1} = new ${l}();`).join("\n");
        // --- Expected answer
        const callParamOrder = ((_a = call_line.match(/organize\((.*?)\)/)) === null || _a === void 0 ? void 0 : _a[1].split(",").map(p => p.trim())) || [];
        const paramMap = {};
        letters.forEach((l, i) => { paramMap[`param${i + 1}`] = l; });
        const expectedTypesInCallOrder = callParamOrder.map(p => paramMap[p]);
        const expected = `Map<${expectedTypesInCallOrder.join(", ")}>`;
        const code_blocks = [
            "---",
            class_defs,
            "---",
            method_sig,
            "---",
            param_decls,
            "---",
            call_line,
            "---",
        ];
        const display_code = code_blocks.join("\n\n");
        // Assign behavior
        task.do_print_task = () => {
            writer.clear_stage();
            writer.print_string_on_stage(writer.convert_string_to_html_string(display_code));
        };
        task.expected_answer = expected;
        task.accepts_answer_function = (answer) => answer.trim() === expected;
        task.do_print_error_message = () => {
            writer.clear_error();
            writer.print_string_on_stage(`Incorrect, expected ${expected}`);
        };
        task.do_print_after_task_information = () => {
            writer.clear_stage();
            writer.clear_error();
            writer.print_string_on_stage(writer.convert_string_to_html_string("Correct. Press Enter to continue."));
        };
    }
});
BROWSER_EXPERIMENT(experiment_configuration_function);
//# sourceMappingURL=experiment_configuration.js.map