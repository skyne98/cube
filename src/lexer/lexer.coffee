import Lexer from 'lex'
import * as detectIndent from 'detect-indent'
import { create_span } from './../utils/span.coffee'

export lex = (code) ->
	lexer = new Lexer
	#Indentation
	detected_indent = detectIndent(code)
	if detected_indent.type == 'tab' || detected_indent.type == null
		detected_indent.amount = 4
	space_amount = detected_indent.amount

	indents = [0]
	last_indent_level = 0

	#Current position
	position = 0
	row = 1
	column = 1

	#Drop newlines
	lexer.addRule /[\n]/, (lexeme) ->
		column = 1
		row += 1
		position += 1
		return
	lexer.addRule /[\r]/, (lexeme) ->
		column += 1
		position += 1
		return

	lexer.addRule /^ *\r\n/gm, (lexeme) ->
		column = 1
		row += 1
		position += lexeme
		return
	lexer.addRule /^ *\r/gm, (lexeme) ->
		column = 1
		row += 1
		position += lexeme
		return
	lexer.addRule /^ *\n/gm, (lexeme) ->
		column = 1
		row += 1
		position += lexeme
		return

	lexer.addRule /^ */gm, (lexeme) ->
		current_indent_level = lexeme.length
		if current_indent_level % space_amount != 0
			throw new Error 'Wrong indentation: Expected ' + space_amount + '*n spaces, but found ' + current_indent_level
		indent_difference = current_indent_level - last_indent_level

		indents_left = indent_difference
		tokens = []

		add_samedent = indents.includes current_indent_level

		while indents_left > 0
			tokens.push { type: 'indent', value: current_indent_level, span: create_span code, position, current_indent_level, row, column, row, column + current_indent_level }
			indents_left = indents_left - space_amount
			indents.push current_indent_level
		while indents_left < 0
			tokens.push { type: 'dedent', span: create_span code, position, current_indent_level, row, column, row, column + current_indent_level }
			indents_left += space_amount
			indents.pop()

		#Samedent
		if add_samedent then tokens.push { type: 'samedent' }

		last_indent_level = current_indent_level

		#Move position
		column += current_indent_level
		position += current_indent_level

		return tokens

	#Whitespace
	lexer.addRule /[ ]+/, (lexeme) ->
		result = {
			type: 'whitespace'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result

	#Strings
	lexer.addRule /"[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*"/, (lexeme) ->
		result = {
			type: 'string'
			value: lexeme.slice(1, -1)
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	lexer.addRule /'[^'\\\r\n]*(?:\\.[^'\\\r\n]*)*'/, (lexeme) ->
		result = {
			type: 'string'
			value: lexeme.slice(1, -1)
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	#Numbers
	lexer.addRule /\d*\.?\d+(?:[Ee][\+\-]?\d+)?/, (lexeme) ->
		result = {
			type: 'number'
			value: parseFloat lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	#Identifiers
	lexer.addRule /[$a-zA-Z_][0-9A-Za-z_$]*/i, (lexeme) ->
		result = {
			type: 'identifier'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	operator_to_name = (operator) =>
		map_char = (char) =>
			switch char
				when '+'
					return '$plus$'
				when '-'
					return '$minus$'
				when '\\'
					return '$backslash$'
				when '/'
					return '$slash$'
				when '*'
					return '$star$'
				when '|'
					return '$pipe$'
				when '>'
					return '$more$'
				when '<'
					return '$less$'
				when ':'
					return '$colon$'
				when ';'
					return '$semicolon$'
				when '.'
					return '$dot$'
				when '='
					return '$equals$'
				else
					throw new Error 'Undefined operator ' + operator
		return operator.split('').map((c) => map_char c).join('')

	lexer.addRule /\([\+\-\\\*/|><:;\.=]+\)/, (lexeme) ->
		result = {
			type: 'identifier'
			value: operator_to_name lexeme.slice(1, -1)
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	lexer.addRule /\(u[\+\-\\\*/|><:;\.=]+\)/, (lexeme) ->
		result = {
			type: 'identifier'
			value: '$unary$' + (operator_to_name lexeme.slice(2, -1))
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	#Parentheses
	lexer.addRule /\(/, (lexeme) ->
		result = {
			type: 'paren_open'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	lexer.addRule /\)/, (lexeme) ->
		result = {
			type: 'paren_close'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	#Brackets
	lexer.addRule /\[/, (lexeme) ->
		result = {
			type: 'square_open'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	lexer.addRule /\]/, (lexeme) ->
		result = {
			type: 'square_close'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	#Braces
	lexer.addRule /\{/, (lexeme) ->
		result = {
			type: 'curly_open'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	lexer.addRule /\}/, (lexeme) ->
		result = {
			type: 'curly_close'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result

	#Operators
	lexer.addRule /[\+\-\\\*/|><:;\.=]+/, (lexeme) ->
		result = {
			type: 'operator'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result
	lexer.addRule /,/, (lexeme) ->
		result = {
			type: 'comma'
			value: lexeme
			span: create_span code, position, lexeme.length, row, column, row, column + lexeme.length
		}
		column += lexeme.length
		position += lexeme.length
		return result

	lexer.setInput(code)

	tokens = []
	token = lexer.lex()
	while token
		tokens.push token
		token = lexer.lex()

	#Dedent the trailing indentations
	while last_indent_level > 0
		tokens.push { type: 'dedent' }
		last_indent_level -= space_amount
		indents.pop()

	#Remove the trailing samedents
	tokens.shift() while tokens[0] && tokens[0].type == 'samedent'
	return tokens
