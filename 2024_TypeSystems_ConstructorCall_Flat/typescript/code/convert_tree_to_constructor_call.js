import { Constructor_Call } from "./Constructor_Call.js";
export function as_constructor_call(tree) {
    let ret = new Constructor_Call(tree.content, []);
    tree.children.forEach(v => ret.parameters.push(as_constructor_call(v)));
    return ret;
}
//# sourceMappingURL=convert_tree_to_constructor_call.js.map