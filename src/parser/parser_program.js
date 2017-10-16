import { create_seq, create_obj, create_apply, create_op, create_identifier, create_literal } from './../ast/ast'
import { match_identifier, match_identifier_peek } from './match'

export function parse_program(stream, meta) {
	// Get rid of the samedents in the begginings
	while (stream.peek().type == 'samedent')
		stream.consume()

	function parse_multiline_expression() {
		return parse_multiline_seq();
	}
	function parse_multiline_seq() {
        let first = parse_multiline_obj();

		let rest = [];
		while (stream.peek() && stream.peek().type == 'samedent') {
			stream.consume()
			rest.push(parse_multiline_obj());
		}

		if (rest.length > 0) {
			return create_seq([first].concat(rest));
		}

		return first;
	}
	function parse_multiline_obj() {
		let parsing_obj = stream.lookahead(1) && stream.lookahead(1).type == 'operator' && stream.lookahead(1).value == ':';

		if (parsing_obj) {
			function parse_obj_param() {
				if (stream.peek().type == 'identifier') {
					let name = stream.consume().value;
					if (stream.peek().type == 'operator' && stream.peek().value == ':') {
						stream.consume();
						let value = parse_macro();
						return {
							name: name,
							value: value
						};
					}
					throw new Error('Colon operator was expected');
				}

				throw new Error('An identifier was expected');
			}

			let first = parse_obj_param();

            let rest = [];
            while (stream.peek() && stream.peek().type == 'samedent') {
                stream.consume()
                rest.push(parse_obj_param());
            }
            let params = [first].concat(rest);
            let keys = params.map(p => p.name);
            let values = params.map(p => p.value);
            return create_obj(keys, values);
		}
		else 
			return parse_macro();
    }
    function parse_macro() {
		if (stream.peek().type == 'identifier') {
            let name = stream.peek().value;
            let is_macro = meta.syntax.some(m => m.name == name);
            if (is_macro) {
                // TODO: Make more secure by evaluating in an isolated context
                let macro = meta.syntax.filter(m => m.name == name)[0];
                let parse = eval(macro.parser);
                let result = parse();
                result.type = 'macro';
                result.generator = macro.generator;
                return result;
            }

            return parse_juxt();
        }

        return parse_juxt();
    }
    function parse_juxt() {
        let left = parse_seq();

        if (stream.peek() && stream.peek().type != 'samedent') {
            let right = parse_seq();
            
            return create_apply(left, right);
        }

        return left;
        
    }
    function parse_seq() {
		let first = parse_obj();

		let rest = [];
		while (stream.peek() && stream.peek().type == 'comma') {
			stream.consume()
			rest.push(parse_obj());
		}

		if (rest.length > 0) {
			return create_seq([first].concat(rest));
		}

		return first;
    }
    function parse_obj() {
		let parsing_obj = stream.lookahead(1) && stream.lookahead(1).type == 'operator' && stream.lookahead(1).value == ':';

		if (parsing_obj) {
			function parse_obj_param() {
				if (stream.peek().type == 'identifier') {
                    let name = stream.consume().value;
					if (stream.peek().type == 'operator' && stream.peek().value == ':') {
						stream.consume();
						let value = parse_op();
						return {
							name: name,
							value: value
						};
					}
					throw new Error('Colon operator was expected');
				}

				throw new Error('An identifier was expected');
			}

            let first = parse_obj_param();

            let rest = [];
            while (stream.peek() && stream.peek().type == 'comma') {
                stream.consume()
                rest.push(parse_obj_param());
            }
            let params = [first].concat(rest);
            let keys = params.map(p => p.name);
            let values = params.map(p => p.value);
            return create_obj(keys, values);
		}
		else 
			return parse_op();
    }
    function parse_op() {
		let first = parse_apply();

        let values = [];
        let operators = [];
		while (stream.peek() && stream.peek().type == 'operator') {
            let operator = stream.consume().value;
            operators.push(operator);
			values.push(parse_apply());
		}

		if (values.length > 0) {
			return create_op([first].concat(values), operators);
		}

		return first;
    }
    function parse_apply() {
        let left = parse_value();

        if (stream.peek() && stream.peek().type == 'paren_open') {
            stream.consume();
            let right = parse_multiline_expression();
            // Consume the paren_close
            stream.consume();
            return create_apply(left, right);
        }
        
        return left;
    }
    function parse_value() {
        if (stream.peek().type == 'paren_open') {
            stream.consume();
            let expr = parse_multiline_expression();
            // Consume the paren_close
            stream.consume();
            return expr;
        }

        if (stream.peek().type == 'identifier') {
            return create_identifier(stream.consume().value);
        }

        if (stream.peek().type == 'string' || stream.peek().type == 'number') {
            return create_literal(stream.consume().value);
        }

        throw new Error('Internal parser error parsing ' + JSON.stringify(stream.peek()));
    }

    return parse_multiline_expression();
}
