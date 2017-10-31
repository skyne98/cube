export class Scope {
    constructor(parent) {
        this.parent = parent;
        this.nodes = [];
        this.children = [];
        this.declarations = [];
    }

    add(node) {
        node.scope = this;
        this.nodes.push(node);
    }

    add_declaration(declaration) {
        this.declarations.push(declaration);
    }

    get_declaration(name) {
        let local = this.get_declaration_locally(name);

        if (local) {
            return local;
        } else {
            if (parent) {
                return this.parent.get_declaration();
            } else {
                return undefined;
            }
        }
    }

    get_declaration_locally(name) {
        return this.declarations.filter(d => d.name == name)[0];
    }

    remove_declaration(name) {
        this.declarations = this.declarations.filter(d => d.name != name);
    }

    create() {
        return new Scope(this);
    }
}

export function add_scope_extensions(node) {
    add_scope_resolution(node)
}

function add_scope_resolution(node) {
    switch (node.type) {
        case 'seq':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                for (child of node.children) {
                    current_scope = child.resolve_scope(current_scope);
                }

                return scope;
            }
            break;
        case 'obj':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                for (value of node.values) {
                    value.resolve_scope(current_scope);
                }

                return scope;
            }
            break;
        case 'array':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                for (value of node.values) {
                    value.resolve_scope(current_scope);
                }

                return scope;
            }
            break;
        case 'apply':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                node.left.resolve_scope(current_scope);
                node.right.resolve_scope(current_scope);

                return scope;
            }
            break;
        case 'op':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                for (value of node.values) {
                    value.resolve_scope(current_scope);
                }

                return scope;
            }
            break;
        case 'unary_op':
        case 'export':
        case 'return':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                value.resolve_scope(value);

                return scope;
            }
            break;
        case 'identifier':
        case 'literal':
            node.resolve_scope = function (scope) {
                // Add to given scope
                node.scope = scope;

                let current_scope = scope;

                value.resolve_scope(value);

                return scope;
            }
            break;
    }
}