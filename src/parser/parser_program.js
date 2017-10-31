import {
    create_seq,
    create_obj,
    create_apply,
    create_op,
    create_identifier,
    create_literal,
    create_dest_arr,
    create_dest_obj,
    create_unary_op,
    create_array,
    create_export,
    create_return
} from "./../ast/ast";
import { match_identifier, match_identifier_peek } from "./match";

export function parse_program(stream, resolver) {
    // Parse the imports
    let macros = [];
    let files = [];

    while (stream.peek().type == "identifier" && stream.peek().value == "use") {
        // Consume the "use"
        stream.consume();

        function parse_use() {
            if (
                stream.peek().type == "identifier" &&
                stream.peek().value == "syntax"
            ) {
                // Consume the "syntax"
                stream.consume();

                if (
                    stream.peek().type == "identifier" &&
                    stream.peek().value == "from"
                ) {
                    // Consume the "from"
                    stream.consume();

                    if (stream.peek().type == "string") {
                        // Consume the path
                        let path = stream.consume().value;
                        macros = macros.concat(resolver.syntax(path)); // [{ name, parser, generator }]

                        // Consume the samedent
                        stream.consume();
                    } else {
                        throw new Error("Path was expected");
                    }
                } else {
                    throw new Error('"from" was expected');
                }
            } else {
                if (
                    stream.peek().type == "operator" &&
                    stream.peek().value == "*"
                ) {
                    // Consume the "*"
                    stream.consume();

                    if (
                        stream.peek().type == "identifier" &&
                        stream.peek().value == "as"
                    ) {
                        // Consume the "as"
                        stream.consume();

                        if (stream.peek().type == "identifier") {
                            // Consume the name// Consume the "*"
                            stream.consume();

                            if (
                                stream.peek().type == "identifier" &&
                                stream.peek().value == "as"
                            ) {
                                // Consume the "as"
                                stream.consume();

                                if (stream.peek().type == "identifier") {
                                    // Consume the name
                                    let name = stream.consume();

                                    if (stream.peek().type == "string") {
                                        // Consume the path
                                        let path = stream.consume().value;
                                        files = files.concat(
                                            resolver.file(path)
                                        ); // [{ name, path }]

                                        // Consume the samedent
                                        stream.consume();
                                    } else {
                                        throw new Error("Path was expected");
                                    }
                                } else {
                                    throw new Error("Name was expected");
                                }
                            } else {
                                throw new Error('"as" was expected');
                            }
                            let name = stream.consume();

                            if (stream.peek().type == "string") {
                                // Consume the path
                                let path = stream.consume().value;
                                let file = resolver.file(path);
                                file.alias = name;
                                files = files.concat(file); // [{ path, alias }]

                                // Consume the samedent
                                stream.consume();
                            } else {
                                throw new Error("Path was expected");
                            }
                        } else {
                            throw new Error("Name was expected");
                        }
                    } else {
                        throw new Error('"as" was expected');
                    }
                } else {
                    let dest = parse_destructuring_obj();

                    if (
                        stream.peek().type == "identifier" &&
                        stream.peek().value == "as"
                    ) {
                        // Consume the "as"
                        stream.consume();

                        if (stream.peek().type == "identifier") {
                            // Consume the name
                            let name = stream.consume();

                            if (stream.peek().type == "string") {
                                // Consume the path
                                let path = stream.consume().value;
                                files = files.concat(resolver.file(path)); // [{ name, path }]

                                // Consume the samedent
                                stream.consume();
                            } else {
                                throw new Error("Path was expected");
                            }
                        } else {
                            throw new Error("Name was expected");
                        }
                    } else {
                        throw new Error('"as" was expected');
                    }
                }
            }

            parse_use();
        }

        // Get rid of the samedents in the begginings
        while (stream.peek().type == "samedent") stream.consume();

        function parse_multiline_expression() {
            return parse_multiline_seq();
        }
        function parse_multiline_seq() {
            let first = parse_multiline_obj();

            let rest = [];
            while (stream.peek() && stream.peek().type == "samedent") {
                stream.consume();
                rest.push(parse_multiline_obj());
            }

            if (rest.length > 0) {
                return create_seq([first].concat(rest));
            }

            return first;
        }
        function parse_multiline_obj() {
            let parsing_obj =
                stream.lookahead(1) &&
                stream.lookahead(1).type == "operator" &&
                stream.lookahead(1).value == ":";

            if (parsing_obj) {
                function parse_obj_param() {
                    if (stream.peek().type == "identifier") {
                        let name = stream.consume().value;
                        if (
                            stream.peek().type == "operator" &&
                            stream.peek().value == ":"
                        ) {
                            stream.consume();
                            let value = parse_return();
                            return {
                                name: name,
                                value: value
                            };
                        }
                        throw new Error("Colon operator was expected");
                    }

                    throw new Error("An identifier was expected");
                }

                let first = parse_obj_param();

                let rest = [];
                while (stream.peek() && stream.peek().type == "samedent") {
                    stream.consume();
                    rest.push(parse_obj_param());
                }
                let params = [first].concat(rest);
                let keys = params.map(p => p.name);
                let values = params.map(p => p.value);
                return create_obj(keys, values);
            } else return parse_return();
        }
        function parse_return() {
            if (stream.peek().type == "identifier") {
                let name = stream.peek().value;
                let is_return = name == "return";
                if (is_return) {
                    stream.consume();
                    return create_return(parse_export());
                }
            }

            return parse_export();
        }
        function parse_export() {
            if (stream.peek().type == "identifier") {
                let name = stream.peek().value;
                let is_export = name == "export";
                if (is_export) {
                    stream.consume();
                    if (stream.peek().type == "identifier") {
                        let is_default = stream.peek().value == "default";
                        if (is_default) {
                            stream.consume();
                            return create_export(parse_macro(), true);
                        }
                    }

                    return create_export(parse_macro(), false);
                }
            }

            return parse_macro();
        }
        function parse_macro() {
            if (stream.peek().type == "identifier") {
                let name = stream.peek().value;
                let is_macro = macros.some(m => m.name == name);
                if (is_macro) {
                    // TODO: Make more secure by evaluating in an isolated context
                    let macro = macros.filter(m => m.name == name)[0];
                    let parser = eval(macro.parser);
                    let result = parser();
                    result.type = "macro";
                    result.generator = eval(macro.generator);
                    result.resolve_scope = eval(macro.resolve_scope);
                    return result;
                }

                return parse_juxt();
            }

            return parse_juxt();
        }
        function parse_juxt() {
            let left = parse_seq();

            if (
                stream.peek() &&
                stream.peek().type != "samedent" &&
                stream.peek().type != "comma" &&
                stream.peek().type != "paren_close" &&
                stream.peek().type != "dedent"
            ) {
                let right = parse_juxt();

                return create_apply(left, right);
            }

            return left;
        }
        function parse_seq() {
            let first = parse_obj();

            let rest = [];
            while (stream.peek() && stream.peek().type == "comma") {
                stream.consume();
                rest.push(parse_obj());
            }

            if (rest.length > 0) {
                return create_seq([first].concat(rest));
            }

            return first;
        }
        function parse_obj() {
            let parsing_obj =
                stream.lookahead(1) &&
                stream.lookahead(1).type == "operator" &&
                stream.lookahead(1).value == ":";

            if (parsing_obj) {
                function parse_obj_param() {
                    if (stream.peek().type == "identifier") {
                        let name = stream.consume().value;
                        if (
                            stream.peek().type == "operator" &&
                            stream.peek().value == ":"
                        ) {
                            stream.consume();
                            let value = parse_array();
                            return {
                                name: name,
                                value: value
                            };
                        }
                        throw new Error("Colon operator was expected");
                    }

                    throw new Error("An identifier was expected");
                }

                let first = parse_obj_param();

                let rest = [];
                while (stream.peek() && stream.peek().type == "comma") {
                    stream.consume();
                    rest.push(parse_obj_param());
                }
                let params = [first].concat(rest);
                let keys = params.map(p => p.name);
                let values = params.map(p => p.value);
                return create_obj(keys, values);
            } else return parse_array();
        }
        function parse_array() {
            let square = stream.peek().type == "square_open";

            if (square) {
                stream.consume();
                let elements = [];

                function parse_item() {
                    /* Parse item as another destructor */
                    let item = parse_op();
                    elements.push(item);
                }
                /* First iteration */
                parse_item();

                /* Loop iterations */
                while (stream.peek().type == "comma") {
                    stream.consume(); // consume the comma
                    parse_item();
                }

                /* Consume the closing square brackets */
                stream.consume();

                return create_array(elements);
            } else {
                return parse_op();
            }
        }
        function parse_op() {
            let first = parse_unary_op();

            let values = [];
            let operators = [];
            while (stream.peek() && stream.peek().type == "operator") {
                let operator = stream.consume().value;
                operators.push(operator);
                values.push(parse_unary_op());
            }

            if (values.length > 0) {
                return create_op([first].concat(values), operators);
            }

            return first;
        }
        function parse_unary_op() {
            if (stream.peek().type == "operator") {
                let operator = stream.consume().value;
                let value = parse_apply();

                return create_unary_op(value, operator);
            }

            return parse_apply();
        }
        function parse_apply() {
            let left = parse_value();

            if (stream.peek() && stream.peek().type == "paren_open") {
                stream.consume();
                let right = parse_multiline_expression();
                // Consume the paren_close
                stream.consume();
                return create_apply(left, right);
            }

            return left;
        }
        function parse_value() {
            if (stream.peek().type == "paren_open") {
                stream.consume();
                let expr = parse_macro();
                // Consume the paren_close
                let closing_token = stream.consume();
                if (closing_token.type != "paren_close")
                    throw new Error("Parentheses pair wasn't closed");
                return expr;
            }
            if (stream.peek().type == "indent") {
                stream.consume();
                let expr = parse_multiline_expression();
                // Consume the dedent
                let closing_token = stream.consume();
                if (closing_token.type != "dedent")
                    throw new Error("Indent/Dedent pair wasn't closed");
                return expr;
            }

            if (stream.peek().type == "identifier") {
                return parse_identifier();
            }

            if (
                stream.peek().type == "string" ||
                stream.peek().type == "number"
            ) {
                return create_literal(stream.consume().value);
            }

            throw new Error(
                "Internal parser error parsing " + JSON.stringify(stream.peek())
            );
        }

        function parse_identifier() {
            return create_identifier(stream.consume().value);
        }

        /* Utilities */
        function parse_destructuring_obj() {
            let curly = stream.peek().type == "curly_open";

            if (curly) {
                stream.consume();
                let elements = [];
                let rest;

                function parse_item() {
                    let next_peek = stream.peek();

                    /* Check for rest */
                    if (
                        next_peek.type == "operator" &&
                        next_peek.value == "..."
                    ) {
                        if (rest)
                            throw new Error(
                                'You cannot use "rest" destructuring more than once'
                            );
                        else {
                            stream.consume(); // consume the dots
                            if (stream.peek().type == "identifier") {
                                let rest_name = stream.consume().value;
                                rest = rest_name;
                            } else {
                                throw new Error("An identifier was expected");
                            }
                        }
                    } else {
                        /* Parse item as identifier (object field name) */
                        if (stream.peek().type == "identifier") {
                            let name = stream.consume().value;

                            if (
                                stream.peek().type == "identifier" &&
                                stream.peek().value == "as"
                            ) {
                                // We have an alias
                                stream.consume();

                                let alias = parse_destructuring_obj();
                                elements.push({
                                    property: name,
                                    alias: alias
                                });
                            } else {
                                elements.push({
                                    property: name,
                                    alias: name
                                });
                            }
                        } else {
                            throw new Error("An identifier was expected");
                        }
                    }
                }
                /* First iteration */
                parse_item();

                /* Loop iterations */
                while (stream.peek().type == "comma") {
                    stream.consume(); // consume the comma
                    parse_item();
                }

                /* Consume the closing curly brackets */
                stream.consume();

                return create_dest_obj(elements, rest);
            } else {
                return parse_destructuring_array();
            }
        }

        function parse_destructuring_array() {
            let square = stream.peek().type == "square_open";

            if (square) {
                stream.consume();
                let elements = [];
                let rest;

                function parse_item() {
                    let next_peek = stream.peek();

                    /* Check for rest */
                    if (
                        next_peek.type == "operator" &&
                        next_peek.value == "..."
                    ) {
                        if (rest)
                            throw new Error(
                                'You cannot use "rest" destructuring more than once'
                            );
                        else {
                            stream.consume(); // consume the dots
                            if (stream.peek().type == "identifier") {
                                let rest_name = stream.consume().value;
                                rest = rest_name;
                            } else {
                                throw new Error("An identifier was expected");
                            }
                        }
                    } else {
                        /* Parse item as another destructor */
                        let item = parse_destructuring_obj();
                        elements.push(item);
                    }
                }
                /* First iteration */
                parse_item();

                /* Loop iterations */
                while (stream.peek().type == "comma") {
                    stream.consume(); // consume the comma
                    parse_item();
                }

                /* Consume the closing square brackets */
                stream.consume();

                return create_dest_arr(elements, rest);
            } else {
                return parse_identifier();
            }
        }

        return parse_multiline_expression();
    }
}
