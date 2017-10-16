export create_seq = (children) =>
    return {
        type: 'seq'
        children: children
    }

export create_obj = (keys, values) =>
    return {
        type: 'obj'
        keys: keys
        values: values
    }

export create_apply = (left, right) =>
    return {
        type: 'apply'
        left: left
        right: right
    }

export create_op = (values, operators) =>
    return {
        type: 'op'
        values: values
        operators: operators
    }

export create_identifier = (value) =>
    return {
        type: 'identifier'
        value: value
    }

export create_literal = (value) =>
    return {
        type: 'literal'
        value: value
    }