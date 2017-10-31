import * as scope from './../scope/scope.js'

export create_seq = (children) =>
    node = {
        type: 'seq'
        children: children
    }
    scope.add_scope_extensions node

    return node

export create_obj = (keys, values) =>
    node = {
        type: 'obj'
        keys: keys
        values: values
    }
    scope.add_scope_extensions node

    return node

export create_array = (values) =>
    node = {
        type: 'array'
        values: values
    }
    scope.add_scope_extensions node

    return node

export create_apply = (left, right) =>
    node = {
        type: 'apply'
        left: left
        right: right
    }
    scope.add_scope_extensions node

    return node

export create_op = (values, operators) =>
    node = {
        type: 'op'
        values: values
        operators: operators
    }
    scope.add_scope_extensions node

    return node

export create_unary_op = (value, operator) =>
    node = {
        type: 'unary_op'
        value: value
        operator: operator
    }
    scope.add_scope_extensions node

    return node

export create_export = (value, is_default) =>
    node = {
        type: 'export'
        value: value
        is_default: is_default
    }
    scope.add_scope_extensions node

    return node

export create_return = (value) =>
    node = {
        type: 'return'
        value: value
    }
    scope.add_scope_extensions node

    return node

export create_identifier = (value) =>
    node = {
        type: 'identifier'
        value: value
    }
    scope.add_scope_extensions node

    return node

export create_literal = (value) =>
    node = {
        type: 'literal'
        value: value
    }
    scope.add_scope_extensions node

    return node

# Destructuring
export create_dest_obj = (properties ### [{ property, alias }] ###, rest ### undefined, if no ###) =>
    node = {
        type: 'dest_obj'
        properties: properties
        rest: rest
    }
    scope.add_scope_extensions node

    return node
export create_dest_arr = (elements ### [ names ] ###, rest ### undefined, if no ###) =>
    node = {
        type: 'dest_arr'
        elements: elements
        rest: rest
    }
    scope.add_scope_extensions node

    return node