/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./typescript/experiment_configuration.ts ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Browser_Output_Writer.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


let SEED = "42";
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(SEED);
let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "TypeSystems-ConstructorCalls-Hierarchical",
        seed: SEED,
        introduction_pages: [
            () => writer.print_string_on_stage("Hello world."),
        ],
        pre_run_training_instructions: writer.string_page_command("You entered the training phase."),
        pre_run_experiment_instructions: writer.string_page_command(writer.convert_string_to_html_string("You entered the experiment phase.")),
        post_questionnaire: [
            Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("Age", "What's your age??", ["younger than 18", "between 18 and (excluding) 25", "between 25 and (excluding) 30", "between 30 and (excluding) 35", "between 35 and (excluding) 40", "40 or older"]),
            Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("Status", "What is your current working status?", ["Undergraduate student (BSc not yet finished)", "Graduate student (at least BSc finished)", "PhD student", "Professional software developer", "Teacher", "Other"]),
            Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("Studies", "In case you study, what's your subject?", ["I do not study", "Computer science", "computer science related (such as information systems, aka WiInf)", "something else in natural sciences", "something else"]),
            Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("YearsOfExperience", "How many years of experience do you have in software industry?", ["none", "less than or equal 1 year", "more than 1 year, but less than or equal 3 years", "more than 3 years, but less than or equal 5 year", "more than 5 years"])
        ],
        finish_pages: [
            writer.string_page_command("<p>Almost done. Next, the experiment data will be downloaded (after pressing [Enter]).<br><br>" +
                "Please, send the downloaded file to the experimenter who will do the analysis</p>")
        ],
        layout: [
            { variable: "MainVariable", treatments: ["A", "B"] },
            { variable: "SomeOtherVariable", treatments: ["0", "1"] },
        ],
        repetitions: 4,
        measurement: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Experimentation.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(["0", "1", "2", "3"])),
        task_configuration: (t) => {
            t.do_print_task = () => {
                writer.clear_stage();
                writer.print_html_on_stage("<h1>Hello world, treatment " + t.treatment_value("MainVariable") + "</h1");
            };
            t.expected_answer = "4";
            t.do_print_after_task_information = () => {
                writer.print_error_string_on_stage(writer.convert_string_to_html_string("Ok, there was something wrong. Dont mind."));
            };
        }
    };
};
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../N-of-1-Experimentation/modules/Experimentation/Browser_Output_Writer.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(experiment_configuration_function);

/******/ })()
;
//# sourceMappingURL=experiment_configuration.js.map