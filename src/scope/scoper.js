import { Scope } from './scope'

export function scope_program(node) {
    let scope = new Scope();
    //TODO: Add imports to the uppermost scope
    node.resolve_scope(scope);

    return scope;
}