/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!****************************!*\
  !*** ./lexer/lexer.coffee ***!
  \****************************/
/*! exports provided: lex */
/*! exports used: lex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return lex; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lex__ = __webpack_require__(/*! lex */ 5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_indent__ = __webpack_require__(/*! detect-indent */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_indent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_detect_indent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__ = __webpack_require__(/*! ./../utils/span.coffee */ 7);






var lex = function(code) {
  var column, detected_indent, indents, last_indent_level, lexer, position, row, space_amount, token, tokens;
  lexer = new __WEBPACK_IMPORTED_MODULE_0_lex___default.a;
  //Indentation
  detected_indent = __WEBPACK_IMPORTED_MODULE_1_detect_indent__(code);
  if (detected_indent.type === 'tab' || detected_indent.type === null) {
    throw new Error('Wrong indentation');
  }
  space_amount = detected_indent.amount;
  indents = [0];
  last_indent_level = 0;
  //Current position
  position = 0;
  row = 1;
  column = 1;
  //Drop newlines
  lexer.addRule(/[\n]/, function(lexeme) {
    column = 1;
    row += 1;
    position += 1;
  });
  lexer.addRule(/[\r]/, function(lexeme) {
    column += 1;
    position += 1;
  });
  lexer.addRule(/^ */gm, function(lexeme) {
    var add_samedent, current_indent_level, indent_difference, indents_left, tokens;
    current_indent_level = lexeme.length;
    if (current_indent_level % space_amount !== 0) {
      throw new Error('Wrong indentation: Expected ' + space_amount + '*n spaces, but found ' + current_indent_level);
    }
    indent_difference = current_indent_level - last_indent_level;
    indents_left = indent_difference;
    tokens = [];
    add_samedent = indents.includes(current_indent_level);
    while (indents_left > 0) {
      tokens.push({
        type: 'indent',
        value: current_indent_level,
        span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, current_indent_level, row, column, row, column + current_indent_level)
      });
      indents_left = indents_left - space_amount;
      indents.push(current_indent_level);
    }
    while (indents_left < 0) {
      tokens.push({
        type: 'dedent',
        span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, current_indent_level, row, column, row, column + current_indent_level)
      });
      indents_left += space_amount;
      indents.pop();
    }
    //Samedent
    if (add_samedent) {
      tokens.push({
        type: 'samedent'
      });
    }
    last_indent_level = current_indent_level;
    //Move position
    column += current_indent_level;
    position += current_indent_level;
    return tokens;
  });
  //Whitespace
  lexer.addRule(/[ ]+/, function(lexeme) {
    var result;
    result = {
      type: 'whitespace',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Strings
  lexer.addRule(/"[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*"/, function(lexeme) {
    var result;
    result = {
      type: 'string',
      value: lexeme.slice(1, -1),
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.addRule(/'[^'\\\r\n]*(?:\\.[^'\\\r\n]*)*'/, function(lexeme) {
    var result;
    result = {
      type: 'string',
      value: lexeme.slice(1, -1),
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Numbers
  lexer.addRule(/[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/, function(lexeme) {
    var result;
    result = {
      type: 'number',
      value: parseFloat(lexeme),
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Identifiers
  lexer.addRule(/[$a-zA-Z_][0-9A-Za-z_$]*/i, function(lexeme) {
    var result;
    result = {
      type: 'identifier',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Parentheses
  lexer.addRule(/\(/, function(lexeme) {
    var result;
    result = {
      type: 'paren_open',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.addRule(/\)/, function(lexeme) {
    var result;
    result = {
      type: 'paren_close',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Brackets
  lexer.addRule(/\[/, function(lexeme) {
    var result;
    result = {
      type: 'bra_open',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.addRule(/\]/, function(lexeme) {
    var result;
    result = {
      type: 'bra_close',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Brackets
  lexer.addRule(/\[/, function(lexeme) {
    var result;
    result = {
      type: 'square_open',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.addRule(/\]/, function(lexeme) {
    var result;
    result = {
      type: 'square_close',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Braces
  lexer.addRule(/\{/, function(lexeme) {
    var result;
    result = {
      type: 'curly_open',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.addRule(/\}/, function(lexeme) {
    var result;
    result = {
      type: 'curly_close',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  //Operators
  lexer.addRule(/[\+\-\\\*\/|><:;\.=]+/, function(lexeme) {
    var result;
    result = {
      type: 'operator',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.addRule(/,/, function(lexeme) {
    var result;
    result = {
      type: 'comma',
      value: lexeme,
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.length;
    position += lexeme.length;
    return result;
  });
  lexer.setInput(code);
  tokens = [];
  token = lexer.lex();
  while (token) {
    tokens.push(token);
    token = lexer.lex();
  }
  //Dedent the trailing indentations
  while (last_indent_level > 0) {
    tokens.push({
      type: 'dedent'
    });
    last_indent_level -= space_amount;
    indents.pop();
  }
  while (tokens[0] && tokens[0].type === 'samedent') {
    //Remove the trailing samedents
    tokens.shift();
  }
  return tokens;
};


/***/ }),
/* 1 */
/*!************************!*\
  !*** ./ast/ast.coffee ***!
  \************************/
/*! exports provided: create_seq, create_obj, create_apply, create_op, create_identifier, create_literal */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_seq", function() { return create_seq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_obj", function() { return create_obj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_apply", function() { return create_apply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_op", function() { return create_op; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_identifier", function() { return create_identifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_literal", function() { return create_literal; });
var create_seq = (children) => {
  return {
    type: 'seq',
    children: children
  };
};

var create_obj = (keys, values) => {
  return {
    type: 'obj',
    keys: keys,
    values: values
  };
};

var create_apply = (left, right) => {
  return {
    type: 'apply',
    left: left,
    right: right
  };
};

var create_op = (values, operators) => {
  return {
    type: 'op',
    values: values,
    operators: operators
  };
};

var create_identifier = (value) => {
  return {
    type: 'identifier',
    value: value
  };
};

var create_literal = (value) => {
  return {
    type: 'literal',
    value: value
  };
};


/***/ }),
/* 2 */
/*!*****************************!*\
  !*** ./parser/match.coffee ***!
  \*****************************/
/*! exports provided: match_identifier, match_identifier_peek */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "match_identifier", function() { return match_identifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "match_identifier_peek", function() { return match_identifier_peek; });
var match_identifier = (stream, value) => {
  var token;
  token = stream.consume();
  if (token.type !== 'identifier' || token.value !== value) {
    throw new Error('Was expecting an identifier with value "' + value + '", but found ' + JSON.stringify(token));
  }
  return token;
};

var match_identifier_peek = (stream, value) => {
  var token;
  token = stream.peek();
  if (token.type !== 'identifier' || token.value !== value) {
    throw new Error('Was expecting an identifier with value "' + value + '", but found ' + JSON.stringify(token));
  }
  return token;
};


/***/ }),
/* 3 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!*********************!*\
  !*** ./cube.coffee ***!
  \*********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lexer_lexer__ = __webpack_require__(/*! ./lexer/lexer */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parser_parser__ = __webpack_require__(/*! ./parser/parser */ 8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_treeify__ = __webpack_require__(/*! treeify */ 17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_treeify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_treeify__);
var code;







code = __webpack_require__(/*! ./testcode.txt */ 18);

console.log(__WEBPACK_IMPORTED_MODULE_2_treeify__["asTree"](Object(__WEBPACK_IMPORTED_MODULE_1__parser_parser__["a" /* parse */])(code), true));


/***/ }),
/* 5 */
/*!************************************!*\
  !*** ../node_modules/lex/lexer.js ***!
  \************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

if (typeof module === "object" && typeof module.exports === "object") module.exports = Lexer;

Lexer.defunct = function (chr) {
    throw new Error("Unexpected character at index " + (this.index - 1) + ": " + chr);
};

function Lexer(defunct) {
    if (typeof defunct !== "function") defunct = Lexer.defunct;

    var tokens = [];
    var rules = [];
    var remove = 0;
    this.state = 0;
    this.index = 0;
    this.input = "";

    this.addRule = function (pattern, action, start) {
        var global = pattern.global;

        if (!global) {
            var flags = "g";
            if (pattern.multiline) flags += "m";
            if (pattern.ignoreCase) flags += "i";
            pattern = new RegExp(pattern.source, flags);
        }

        if (Object.prototype.toString.call(start) !== "[object Array]") start = [0];

        rules.push({
            pattern: pattern,
            global: global,
            action: action,
            start: start
        });

        return this;
    };

    this.setInput = function (input) {
        remove = 0;
        this.state = 0;
        this.index = 0;
        tokens.length = 0;
        this.input = input;
        return this;
    };

    this.lex = function () {
        if (tokens.length) return tokens.shift();

        this.reject = true;

        while (this.index <= this.input.length) {
            var matches = scan.call(this).splice(remove);
            var index = this.index;

            while (matches.length) {
                if (this.reject) {
                    var match = matches.shift();
                    var result = match.result;
                    var length = match.length;
                    this.index += length;
                    this.reject = false;
                    remove++;

                    var token = match.action.apply(this, result);
                    if (this.reject) this.index = result.index;
                    else if (typeof token !== "undefined") {
                        switch (Object.prototype.toString.call(token)) {
                        case "[object Array]":
                            tokens = token.slice(1);
                            token = token[0];
                        default:
                            if (length) remove = 0;
                            return token;
                        }
                    }
                } else break;
            }

            var input = this.input;

            if (index < input.length) {
                if (this.reject) {
                    remove = 0;
                    var token = defunct.call(this, input.charAt(this.index++));
                    if (typeof token !== "undefined") {
                        if (Object.prototype.toString.call(token) === "[object Array]") {
                            tokens = token.slice(1);
                            return token[0];
                        } else return token;
                    }
                } else {
                    if (this.index !== index) remove = 0;
                    this.reject = true;
                }
            } else if (matches.length)
                this.reject = true;
            else break;
        }
    };

    function scan() {
        var matches = [];
        var index = 0;

        var state = this.state;
        var lastIndex = this.index;
        var input = this.input;

        for (var i = 0, length = rules.length; i < length; i++) {
            var rule = rules[i];
            var start = rule.start;
            var states = start.length;

            if ((!states || start.indexOf(state) >= 0) ||
                (state % 2 && states === 1 && !start[0])) {
                var pattern = rule.pattern;
                pattern.lastIndex = lastIndex;
                var result = pattern.exec(input);

                if (result && result.index === lastIndex) {
                    var j = matches.push({
                        result: result,
                        action: rule.action,
                        length: result[0].length
                    });

                    if (rule.global) index = j;

                    while (--j > index) {
                        var k = j - 1;

                        if (matches[j].length > matches[k].length) {
                            var temple = matches[j];
                            matches[j] = matches[k];
                            matches[k] = temple;
                        }
                    }
                }
            }
        }

        return matches;
    }
}


/***/ }),
/* 6 */
/*!**********************************************!*\
  !*** ../node_modules/detect-indent/index.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// detect either spaces or tabs but not both to properly handle tabs
// for indentation and spaces for alignment
const INDENT_RE = /^(?:( )+|\t+)/;

function getMostUsed(indents) {
	let result = 0;
	let maxUsed = 0;
	let maxWeight = 0;

	for (const entry of indents) {
		// TODO: use destructuring when targeting Node.js 6
		const key = entry[0];
		const val = entry[1];

		const u = val[0];
		const w = val[1];

		if (u > maxUsed || (u === maxUsed && w > maxWeight)) {
			maxUsed = u;
			maxWeight = w;
			result = Number(key);
		}
	}

	return result;
}

module.exports = str => {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	// used to see if tabs or spaces are the most used
	let tabs = 0;
	let spaces = 0;

	// remember the size of previous line's indentation
	let prev = 0;

	// remember how many indents/unindents as occurred for a given size
	// and how much lines follow a given indentation
	//
	// indents = {
	//    3: [1, 0],
	//    4: [1, 5],
	//    5: [1, 0],
	//   12: [1, 0],
	// }
	const indents = new Map();

	// pointer to the array of last used indent
	let current;

	// whether the last action was an indent (opposed to an unindent)
	let isIndent;

	for (const line of str.split(/\n/g)) {
		if (!line) {
			// ignore empty lines
			continue;
		}

		let indent;
		const matches = line.match(INDENT_RE);

		if (matches) {
			indent = matches[0].length;

			if (matches[1]) {
				spaces++;
			} else {
				tabs++;
			}
		} else {
			indent = 0;
		}

		const diff = indent - prev;
		prev = indent;

		if (diff) {
			// an indent or unindent has been detected

			isIndent = diff > 0;

			current = indents.get(isIndent ? diff : -diff);

			if (current) {
				current[0]++;
			} else {
				current = [1, 0];
				indents.set(diff, current);
			}
		} else if (current) {
			// if the last action was an indent, increment the weight
			current[1] += Number(isIndent);
		}
	}

	const amount = getMostUsed(indents);

	let type;
	let indent;
	if (!amount) {
		type = null;
		indent = '';
	} else if (spaces >= tabs) {
		type = 'space';
		indent = ' '.repeat(amount);
	} else {
		type = 'tab';
		indent = '\t'.repeat(amount);
	}

	return {
		amount,
		type,
		indent
	};
};


/***/ }),
/* 7 */
/*!***************************!*\
  !*** ./utils/span.coffee ***!
  \***************************/
/*! exports provided: create_span */
/*! exports used: create_span */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create_span; });
var create_span = (code, position, length, start_row, start_column, end_row, end_column) => {
  return {
    snippet: code.slice(position, position + length),
    position: position,
    length: length,
    start_row: start_row,
    start_column: start_column,
    end_row: end_row,
    end_column: end_column
  };
};


/***/ }),
/* 8 */
/*!******************************!*\
  !*** ./parser/parser.coffee ***!
  \******************************/
/*! exports provided: parse */
/*! exports used: parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return parse; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lexer_lexer__ = __webpack_require__(/*! ./../lexer/lexer */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_stream__ = __webpack_require__(/*! ./../utils/stream */ 9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ast_ast__ = __webpack_require__(/*! ./../ast/ast */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__parser_meta__ = __webpack_require__(/*! ./parser_meta */ 10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__parser_program__ = __webpack_require__(/*! ./parser_program */ 16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__parser_program___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__parser_program__);










var parse = (code) => {
  var lexed, meta, stream;
  lexed = Object(__WEBPACK_IMPORTED_MODULE_0__lexer_lexer__["a" /* lex */])(code);
  stream = Object(__WEBPACK_IMPORTED_MODULE_1__utils_stream__["a" /* streamify */])(lexed.filter((i) => {
    return i.type !== 'whitespace';
  }));
  meta = Object(__WEBPACK_IMPORTED_MODULE_3__parser_meta__["a" /* parse_meta */])(stream);
  return Object(__WEBPACK_IMPORTED_MODULE_4__parser_program__["parse_program"])(stream, meta);
};


/***/ }),
/* 9 */
/*!*****************************!*\
  !*** ./utils/stream.coffee ***!
  \*****************************/
/*! exports provided: streamify */
/*! exports used: streamify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return streamify; });
var streamify = (array) => {
  return {
    array: array,
    consume: function() {
      return this.array.shift();
    },
    lookahead: function(items) {
      return this.array[items];
    },
    peek: function() {
      return this.lookahead(0);
    }
  };
};


/***/ }),
/* 10 */
/*!***********************************!*\
  !*** ./parser/parser_meta.coffee ***!
  \***********************************/
/*! exports provided: parse_meta */
/*! exports used: parse_meta */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return parse_meta; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__match__ = __webpack_require__(/*! ./match */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_buble__ = __webpack_require__(/*! buble */ 11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_buble___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_buble__);




var parse_meta = (stream) => {
  var error, i, imports, len, line, lines, name, parse_meta_line, syntax;
  try {
    Object(__WEBPACK_IMPORTED_MODULE_0__match__["match_identifier_peek"])(stream, 'meta'); // not to lose the first token
    stream.consume();
    name = 'default';
    try {
      Object(__WEBPACK_IMPORTED_MODULE_0__match__["match_identifier_peek"])(stream, 'where');
      stream.consume();
    } catch (error1) {
      error = error1;
      name = stream.consume().value;
      Object(__WEBPACK_IMPORTED_MODULE_0__match__["match_identifier"])(stream, 'where');
    }
    if (stream.peek().type !== 'indent') {
      return {
        implicit: false,
        name: name,
        lines: []
      };
    }
    // there is an indentation
    stream.consume();
    // function to parse meta line
    parse_meta_line = () => {
      var next, parse_syntax;
      parse_syntax = () => {
        var code, syntax, syntax_name, type;
        stream.consume();
        if (stream.peek().type !== 'identifier') {
          throw new Error('Name of the syntax was expected');
        }
        syntax_name = stream.consume().value;
        syntax = {
          type: 'syntax',
          name: syntax_name
        };
        if (stream.peek().type === 'indent') {
          stream.consume();
          while (stream.peek().type !== 'dedent') {
            if (stream.peek().type === 'samedent') {
              stream.consume();
            }
            if (stream.peek().type !== 'identifier') {
              throw new Error('"parse" or "generate" identifiers were expected, but ' + stream.peek().type + ' were found');
            }
            type = stream.peek().value;
            switch (type) {
              case 'parse':
                stream.consume();
                code = stream.consume();
                if (code.type !== 'string') {
                  throw new Error('Code in string format was expected');
                }
                code = (__WEBPACK_IMPORTED_MODULE_1_buble__["transform"](code.value)).code;
                syntax.parser = code;
                break;
              case 'generate':
                stream.consume();
                code = stream.consume();
                if (code.type !== 'string') {
                  throw new Error('Code in string format was expected');
                }
                code = (__WEBPACK_IMPORTED_MODULE_1_buble__["transform"](code.value)).code;
                syntax.generator = code;
                break;
              default:
                throw new Error('"parse" or "generate" identifiers were expected, but ' + type + ' were found');
            }
          }
          stream.consume();
          return syntax;
        } else {
          throw new Error('Indentation was expected after the "syntax" declaration, but ' + JSON.stringify(stream.peek()) + ' was found');
        }
      };
      next = stream.peek();
      if (next.type !== 'identifier') {
        throw new Error('An identifier was expected');
      }
      switch (next.value) {
        case 'syntax':
          return parse_syntax();
        default:
          throw new Error('"syntax" or "import" lines where expected, but ' + next.value + ' was found.');
      }
    };
    lines = [];
    lines.push(parse_meta_line());
    while (stream.peek().type === 'samedent') {
      stream.consume();
      lines.push(parse_meta_line());
    }
    // Consume the dedent token
    stream.consume();
    syntax = [];
    imports = [];
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      switch (line.type) {
        case 'syntax':
          syntax.push(line);
          break;
        default:
          imports.push(line);
      }
    }
    return {
      implicit: false,
      name: name,
      syntax: syntax,
      imports: imports
    };
  } catch (error1) {
    error = error1;
    console.log('%o', error);
    return {
      implicit: true
    };
  }
};


/***/ }),
/* 11 */
/*!************************************************!*\
  !*** ../node_modules/buble/dist/buble.deps.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! exports used: transform */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, Buffer) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	 true ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.buble = {})));
}(this, (function (exports) { 'use strict';

var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }


var acorn = __commonjs(function (module, exports, global) {
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) :
  (factory((global.acorn = global.acorn || {})));
}(__commonjs_global, function (exports) { 'use strict';

  // Reserved word lists for various dialects of the language

  var reservedWords = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    7: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments"
  };

  // And the keywords

  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

  var keywords = {
    5: ecma5AndLessKeywords,
    6: ecma5AndLessKeywords + " const class extends export import super"
  };

  // ## Character categories

  // Big ugly regular expressions that match characters in the
  // whitespace, identifier, and identifier-start categories. These
  // are only applied when a character is found to actually have a
  // code point above 128.
  // Generated by `bin/generate-identifier-regex.js`.

  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0-\u08b4\u08b6-\u08bd\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fd5\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ae\ua7b0-\ua7b7\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab65\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
  var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08d4-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d01-\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1cf8\u1cf9\u1dc0-\u1df5\u1dfb-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";

  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

  nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;

  // These are a run-length and offset encoded representation of the
  // >0xffff code points that are a valid part of identifiers. The
  // offset starts at 0x10000, and each pair of numbers represents an
  // offset to the next range, and then a size of the range. They were
  // generated by bin/generate-identifier-regex.js
  var astralIdentifierStartCodes = [0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,17,26,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,157,310,10,21,11,7,153,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,71,55,7,1,65,0,16,3,2,2,2,26,45,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,785,52,76,44,33,24,27,35,42,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,85,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,159,52,19,3,54,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,86,25,391,63,32,0,449,56,264,8,2,36,18,0,50,29,881,921,103,110,18,195,2749,1070,4050,582,8634,568,8,30,114,29,19,47,17,3,32,20,6,18,881,68,12,0,67,12,65,0,32,6124,20,754,9486,1,3071,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,4149,196,60,67,1213,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42710,42,4148,12,221,3,5761,10591,541];
  var astralIdentifierCodes = [509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,1306,2,54,14,32,9,16,3,46,10,54,9,7,2,37,13,2,9,52,0,13,2,49,13,10,2,4,9,83,11,7,0,161,11,6,9,7,3,57,0,2,6,3,1,3,2,10,0,11,1,3,6,4,4,193,17,10,9,87,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,84,14,5,9,423,9,838,7,2,7,17,9,57,21,2,13,19882,9,135,4,60,6,26,9,1016,45,17,3,19723,1,5319,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,2214,6,110,6,6,9,792487,239];

  // This has a complexity linear to the value of the code. The
  // assumption is that looking up astral identifier characters is
  // rare.
  function isInAstralSet(code, set) {
    var pos = 0x10000;
    for (var i = 0; i < set.length; i += 2) {
      pos += set[i];
      if (pos > code) return false
      pos += set[i + 1];
      if (pos >= code) return true
    }
  }

  // Test whether a given character code starts an identifier.

  function isIdentifierStart(code, astral) {
    if (code < 65) return code === 36
    if (code < 91) return true
    if (code < 97) return code === 95
    if (code < 123) return true
    if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code))
    if (astral === false) return false
    return isInAstralSet(code, astralIdentifierStartCodes)
  }

  // Test whether a given character is part of an identifier.

  function isIdentifierChar(code, astral) {
    if (code < 48) return code === 36
    if (code < 58) return true
    if (code < 65) return false
    if (code < 91) return true
    if (code < 97) return code === 95
    if (code < 123) return true
    if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code))
    if (astral === false) return false
    return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
  }

  // ## Token types

  // The assignment of fine-grained, information-carrying type objects
  // allows the tokenizer to store the information it has about a
  // token in a way that is very cheap for the parser to look up.

  // All token type variables start with an underscore, to make them
  // easy to recognize.

  // The `beforeExpr` property is used to disambiguate between regular
  // expressions and divisions. It is set on all token types that can
  // be followed by an expression (thus, a slash after them would be a
  // regular expression).
  //
  // The `startsExpr` property is used to check if the token ends a
  // `yield` expression. It is set on all token types that either can
  // directly start an expression (like a quotation mark) or can
  // continue an expression (like the body of a string).
  //
  // `isLoop` marks a keyword as starting a loop, which is important
  // to know when parsing a label, in order to allow or disallow
  // continue jumps to that label.

  var TokenType = function TokenType(label, conf) {
    if ( conf === void 0 ) conf = {};

    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  };

  function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
  }
  var beforeExpr = {beforeExpr: true};
  var startsExpr = {startsExpr: true};
  // Map keyword names to token types.

  var keywordTypes = {};

  // Succinct definitions of keyword token types
  function kw(name, options) {
    if ( options === void 0 ) options = {};

    options.keyword = name;
    return keywordTypes[name] = new TokenType(name, options)
  }

  var tt = {
    num: new TokenType("num", startsExpr),
    regexp: new TokenType("regexp", startsExpr),
    string: new TokenType("string", startsExpr),
    name: new TokenType("name", startsExpr),
    eof: new TokenType("eof"),

    // Punctuation token types.
    bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
    bracketR: new TokenType("]"),
    braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
    braceR: new TokenType("}"),
    parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
    parenR: new TokenType(")"),
    comma: new TokenType(",", beforeExpr),
    semi: new TokenType(";", beforeExpr),
    colon: new TokenType(":", beforeExpr),
    dot: new TokenType("."),
    question: new TokenType("?", beforeExpr),
    arrow: new TokenType("=>", beforeExpr),
    template: new TokenType("template"),
    ellipsis: new TokenType("...", beforeExpr),
    backQuote: new TokenType("`", startsExpr),
    dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),

    // Operators. These carry several kinds of properties to help the
    // parser use them properly (the presence of these properties is
    // what categorizes them as operators).
    //
    // `binop`, when present, specifies that this operator is a binary
    // operator, and will refer to its precedence.
    //
    // `prefix` and `postfix` mark the operator as a prefix or postfix
    // unary operator.
    //
    // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
    // binary operators with a very low precedence, that should result
    // in AssignmentExpression nodes.

    eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
    assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
    incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
    prefix: new TokenType("prefix", {beforeExpr: true, prefix: true, startsExpr: true}),
    logicalOR: binop("||", 1),
    logicalAND: binop("&&", 2),
    bitwiseOR: binop("|", 3),
    bitwiseXOR: binop("^", 4),
    bitwiseAND: binop("&", 5),
    equality: binop("==/!=", 6),
    relational: binop("</>", 7),
    bitShift: binop("<</>>", 8),
    plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
    modulo: binop("%", 10),
    star: binop("*", 10),
    slash: binop("/", 10),
    starstar: new TokenType("**", {beforeExpr: true}),

    // Keyword token types.
    _break: kw("break"),
    _case: kw("case", beforeExpr),
    _catch: kw("catch"),
    _continue: kw("continue"),
    _debugger: kw("debugger"),
    _default: kw("default", beforeExpr),
    _do: kw("do", {isLoop: true, beforeExpr: true}),
    _else: kw("else", beforeExpr),
    _finally: kw("finally"),
    _for: kw("for", {isLoop: true}),
    _function: kw("function", startsExpr),
    _if: kw("if"),
    _return: kw("return", beforeExpr),
    _switch: kw("switch"),
    _throw: kw("throw", beforeExpr),
    _try: kw("try"),
    _var: kw("var"),
    _const: kw("const"),
    _while: kw("while", {isLoop: true}),
    _with: kw("with"),
    _new: kw("new", {beforeExpr: true, startsExpr: true}),
    _this: kw("this", startsExpr),
    _super: kw("super", startsExpr),
    _class: kw("class"),
    _extends: kw("extends", beforeExpr),
    _export: kw("export"),
    _import: kw("import"),
    _null: kw("null", startsExpr),
    _true: kw("true", startsExpr),
    _false: kw("false", startsExpr),
    _in: kw("in", {beforeExpr: true, binop: 7}),
    _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
    _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
    _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
    _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
  };

  // Matches a whole line break (where CRLF is considered a single
  // line break). Used to count lines.

  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");

  function isNewLine(code) {
    return code === 10 || code === 13 || code === 0x2028 || code == 0x2029
  }

  var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]"
  }

  // Checks if an object has a property.

  function has(obj, propName) {
    return Object.prototype.hasOwnProperty.call(obj, propName)
  }

  // These are used when `options.locations` is on, for the
  // `startLoc` and `endLoc` properties.

  var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
  };

  Position.prototype.offset = function offset (n) {
    return new Position(this.line, this.column + n)
  };

  var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) this.source = p.sourceFile;
  };

  // The `getLineInfo` function is mostly useful when the
  // `locations` option is off (for performance reasons) and you
  // want to find the line/column position for a given character
  // offset. `input` should be the code string that the offset refers
  // into.

  function getLineInfo(input, offset) {
    for (var line = 1, cur = 0;;) {
      lineBreakG.lastIndex = cur;
      var match = lineBreakG.exec(input);
      if (match && match.index < offset) {
        ++line;
        cur = match.index + match[0].length;
      } else {
        return new Position(line, offset - cur)
      }
    }
  }

  // A second optional argument can be given to further configure
  // the parser process. These options are recognized:

  var defaultOptions = {
    // `ecmaVersion` indicates the ECMAScript version to parse. Must
    // be either 3, or 5, or 6. This influences support for strict
    // mode, the set of reserved words, support for getters and
    // setters and other features. The default is 6.
    ecmaVersion: 6,
    // Source type ("script" or "module") for different semantics
    sourceType: "script",
    // `onInsertedSemicolon` can be a callback that will be called
    // when a semicolon is automatically inserted. It will be passed
    // th position of the comma as an offset, and if `locations` is
    // enabled, it is given the location as a `{line, column}` object
    // as second argument.
    onInsertedSemicolon: null,
    // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
    // trailing commas.
    onTrailingComma: null,
    // By default, reserved words are only enforced if ecmaVersion >= 5.
    // Set `allowReserved` to a boolean value to explicitly turn this on
    // an off. When this option has the value "never", reserved words
    // and keywords can also not be used as property names.
    allowReserved: null,
    // When enabled, a return at the top level is not considered an
    // error.
    allowReturnOutsideFunction: false,
    // When enabled, import/export statements are not constrained to
    // appearing at the top of the program.
    allowImportExportEverywhere: false,
    // When enabled, hashbang directive in the beginning of file
    // is allowed and treated as a line comment.
    allowHashBang: false,
    // When `locations` is on, `loc` properties holding objects with
    // `start` and `end` properties in `{line, column}` form (with
    // line being 1-based and column 0-based) will be attached to the
    // nodes.
    locations: false,
    // A function can be passed as `onToken` option, which will
    // cause Acorn to call that function with object in the same
    // format as tokens returned from `tokenizer().getToken()`. Note
    // that you are not allowed to call the parser from the
    // callback—that will corrupt its internal state.
    onToken: null,
    // A function can be passed as `onComment` option, which will
    // cause Acorn to call that function with `(block, text, start,
    // end)` parameters whenever a comment is skipped. `block` is a
    // boolean indicating whether this is a block (`/* */`) comment,
    // `text` is the content of the comment, and `start` and `end` are
    // character offsets that denote the start and end of the comment.
    // When the `locations` option is on, two more parameters are
    // passed, the full `{line, column}` locations of the start and
    // end of the comments. Note that you are not allowed to call the
    // parser from the callback—that will corrupt its internal state.
    onComment: null,
    // Nodes have their start and end characters offsets recorded in
    // `start` and `end` properties (directly on the node, rather than
    // the `loc` object, which holds line/column data. To also add a
    // [semi-standardized][range] `range` property holding a `[start,
    // end]` array with the same numbers, set the `ranges` option to
    // `true`.
    //
    // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
    ranges: false,
    // It is possible to parse multiple files into a single AST by
    // passing the tree produced by parsing the first file as
    // `program` option in subsequent parses. This will add the
    // toplevel forms of the parsed file to the `Program` (top) node
    // of an existing parse tree.
    program: null,
    // When `locations` is on, you can pass this to record the source
    // file in every node's `loc` object.
    sourceFile: null,
    // This value, if given, is stored in every node, whether
    // `locations` is on or off.
    directSourceFile: null,
    // When enabled, parenthesized expressions are represented by
    // (non-standard) ParenthesizedExpression nodes
    preserveParens: false,
    plugins: {}
  };

  // Interpret and default an options object

  function getOptions(opts) {
    var options = {};
    for (var opt in defaultOptions)
      options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
    if (options.allowReserved == null)
      options.allowReserved = options.ecmaVersion < 5;

    if (isArray(options.onToken)) {
      var tokens = options.onToken;
      options.onToken = function (token) { return tokens.push(token); };
    }
    if (isArray(options.onComment))
      options.onComment = pushComment(options, options.onComment);

    return options
  }

  function pushComment(options, array) {
    return function (block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? 'Block' : 'Line',
        value: text,
        start: start,
        end: end
      };
      if (options.locations)
        comment.loc = new SourceLocation(this, startLoc, endLoc);
      if (options.ranges)
        comment.range = [start, end];
      array.push(comment);
    }
  }

  // Registered plugins
  var plugins = {};

  function keywordRegexp(words) {
    return new RegExp("^(" + words.replace(/ /g, "|") + ")$")
  }

  var Parser = function Parser(options, input, startPos) {
    this.options = options = getOptions(options);
    this.sourceFile = options.sourceFile;
    this.keywords = keywordRegexp(keywords[options.ecmaVersion >= 6 ? 6 : 5]);
    var reserved = options.allowReserved ? "" :
        reservedWords[options.ecmaVersion] + (options.sourceType == "module" ? " await" : "");
    this.reservedWords = keywordRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
    this.reservedWordsStrict = keywordRegexp(reservedStrict);
    this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + reservedWords.strictBind);
    this.input = String(input);

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.
    this.containsEsc = false;

    // Load plugins
    this.loadPlugins(options.plugins);

    // Set up token state

    // The current position of the tokenizer in the input.
    if (startPos) {
      this.pos = startPos;
      this.lineStart = Math.max(0, this.input.lastIndexOf("\n", startPos));
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }

    // Properties of the current token:
    // Its type
    this.type = tt.eof;
    // For tokens that include more information than their type, the value
    this.value = null;
    // Its start and end offset
    this.start = this.end = this.pos;
    // And, if locations are used, the {line, column} object
    // corresponding to those offsets
    this.startLoc = this.endLoc = this.curPosition();

    // Position information for the previous token
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;

    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = this.initialContext();
    this.exprAllowed = true;

    // Figure out if it's a module code.
    this.strict = this.inModule = options.sourceType === "module";

    // Used to signify the start of a potential arrow function
    this.potentialArrowAt = -1;

    // Flags to track whether we are in a function, a generator.
    this.inFunction = this.inGenerator = false;
    // Labels in scope.
    this.labels = [];

    // If enabled, skip leading hashbang line.
    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === '#!')
      this.skipLineComment(2);
  };

  // DEPRECATED Kept for backwards compatibility until 3.0 in case a plugin uses them
  Parser.prototype.isKeyword = function isKeyword (word) { return this.keywords.test(word) };
  Parser.prototype.isReservedWord = function isReservedWord (word) { return this.reservedWords.test(word) };

  Parser.prototype.extend = function extend (name, f) {
    this[name] = f(this[name]);
  };

  Parser.prototype.loadPlugins = function loadPlugins (pluginConfigs) {
      var this$1 = this;

    for (var name in pluginConfigs) {
      var plugin = plugins[name];
      if (!plugin) throw new Error("Plugin '" + name + "' not found")
      plugin(this$1, pluginConfigs[name]);
    }
  };

  Parser.prototype.parse = function parse () {
    var node = this.options.program || this.startNode();
    this.nextToken();
    return this.parseTopLevel(node)
  };

  var pp = Parser.prototype;

  // ## Parser utilities

  // Test whether a statement node is the string literal `"use strict"`.

  pp.isUseStrict = function(stmt) {
    return this.options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" &&
      stmt.expression.raw.slice(1, -1) === "use strict"
  };

  // Predicate that tests whether the next token is of the given
  // type, and if yes, consumes it as a side effect.

  pp.eat = function(type) {
    if (this.type === type) {
      this.next();
      return true
    } else {
      return false
    }
  };

  // Tests whether parsed token is a contextual keyword.

  pp.isContextual = function(name) {
    return this.type === tt.name && this.value === name
  };

  // Consumes contextual keyword if possible.

  pp.eatContextual = function(name) {
    return this.value === name && this.eat(tt.name)
  };

  // Asserts that following token is given contextual keyword.

  pp.expectContextual = function(name) {
    if (!this.eatContextual(name)) this.unexpected();
  };

  // Test whether a semicolon can be inserted at the current position.

  pp.canInsertSemicolon = function() {
    return this.type === tt.eof ||
      this.type === tt.braceR ||
      lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };

  pp.insertSemicolon = function() {
    if (this.canInsertSemicolon()) {
      if (this.options.onInsertedSemicolon)
        this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
      return true
    }
  };

  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.

  pp.semicolon = function() {
    if (!this.eat(tt.semi) && !this.insertSemicolon()) this.unexpected();
  };

  pp.afterTrailingComma = function(tokType) {
    if (this.type == tokType) {
      if (this.options.onTrailingComma)
        this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
      this.next();
      return true
    }
  };

  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error.

  pp.expect = function(type) {
    this.eat(type) || this.unexpected();
  };

  // Raise an unexpected token error.

  pp.unexpected = function(pos) {
    this.raise(pos != null ? pos : this.start, "Unexpected token");
  };

  var DestructuringErrors = function DestructuringErrors() {
    this.shorthandAssign = 0;
    this.trailingComma = 0;
  };

  pp.checkPatternErrors = function(refDestructuringErrors, andThrow) {
    var trailing = refDestructuringErrors && refDestructuringErrors.trailingComma;
    if (!andThrow) return !!trailing
    if (trailing) this.raise(trailing, "Comma is not permitted after the rest element");
  };

  pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
    var pos = refDestructuringErrors && refDestructuringErrors.shorthandAssign;
    if (!andThrow) return !!pos
    if (pos) this.raise(pos, "Shorthand property assignments are valid only in destructuring patterns");
  };

  var pp$1 = Parser.prototype;

  // ### Statement parsing

  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.

  pp$1.parseTopLevel = function(node) {
    var this$1 = this;

    var first = true;
    if (!node.body) node.body = [];
    while (this.type !== tt.eof) {
      var stmt = this$1.parseStatement(true, true);
      node.body.push(stmt);
      if (first) {
        if (this$1.isUseStrict(stmt)) this$1.setStrict(true);
        first = false;
      }
    }
    this.next();
    if (this.options.ecmaVersion >= 6) {
      node.sourceType = this.options.sourceType;
    }
    return this.finishNode(node, "Program")
  };

  var loopLabel = {kind: "loop"};
  var switchLabel = {kind: "switch"};
  pp$1.isLet = function() {
    if (this.type !== tt.name || this.options.ecmaVersion < 6 || this.value != "let") return false
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
    if (nextCh === 91 || nextCh == 123) return true // '{' and '['
    if (isIdentifierStart(nextCh, true)) {
      for (var pos = next + 1; isIdentifierChar(this.input.charCodeAt(pos), true); ++pos) {}
      var ident = this.input.slice(next, pos);
      if (!this.isKeyword(ident)) return true
    }
    return false
  };

  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo)`, where looking at the previous token
  // does not help.

  pp$1.parseStatement = function(declaration, topLevel) {
    var starttype = this.type, node = this.startNode(), kind;

    if (this.isLet()) {
      starttype = tt._var;
      kind = "let";
    }

    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.

    switch (starttype) {
    case tt._break: case tt._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
    case tt._debugger: return this.parseDebuggerStatement(node)
    case tt._do: return this.parseDoStatement(node)
    case tt._for: return this.parseForStatement(node)
    case tt._function:
      if (!declaration && this.options.ecmaVersion >= 6) this.unexpected();
      return this.parseFunctionStatement(node)
    case tt._class:
      if (!declaration) this.unexpected();
      return this.parseClass(node, true)
    case tt._if: return this.parseIfStatement(node)
    case tt._return: return this.parseReturnStatement(node)
    case tt._switch: return this.parseSwitchStatement(node)
    case tt._throw: return this.parseThrowStatement(node)
    case tt._try: return this.parseTryStatement(node)
    case tt._const: case tt._var:
      kind = kind || this.value;
      if (!declaration && kind != "var") this.unexpected();
      return this.parseVarStatement(node, kind)
    case tt._while: return this.parseWhileStatement(node)
    case tt._with: return this.parseWithStatement(node)
    case tt.braceL: return this.parseBlock()
    case tt.semi: return this.parseEmptyStatement(node)
    case tt._export:
    case tt._import:
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel)
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        if (!this.inModule)
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
      }
      return starttype === tt._import ? this.parseImport(node) : this.parseExport(node)

      // If the statement does not start with a statement keyword or a
      // brace, it's an ExpressionStatement or LabeledStatement. We
      // simply start parsing an expression, and afterwards, if the
      // next token is a colon and the expression was a simple
      // Identifier node, we switch to interpreting it as a label.
    default:
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === tt.name && expr.type === "Identifier" && this.eat(tt.colon))
        return this.parseLabeledStatement(node, maybeName, expr)
      else return this.parseExpressionStatement(node, expr)
    }
  };

  pp$1.parseBreakContinueStatement = function(node, keyword) {
    var this$1 = this;

    var isBreak = keyword == "break";
    this.next();
    if (this.eat(tt.semi) || this.insertSemicolon()) node.label = null;
    else if (this.type !== tt.name) this.unexpected();
    else {
      node.label = this.parseIdent();
      this.semicolon();
    }

    // Verify that there is an actual destination to break or
    // continue to.
    for (var i = 0; i < this.labels.length; ++i) {
      var lab = this$1.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) break
        if (node.label && isBreak) break
      }
    }
    if (i === this.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
  };

  pp$1.parseDebuggerStatement = function(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement")
  };

  pp$1.parseDoStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    node.body = this.parseStatement(false);
    this.labels.pop();
    this.expect(tt._while);
    node.test = this.parseParenExpression();
    if (this.options.ecmaVersion >= 6)
      this.eat(tt.semi);
    else
      this.semicolon();
    return this.finishNode(node, "DoWhileStatement")
  };

  // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
  // loop is non-trivial. Basically, we have to parse the init `var`
  // statement or expression, disallowing the `in` operator (see
  // the second parameter to `parseExpression`), and then check
  // whether the next token is `in` or `of`. When there is no init
  // part (semicolon immediately after the opening parenthesis), it
  // is a regular `for` loop.

  pp$1.parseForStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    this.expect(tt.parenL);
    if (this.type === tt.semi) return this.parseFor(node, null)
    var isLet = this.isLet();
    if (this.type === tt._var || this.type === tt._const || isLet) {
      var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
      this.next();
      this.parseVar(init$1, true, kind);
      this.finishNode(init$1, "VariableDeclaration");
      if ((this.type === tt._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1 &&
          !(kind !== "var" && init$1.declarations[0].init))
        return this.parseForIn(node, init$1)
      return this.parseFor(node, init$1)
    }
    var refDestructuringErrors = new DestructuringErrors;
    var init = this.parseExpression(true, refDestructuringErrors);
    if (this.type === tt._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.checkPatternErrors(refDestructuringErrors, true);
      this.toAssignable(init);
      this.checkLVal(init);
      return this.parseForIn(node, init)
    } else {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
    return this.parseFor(node, init)
  };

  pp$1.parseFunctionStatement = function(node) {
    this.next();
    return this.parseFunction(node, true)
  };

  pp$1.parseIfStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    node.consequent = this.parseStatement(false);
    node.alternate = this.eat(tt._else) ? this.parseStatement(false) : null;
    return this.finishNode(node, "IfStatement")
  };

  pp$1.parseReturnStatement = function(node) {
    if (!this.inFunction && !this.options.allowReturnOutsideFunction)
      this.raise(this.start, "'return' outside of function");
    this.next();

    // In `return` (and `break`/`continue`), the keywords with
    // optional arguments, we eagerly look for a semicolon or the
    // possibility to insert one.

    if (this.eat(tt.semi) || this.insertSemicolon()) node.argument = null;
    else { node.argument = this.parseExpression(); this.semicolon(); }
    return this.finishNode(node, "ReturnStatement")
  };

  pp$1.parseSwitchStatement = function(node) {
    var this$1 = this;

    this.next();
    node.discriminant = this.parseParenExpression();
    node.cases = [];
    this.expect(tt.braceL);
    this.labels.push(switchLabel);

    // Statements under must be grouped (by label) in SwitchCase
    // nodes. `cur` is used to keep the node that we are currently
    // adding statements to.

    for (var cur, sawDefault = false; this.type != tt.braceR;) {
      if (this$1.type === tt._case || this$1.type === tt._default) {
        var isCase = this$1.type === tt._case;
        if (cur) this$1.finishNode(cur, "SwitchCase");
        node.cases.push(cur = this$1.startNode());
        cur.consequent = [];
        this$1.next();
        if (isCase) {
          cur.test = this$1.parseExpression();
        } else {
          if (sawDefault) this$1.raiseRecoverable(this$1.lastTokStart, "Multiple default clauses");
          sawDefault = true;
          cur.test = null;
        }
        this$1.expect(tt.colon);
      } else {
        if (!cur) this$1.unexpected();
        cur.consequent.push(this$1.parseStatement(true));
      }
    }
    if (cur) this.finishNode(cur, "SwitchCase");
    this.next(); // Closing brace
    this.labels.pop();
    return this.finishNode(node, "SwitchStatement")
  };

  pp$1.parseThrowStatement = function(node) {
    this.next();
    if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
      this.raise(this.lastTokEnd, "Illegal newline after throw");
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement")
  };

  // Reused empty array added for node fields that are always empty.

  var empty = [];

  pp$1.parseTryStatement = function(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.type === tt._catch) {
      var clause = this.startNode();
      this.next();
      this.expect(tt.parenL);
      clause.param = this.parseBindingAtom();
      this.checkLVal(clause.param, true);
      this.expect(tt.parenR);
      clause.body = this.parseBlock();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(tt._finally) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer)
      this.raise(node.start, "Missing catch or finally clause");
    return this.finishNode(node, "TryStatement")
  };

  pp$1.parseVarStatement = function(node, kind) {
    this.next();
    this.parseVar(node, false, kind);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration")
  };

  pp$1.parseWhileStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    this.labels.push(loopLabel);
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, "WhileStatement")
  };

  pp$1.parseWithStatement = function(node) {
    if (this.strict) this.raise(this.start, "'with' in strict mode");
    this.next();
    node.object = this.parseParenExpression();
    node.body = this.parseStatement(false);
    return this.finishNode(node, "WithStatement")
  };

  pp$1.parseEmptyStatement = function(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement")
  };

  pp$1.parseLabeledStatement = function(node, maybeName, expr) {
    var this$1 = this;

    for (var i = 0; i < this.labels.length; ++i)
      if (this$1.labels[i].name === maybeName) this$1.raise(expr.start, "Label '" + maybeName + "' is already declared");
    var kind = this.type.isLoop ? "loop" : this.type === tt._switch ? "switch" : null;
    for (var i$1 = this.labels.length - 1; i$1 >= 0; i$1--) {
      var label = this$1.labels[i$1];
      if (label.statementStart == node.start) {
        label.statementStart = this$1.start;
        label.kind = kind;
      } else break
    }
    this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
    node.body = this.parseStatement(true);
    this.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement")
  };

  pp$1.parseExpressionStatement = function(node, expr) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement")
  };

  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).

  pp$1.parseBlock = function(allowStrict) {
    var this$1 = this;

    var node = this.startNode(), first = true, oldStrict;
    node.body = [];
    this.expect(tt.braceL);
    while (!this.eat(tt.braceR)) {
      var stmt = this$1.parseStatement(true);
      node.body.push(stmt);
      if (first && allowStrict && this$1.isUseStrict(stmt)) {
        oldStrict = this$1.strict;
        this$1.setStrict(this$1.strict = true);
      }
      first = false;
    }
    if (oldStrict === false) this.setStrict(false);
    return this.finishNode(node, "BlockStatement")
  };

  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.

  pp$1.parseFor = function(node, init) {
    node.init = init;
    this.expect(tt.semi);
    node.test = this.type === tt.semi ? null : this.parseExpression();
    this.expect(tt.semi);
    node.update = this.type === tt.parenR ? null : this.parseExpression();
    this.expect(tt.parenR);
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, "ForStatement")
  };

  // Parse a `for`/`in` and `for`/`of` loop, which are almost
  // same from parser's perspective.

  pp$1.parseForIn = function(node, init) {
    var type = this.type === tt._in ? "ForInStatement" : "ForOfStatement";
    this.next();
    node.left = init;
    node.right = this.parseExpression();
    this.expect(tt.parenR);
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, type)
  };

  // Parse a list of variable declarations.

  pp$1.parseVar = function(node, isFor, kind) {
    var this$1 = this;

    node.declarations = [];
    node.kind = kind;
    for (;;) {
      var decl = this$1.startNode();
      this$1.parseVarId(decl);
      if (this$1.eat(tt.eq)) {
        decl.init = this$1.parseMaybeAssign(isFor);
      } else if (kind === "const" && !(this$1.type === tt._in || (this$1.options.ecmaVersion >= 6 && this$1.isContextual("of")))) {
        this$1.unexpected();
      } else if (decl.id.type != "Identifier" && !(isFor && (this$1.type === tt._in || this$1.isContextual("of")))) {
        this$1.raise(this$1.lastTokEnd, "Complex binding patterns require an initialization value");
      } else {
        decl.init = null;
      }
      node.declarations.push(this$1.finishNode(decl, "VariableDeclarator"));
      if (!this$1.eat(tt.comma)) break
    }
    return node
  };

  pp$1.parseVarId = function(decl) {
    decl.id = this.parseBindingAtom();
    this.checkLVal(decl.id, true);
  };

  // Parse a function declaration or literal (depending on the
  // `isStatement` parameter).

  pp$1.parseFunction = function(node, isStatement, allowExpressionBody) {
    this.initFunction(node);
    if (this.options.ecmaVersion >= 6)
      node.generator = this.eat(tt.star);
    var oldInGen = this.inGenerator;
    this.inGenerator = node.generator;
    if (isStatement || this.type === tt.name)
      node.id = this.parseIdent();
    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody);
    this.inGenerator = oldInGen;
    return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression")
  };

  pp$1.parseFunctionParams = function(node) {
    this.expect(tt.parenL);
    node.params = this.parseBindingList(tt.parenR, false, false, true);
  };

  // Parse a class declaration or literal (depending on the
  // `isStatement` parameter).

  pp$1.parseClass = function(node, isStatement) {
    var this$1 = this;

    this.next();
    this.parseClassId(node, isStatement);
    this.parseClassSuper(node);
    var classBody = this.startNode();
    var hadConstructor = false;
    classBody.body = [];
    this.expect(tt.braceL);
    while (!this.eat(tt.braceR)) {
      if (this$1.eat(tt.semi)) continue
      var method = this$1.startNode();
      var isGenerator = this$1.eat(tt.star);
      var isMaybeStatic = this$1.type === tt.name && this$1.value === "static";
      this$1.parsePropertyName(method);
      method.static = isMaybeStatic && this$1.type !== tt.parenL;
      if (method.static) {
        if (isGenerator) this$1.unexpected();
        isGenerator = this$1.eat(tt.star);
        this$1.parsePropertyName(method);
      }
      method.kind = "method";
      var isGetSet = false;
      if (!method.computed) {
        var key = method.key;
        if (!isGenerator && key.type === "Identifier" && this$1.type !== tt.parenL && (key.name === "get" || key.name === "set")) {
          isGetSet = true;
          method.kind = key.name;
          key = this$1.parsePropertyName(method);
        }
        if (!method.static && (key.type === "Identifier" && key.name === "constructor" ||
            key.type === "Literal" && key.value === "constructor")) {
          if (hadConstructor) this$1.raise(key.start, "Duplicate constructor in the same class");
          if (isGetSet) this$1.raise(key.start, "Constructor can't have get/set modifier");
          if (isGenerator) this$1.raise(key.start, "Constructor can't be a generator");
          method.kind = "constructor";
          hadConstructor = true;
        }
      }
      this$1.parseClassMethod(classBody, method, isGenerator);
      if (isGetSet) {
        var paramCount = method.kind === "get" ? 0 : 1;
        if (method.value.params.length !== paramCount) {
          var start = method.value.start;
          if (method.kind === "get")
            this$1.raiseRecoverable(start, "getter should have no params");
          else
            this$1.raiseRecoverable(start, "setter should have exactly one param");
        }
        if (method.kind === "set" && method.value.params[0].type === "RestElement")
          this$1.raise(method.value.params[0].start, "Setter cannot use rest params");
      }
    }
    node.body = this.finishNode(classBody, "ClassBody");
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
  };

  pp$1.parseClassMethod = function(classBody, method, isGenerator) {
    method.value = this.parseMethod(isGenerator);
    classBody.body.push(this.finishNode(method, "MethodDefinition"));
  };

  pp$1.parseClassId = function(node, isStatement) {
    node.id = this.type === tt.name ? this.parseIdent() : isStatement ? this.unexpected() : null;
  };

  pp$1.parseClassSuper = function(node) {
    node.superClass = this.eat(tt._extends) ? this.parseExprSubscripts() : null;
  };

  // Parses module export declaration.

  pp$1.parseExport = function(node) {
    var this$1 = this;

    this.next();
    // export * from '...'
    if (this.eat(tt.star)) {
      this.expectContextual("from");
      node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
      this.semicolon();
      return this.finishNode(node, "ExportAllDeclaration")
    }
    if (this.eat(tt._default)) { // export default ...
      var parens = this.type == tt.parenL;
      var expr = this.parseMaybeAssign();
      var needsSemi = true;
      if (!parens && (expr.type == "FunctionExpression" ||
                      expr.type == "ClassExpression")) {
        needsSemi = false;
        if (expr.id) {
          expr.type = expr.type == "FunctionExpression"
            ? "FunctionDeclaration"
            : "ClassDeclaration";
        }
      }
      node.declaration = expr;
      if (needsSemi) this.semicolon();
      return this.finishNode(node, "ExportDefaultDeclaration")
    }
    // export var|const|let|function|class ...
    if (this.shouldParseExportStatement()) {
      node.declaration = this.parseStatement(true);
      node.specifiers = [];
      node.source = null;
    } else { // export { x, y as z } [from '...']
      node.declaration = null;
      node.specifiers = this.parseExportSpecifiers();
      if (this.eatContextual("from")) {
        node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
      } else {
        // check for keywords used as local names
        for (var i = 0; i < node.specifiers.length; i++) {
          if (this$1.keywords.test(node.specifiers[i].local.name) || this$1.reservedWords.test(node.specifiers[i].local.name)) {
            this$1.unexpected(node.specifiers[i].local.start);
          }
        }

        node.source = null;
      }
      this.semicolon();
    }
    return this.finishNode(node, "ExportNamedDeclaration")
  };

  pp$1.shouldParseExportStatement = function() {
    return this.type.keyword || this.isLet()
  };

  // Parses a comma-separated list of module exports.

  pp$1.parseExportSpecifiers = function() {
    var this$1 = this;

    var nodes = [], first = true;
    // export { x, y as z } [from '...']
    this.expect(tt.braceL);
    while (!this.eat(tt.braceR)) {
      if (!first) {
        this$1.expect(tt.comma);
        if (this$1.afterTrailingComma(tt.braceR)) break
      } else first = false;

      var node = this$1.startNode();
      node.local = this$1.parseIdent(this$1.type === tt._default);
      node.exported = this$1.eatContextual("as") ? this$1.parseIdent(true) : node.local;
      nodes.push(this$1.finishNode(node, "ExportSpecifier"));
    }
    return nodes
  };

  // Parses import declaration.

  pp$1.parseImport = function(node) {
    this.next();
    // import '...'
    if (this.type === tt.string) {
      node.specifiers = empty;
      node.source = this.parseExprAtom();
    } else {
      node.specifiers = this.parseImportSpecifiers();
      this.expectContextual("from");
      node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration")
  };

  // Parses a comma-separated list of module imports.

  pp$1.parseImportSpecifiers = function() {
    var this$1 = this;

    var nodes = [], first = true;
    if (this.type === tt.name) {
      // import defaultObj, { x, y as z } from '...'
      var node = this.startNode();
      node.local = this.parseIdent();
      this.checkLVal(node.local, true);
      nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
      if (!this.eat(tt.comma)) return nodes
    }
    if (this.type === tt.star) {
      var node$1 = this.startNode();
      this.next();
      this.expectContextual("as");
      node$1.local = this.parseIdent();
      this.checkLVal(node$1.local, true);
      nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
      return nodes
    }
    this.expect(tt.braceL);
    while (!this.eat(tt.braceR)) {
      if (!first) {
        this$1.expect(tt.comma);
        if (this$1.afterTrailingComma(tt.braceR)) break
      } else first = false;

      var node$2 = this$1.startNode();
      node$2.imported = this$1.parseIdent(true);
      if (this$1.eatContextual("as")) {
        node$2.local = this$1.parseIdent();
      } else {
        node$2.local = node$2.imported;
        if (this$1.isKeyword(node$2.local.name)) this$1.unexpected(node$2.local.start);
        if (this$1.reservedWordsStrict.test(node$2.local.name)) this$1.raise(node$2.local.start, "The keyword '" + node$2.local.name + "' is reserved");
      }
      this$1.checkLVal(node$2.local, true);
      nodes.push(this$1.finishNode(node$2, "ImportSpecifier"));
    }
    return nodes
  };

  var pp$2 = Parser.prototype;

  // Convert existing expression atom to assignable pattern
  // if possible.

  pp$2.toAssignable = function(node, isBinding) {
    var this$1 = this;

    if (this.options.ecmaVersion >= 6 && node) {
      switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
        break

      case "ObjectExpression":
        node.type = "ObjectPattern";
        for (var i = 0; i < node.properties.length; i++) {
          var prop = node.properties[i];
          if (prop.kind !== "init") this$1.raise(prop.key.start, "Object pattern can't contain getter or setter");
          this$1.toAssignable(prop.value, isBinding);
        }
        break

      case "ArrayExpression":
        node.type = "ArrayPattern";
        this.toAssignableList(node.elements, isBinding);
        break

      case "AssignmentExpression":
        if (node.operator === "=") {
          node.type = "AssignmentPattern";
          delete node.operator;
          // falls through to AssignmentPattern
        } else {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
          break
        }

      case "AssignmentPattern":
        if (node.right.type === "YieldExpression")
          this.raise(node.right.start, "Yield expression cannot be a default value");
        break

      case "ParenthesizedExpression":
        node.expression = this.toAssignable(node.expression, isBinding);
        break

      case "MemberExpression":
        if (!isBinding) break

      default:
        this.raise(node.start, "Assigning to rvalue");
      }
    }
    return node
  };

  // Convert list of expression atoms to binding list.

  pp$2.toAssignableList = function(exprList, isBinding) {
    var this$1 = this;

    var end = exprList.length;
    if (end) {
      var last = exprList[end - 1];
      if (last && last.type == "RestElement") {
        --end;
      } else if (last && last.type == "SpreadElement") {
        last.type = "RestElement";
        var arg = last.argument;
        this.toAssignable(arg, isBinding);
        if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern")
          this.unexpected(arg.start);
        --end;
      }

      if (isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
        this.unexpected(last.argument.start);
    }
    for (var i = 0; i < end; i++) {
      var elt = exprList[i];
      if (elt) this$1.toAssignable(elt, isBinding);
    }
    return exprList
  };

  // Parses spread element.

  pp$2.parseSpread = function(refDestructuringErrors) {
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    return this.finishNode(node, "SpreadElement")
  };

  pp$2.parseRest = function(allowNonIdent) {
    var node = this.startNode();
    this.next();

    // RestElement inside of a function parameter must be an identifier
    if (allowNonIdent) node.argument = this.type === tt.name ? this.parseIdent() : this.unexpected();
    else node.argument = this.type === tt.name || this.type === tt.bracketL ? this.parseBindingAtom() : this.unexpected();

    return this.finishNode(node, "RestElement")
  };

  // Parses lvalue (assignable) atom.

  pp$2.parseBindingAtom = function() {
    if (this.options.ecmaVersion < 6) return this.parseIdent()
    switch (this.type) {
    case tt.name:
      return this.parseIdent()

    case tt.bracketL:
      var node = this.startNode();
      this.next();
      node.elements = this.parseBindingList(tt.bracketR, true, true);
      return this.finishNode(node, "ArrayPattern")

    case tt.braceL:
      return this.parseObj(true)

    default:
      this.unexpected();
    }
  };

  pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowNonIdent) {
    var this$1 = this;

    var elts = [], first = true;
    while (!this.eat(close)) {
      if (first) first = false;
      else this$1.expect(tt.comma);
      if (allowEmpty && this$1.type === tt.comma) {
        elts.push(null);
      } else if (allowTrailingComma && this$1.afterTrailingComma(close)) {
        break
      } else if (this$1.type === tt.ellipsis) {
        var rest = this$1.parseRest(allowNonIdent);
        this$1.parseBindingListItem(rest);
        elts.push(rest);
        if (this$1.type === tt.comma) this$1.raise(this$1.start, "Comma is not permitted after the rest element");
        this$1.expect(close);
        break
      } else {
        var elem = this$1.parseMaybeDefault(this$1.start, this$1.startLoc);
        this$1.parseBindingListItem(elem);
        elts.push(elem);
      }
    }
    return elts
  };

  pp$2.parseBindingListItem = function(param) {
    return param
  };

  // Parses assignment pattern around given atom if possible.

  pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
    left = left || this.parseBindingAtom();
    if (this.options.ecmaVersion < 6 || !this.eat(tt.eq)) return left
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssign();
    return this.finishNode(node, "AssignmentPattern")
  };

  // Verify that a node is an lval — something that can be assigned
  // to.

  pp$2.checkLVal = function(expr, isBinding, checkClashes) {
    var this$1 = this;

    switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name))
        this.raiseRecoverable(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      if (checkClashes) {
        if (has(checkClashes, expr.name))
          this.raiseRecoverable(expr.start, "Argument name clash");
        checkClashes[expr.name] = true;
      }
      break

    case "MemberExpression":
      if (isBinding) this.raiseRecoverable(expr.start, (isBinding ? "Binding" : "Assigning to") + " member expression");
      break

    case "ObjectPattern":
      for (var i = 0; i < expr.properties.length; i++)
        this$1.checkLVal(expr.properties[i].value, isBinding, checkClashes);
      break

    case "ArrayPattern":
      for (var i$1 = 0; i$1 < expr.elements.length; i$1++) {
        var elem = expr.elements[i$1];
        if (elem) this$1.checkLVal(elem, isBinding, checkClashes);
      }
      break

    case "AssignmentPattern":
      this.checkLVal(expr.left, isBinding, checkClashes);
      break

    case "RestElement":
      this.checkLVal(expr.argument, isBinding, checkClashes);
      break

    case "ParenthesizedExpression":
      this.checkLVal(expr.expression, isBinding, checkClashes);
      break

    default:
      this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " rvalue");
    }
  };

  var pp$3 = Parser.prototype;

  // Check if property name clashes with already added.
  // Object/class getters and setters are not allowed to clash —
  // either with each other or with an init property — and in
  // strict mode, init properties are also not allowed to be repeated.

  pp$3.checkPropClash = function(prop, propHash) {
    if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
      return
    var key = prop.key;
    var name;
    switch (key.type) {
    case "Identifier": name = key.name; break
    case "Literal": name = String(key.value); break
    default: return
    }
    var kind = prop.kind;
    if (this.options.ecmaVersion >= 6) {
      if (name === "__proto__" && kind === "init") {
        if (propHash.proto) this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        propHash.proto = true;
      }
      return
    }
    name = "$" + name;
    var other = propHash[name];
    if (other) {
      var isGetSet = kind !== "init";
      if ((this.strict || isGetSet) && other[kind] || !(isGetSet ^ other.init))
        this.raiseRecoverable(key.start, "Redefinition of property");
    } else {
      other = propHash[name] = {
        init: false,
        get: false,
        set: false
      };
    }
    other[kind] = true;
  };

  // ### Expression parsing

  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function(s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.

  // Parse a full expression. The optional arguments are used to
  // forbid the `in` operator (in for loops initalization expressions)
  // and provide reference for storing '=' operator inside shorthand
  // property assignment in contexts where both object expression
  // and object pattern might appear (so it's possible to raise
  // delayed syntax error at correct position).

  pp$3.parseExpression = function(noIn, refDestructuringErrors) {
    var this$1 = this;

    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
    if (this.type === tt.comma) {
      var node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this.eat(tt.comma)) node.expressions.push(this$1.parseMaybeAssign(noIn, refDestructuringErrors));
      return this.finishNode(node, "SequenceExpression")
    }
    return expr
  };

  // Parse an assignment expression. This includes applications of
  // operators like `+=`.

  pp$3.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
    if (this.inGenerator && this.isContextual("yield")) return this.parseYield()

    var ownDestructuringErrors = false;
    if (!refDestructuringErrors) {
      refDestructuringErrors = new DestructuringErrors;
      ownDestructuringErrors = true;
    }
    var startPos = this.start, startLoc = this.startLoc;
    if (this.type == tt.parenL || this.type == tt.name)
      this.potentialArrowAt = this.start;
    var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
    if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
    if (this.type.isAssign) {
      this.checkPatternErrors(refDestructuringErrors, true);
      if (!ownDestructuringErrors) DestructuringErrors.call(refDestructuringErrors);
      var node = this.startNodeAt(startPos, startLoc);
      node.operator = this.value;
      node.left = this.type === tt.eq ? this.toAssignable(left) : left;
      refDestructuringErrors.shorthandAssign = 0; // reset because shorthand default was used correctly
      this.checkLVal(left);
      this.next();
      node.right = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "AssignmentExpression")
    } else {
      if (ownDestructuringErrors) this.checkExpressionErrors(refDestructuringErrors, true);
    }
    return left
  };

  // Parse a ternary conditional (`?:`) operator.

  pp$3.parseMaybeConditional = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprOps(noIn, refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) return expr
    if (this.eat(tt.question)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssign();
      this.expect(tt.colon);
      node.alternate = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  };

  // Start the precedence parser.

  pp$3.parseExprOps = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeUnary(refDestructuringErrors, false);
    if (this.checkExpressionErrors(refDestructuringErrors)) return expr
    return this.parseExprOp(expr, startPos, startLoc, -1, noIn)
  };

  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.

  pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
    var prec = this.type.binop;
    if (prec != null && (!noIn || this.type !== tt._in)) {
      if (prec > minPrec) {
        var logical = this.type === tt.logicalOR || this.type === tt.logicalAND;
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc;
        var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
        var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical);
        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn)
      }
    }
    return left
  };

  pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.operator = op;
    node.right = right;
    return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
  };

  // Parse unary operators, both prefix and postfix.

  pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
    var this$1 = this;

    var startPos = this.start, startLoc = this.startLoc, expr;
    if (this.type.prefix) {
      var node = this.startNode(), update = this.type === tt.incDec;
      node.operator = this.value;
      node.prefix = true;
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refDestructuringErrors, true);
      if (update) this.checkLVal(node.argument);
      else if (this.strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
      else sawUnary = true;
      expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    } else {
      expr = this.parseExprSubscripts(refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) return expr
      while (this.type.postfix && !this.canInsertSemicolon()) {
        var node$1 = this$1.startNodeAt(startPos, startLoc);
        node$1.operator = this$1.value;
        node$1.prefix = false;
        node$1.argument = expr;
        this$1.checkLVal(expr);
        this$1.next();
        expr = this$1.finishNode(node$1, "UpdateExpression");
      }
    }

    if (!sawUnary && this.eat(tt.starstar))
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false)
    else
      return expr
  };

  // Parse call, dot, and `[]`-subscript expressions.

  pp$3.parseExprSubscripts = function(refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprAtom(refDestructuringErrors);
    var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
    if (this.checkExpressionErrors(refDestructuringErrors) || skipArrowSubscripts) return expr
    return this.parseSubscripts(expr, startPos, startLoc)
  };

  pp$3.parseSubscripts = function(base, startPos, startLoc, noCalls) {
    var this$1 = this;

    for (;;) {
      if (this$1.eat(tt.dot)) {
        var node = this$1.startNodeAt(startPos, startLoc);
        node.object = base;
        node.property = this$1.parseIdent(true);
        node.computed = false;
        base = this$1.finishNode(node, "MemberExpression");
      } else if (this$1.eat(tt.bracketL)) {
        var node$1 = this$1.startNodeAt(startPos, startLoc);
        node$1.object = base;
        node$1.property = this$1.parseExpression();
        node$1.computed = true;
        this$1.expect(tt.bracketR);
        base = this$1.finishNode(node$1, "MemberExpression");
      } else if (!noCalls && this$1.eat(tt.parenL)) {
        var node$2 = this$1.startNodeAt(startPos, startLoc);
        node$2.callee = base;
        node$2.arguments = this$1.parseExprList(tt.parenR, false);
        base = this$1.finishNode(node$2, "CallExpression");
      } else if (this$1.type === tt.backQuote) {
        var node$3 = this$1.startNodeAt(startPos, startLoc);
        node$3.tag = base;
        node$3.quasi = this$1.parseTemplate();
        base = this$1.finishNode(node$3, "TaggedTemplateExpression");
      } else {
        return base
      }
    }
  };

  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.

  pp$3.parseExprAtom = function(refDestructuringErrors) {
    var node, canBeArrow = this.potentialArrowAt == this.start;
    switch (this.type) {
    case tt._super:
      if (!this.inFunction)
        this.raise(this.start, "'super' outside of function or class");

    case tt._this:
      var type = this.type === tt._this ? "ThisExpression" : "Super";
      node = this.startNode();
      this.next();
      return this.finishNode(node, type)

    case tt.name:
      var startPos = this.start, startLoc = this.startLoc;
      var id = this.parseIdent(this.type !== tt.name);
      if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.arrow))
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id])
      return id

    case tt.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {pattern: value.pattern, flags: value.flags};
      return node

    case tt.num: case tt.string:
      return this.parseLiteral(this.value)

    case tt._null: case tt._true: case tt._false:
      node = this.startNode();
      node.value = this.type === tt._null ? null : this.type === tt._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal")

    case tt.parenL:
      return this.parseParenAndDistinguishExpression(canBeArrow)

    case tt.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(tt.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression")

    case tt.braceL:
      return this.parseObj(false, refDestructuringErrors)

    case tt._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, false)

    case tt._class:
      return this.parseClass(this.startNode(), false)

    case tt._new:
      return this.parseNew()

    case tt.backQuote:
      return this.parseTemplate()

    default:
      this.unexpected();
    }
  };

  pp$3.parseLiteral = function(value) {
    var node = this.startNode();
    node.value = value;
    node.raw = this.input.slice(this.start, this.end);
    this.next();
    return this.finishNode(node, "Literal")
  };

  pp$3.parseParenExpression = function() {
    this.expect(tt.parenL);
    var val = this.parseExpression();
    this.expect(tt.parenR);
    return val
  };

  pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
    var this$1 = this;

    var startPos = this.start, startLoc = this.startLoc, val;
    if (this.options.ecmaVersion >= 6) {
      this.next();

      var innerStartPos = this.start, innerStartLoc = this.startLoc;
      var exprList = [], first = true;
      var refDestructuringErrors = new DestructuringErrors, spreadStart, innerParenStart;
      while (this.type !== tt.parenR) {
        first ? first = false : this$1.expect(tt.comma);
        if (this$1.type === tt.ellipsis) {
          spreadStart = this$1.start;
          exprList.push(this$1.parseParenItem(this$1.parseRest()));
          break
        } else {
          if (this$1.type === tt.parenL && !innerParenStart) {
            innerParenStart = this$1.start;
          }
          exprList.push(this$1.parseMaybeAssign(false, refDestructuringErrors, this$1.parseParenItem));
        }
      }
      var innerEndPos = this.start, innerEndLoc = this.startLoc;
      this.expect(tt.parenR);

      if (canBeArrow && !this.canInsertSemicolon() && this.eat(tt.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, true);
        if (innerParenStart) this.unexpected(innerParenStart);
        return this.parseParenArrowList(startPos, startLoc, exprList)
      }

      if (!exprList.length) this.unexpected(this.lastTokStart);
      if (spreadStart) this.unexpected(spreadStart);
      this.checkExpressionErrors(refDestructuringErrors, true);

      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }
    } else {
      val = this.parseParenExpression();
    }

    if (this.options.preserveParens) {
      var par = this.startNodeAt(startPos, startLoc);
      par.expression = val;
      return this.finishNode(par, "ParenthesizedExpression")
    } else {
      return val
    }
  };

  pp$3.parseParenItem = function(item) {
    return item
  };

  pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList)
  };

  // New's precedence is slightly tricky. It must allow its argument to
  // be a `[]` or dot subscript expression, but not a call — at least,
  // not without wrapping it in parentheses. Thus, it uses the noCalls
  // argument to parseSubscripts to prevent it from consuming the
  // argument list.

  var empty$1 = [];

  pp$3.parseNew = function() {
    var node = this.startNode();
    var meta = this.parseIdent(true);
    if (this.options.ecmaVersion >= 6 && this.eat(tt.dot)) {
      node.meta = meta;
      node.property = this.parseIdent(true);
      if (node.property.name !== "target")
        this.raiseRecoverable(node.property.start, "The only valid meta property for new is new.target");
      if (!this.inFunction)
        this.raiseRecoverable(node.start, "new.target can only be used in functions");
      return this.finishNode(node, "MetaProperty")
    }
    var startPos = this.start, startLoc = this.startLoc;
    node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
    if (this.eat(tt.parenL)) node.arguments = this.parseExprList(tt.parenR, false);
    else node.arguments = empty$1;
    return this.finishNode(node, "NewExpression")
  };

  // Parse template expression.

  pp$3.parseTemplateElement = function() {
    var elem = this.startNode();
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, '\n'),
      cooked: this.value
    };
    this.next();
    elem.tail = this.type === tt.backQuote;
    return this.finishNode(elem, "TemplateElement")
  };

  pp$3.parseTemplate = function() {
    var this$1 = this;

    var node = this.startNode();
    this.next();
    node.expressions = [];
    var curElt = this.parseTemplateElement();
    node.quasis = [curElt];
    while (!curElt.tail) {
      this$1.expect(tt.dollarBraceL);
      node.expressions.push(this$1.parseExpression());
      this$1.expect(tt.braceR);
      node.quasis.push(curElt = this$1.parseTemplateElement());
    }
    this.next();
    return this.finishNode(node, "TemplateLiteral")
  };

  // Parse an object literal or binding pattern.

  pp$3.parseObj = function(isPattern, refDestructuringErrors) {
    var this$1 = this;

    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this.eat(tt.braceR)) {
      if (!first) {
        this$1.expect(tt.comma);
        if (this$1.afterTrailingComma(tt.braceR)) break
      } else first = false;

      var prop = this$1.startNode(), isGenerator, startPos, startLoc;
      if (this$1.options.ecmaVersion >= 6) {
        prop.method = false;
        prop.shorthand = false;
        if (isPattern || refDestructuringErrors) {
          startPos = this$1.start;
          startLoc = this$1.startLoc;
        }
        if (!isPattern)
          isGenerator = this$1.eat(tt.star);
      }
      this$1.parsePropertyName(prop);
      this$1.parsePropertyValue(prop, isPattern, isGenerator, startPos, startLoc, refDestructuringErrors);
      this$1.checkPropClash(prop, propHash);
      node.properties.push(this$1.finishNode(prop, "Property"));
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  };

  pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, startPos, startLoc, refDestructuringErrors) {
    if (this.eat(tt.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
      prop.kind = "init";
    } else if (this.options.ecmaVersion >= 6 && this.type === tt.parenL) {
      if (isPattern) this.unexpected();
      prop.kind = "init";
      prop.method = true;
      prop.value = this.parseMethod(isGenerator);
    } else if (this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
               (prop.key.name === "get" || prop.key.name === "set") &&
               (this.type != tt.comma && this.type != tt.braceR)) {
      if (isGenerator || isPattern) this.unexpected();
      prop.kind = prop.key.name;
      this.parsePropertyName(prop);
      prop.value = this.parseMethod(false);
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        if (prop.kind === "get")
          this.raiseRecoverable(start, "getter should have no params");
        else
          this.raiseRecoverable(start, "setter should have exactly one param");
      }
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
        this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
      if (this.keywords.test(prop.key.name) ||
          (this.strict ? this.reservedWordsStrictBind : this.reservedWords).test(prop.key.name) ||
          (this.inGenerator && prop.key.name == "yield"))
        this.raiseRecoverable(prop.key.start, "'" + prop.key.name + "' can not be used as shorthand property");
      prop.kind = "init";
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else if (this.type === tt.eq && refDestructuringErrors) {
        if (!refDestructuringErrors.shorthandAssign)
          refDestructuringErrors.shorthandAssign = this.start;
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else {
        prop.value = prop.key;
      }
      prop.shorthand = true;
    } else this.unexpected();
  };

  pp$3.parsePropertyName = function(prop) {
    if (this.options.ecmaVersion >= 6) {
      if (this.eat(tt.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssign();
        this.expect(tt.bracketR);
        return prop.key
      } else {
        prop.computed = false;
      }
    }
    return prop.key = this.type === tt.num || this.type === tt.string ? this.parseExprAtom() : this.parseIdent(true)
  };

  // Initialize empty function node.

  pp$3.initFunction = function(node) {
    node.id = null;
    if (this.options.ecmaVersion >= 6) {
      node.generator = false;
      node.expression = false;
    }
  };

  // Parse object or class method.

  pp$3.parseMethod = function(isGenerator) {
    var node = this.startNode(), oldInGen = this.inGenerator;
    this.inGenerator = isGenerator;
    this.initFunction(node);
    this.expect(tt.parenL);
    node.params = this.parseBindingList(tt.parenR, false, false);
    if (this.options.ecmaVersion >= 6)
      node.generator = isGenerator;
    this.parseFunctionBody(node, false);
    this.inGenerator = oldInGen;
    return this.finishNode(node, "FunctionExpression")
  };

  // Parse arrow function expression with given parameters.

  pp$3.parseArrowExpression = function(node, params) {
    var oldInGen = this.inGenerator;
    this.inGenerator = false;
    this.initFunction(node);
    node.params = this.toAssignableList(params, true);
    this.parseFunctionBody(node, true);
    this.inGenerator = oldInGen;
    return this.finishNode(node, "ArrowFunctionExpression")
  };

  // Parse function body and check parameters.

  pp$3.parseFunctionBody = function(node, isArrowFunction) {
    var isExpression = isArrowFunction && this.type !== tt.braceL;

    if (isExpression) {
      node.body = this.parseMaybeAssign();
      node.expression = true;
    } else {
      // Start a new scope with regard to labels and the `inFunction`
      // flag (restore them to their old value afterwards).
      var oldInFunc = this.inFunction, oldLabels = this.labels;
      this.inFunction = true; this.labels = [];
      node.body = this.parseBlock(true);
      node.expression = false;
      this.inFunction = oldInFunc; this.labels = oldLabels;
    }

    // If this is a strict mode function, verify that argument names
    // are not repeated, and it does not try to bind the words `eval`
    // or `arguments`.
    var useStrict = (!isExpression && node.body.body.length && this.isUseStrict(node.body.body[0])) ? node.body.body[0] : null;
    if (this.strict || useStrict) {
      var oldStrict = this.strict;
      this.strict = true;
      if (node.id)
        this.checkLVal(node.id, true);
      this.checkParams(node, useStrict);
      this.strict = oldStrict;
    } else if (isArrowFunction) {
      this.checkParams(node, useStrict);
    }
  };

  // Checks function params for various disallowed patterns such as using "eval"
  // or "arguments" and duplicate parameters.

  pp$3.checkParams = function(node, useStrict) {
      var this$1 = this;

      var nameHash = {};
      for (var i = 0; i < node.params.length; i++) {
        if (useStrict && this$1.options.ecmaVersion >= 7 && node.params[i].type !== "Identifier")
          this$1.raiseRecoverable(useStrict.start, "Illegal 'use strict' directive in function with non-simple parameter list");
        this$1.checkLVal(node.params[i], true, nameHash);
      }
  };

  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).

  pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
    var this$1 = this;

    var elts = [], first = true;
    while (!this.eat(close)) {
      if (!first) {
        this$1.expect(tt.comma);
        if (allowTrailingComma && this$1.afterTrailingComma(close)) break
      } else first = false;

      var elt;
      if (allowEmpty && this$1.type === tt.comma)
        elt = null;
      else if (this$1.type === tt.ellipsis) {
        elt = this$1.parseSpread(refDestructuringErrors);
        if (this$1.type === tt.comma && refDestructuringErrors && !refDestructuringErrors.trailingComma) {
          refDestructuringErrors.trailingComma = this$1.lastTokStart;
        }
      } else
        elt = this$1.parseMaybeAssign(false, refDestructuringErrors);
      elts.push(elt);
    }
    return elts
  };

  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.

  pp$3.parseIdent = function(liberal) {
    var node = this.startNode();
    if (liberal && this.options.allowReserved == "never") liberal = false;
    if (this.type === tt.name) {
      if (!liberal && (this.strict ? this.reservedWordsStrict : this.reservedWords).test(this.value) &&
          (this.options.ecmaVersion >= 6 ||
           this.input.slice(this.start, this.end).indexOf("\\") == -1))
        this.raiseRecoverable(this.start, "The keyword '" + this.value + "' is reserved");
      if (!liberal && this.inGenerator && this.value === "yield")
        this.raiseRecoverable(this.start, "Can not use 'yield' as identifier inside a generator");
      node.name = this.value;
    } else if (liberal && this.type.keyword) {
      node.name = this.type.keyword;
    } else {
      this.unexpected();
    }
    this.next();
    return this.finishNode(node, "Identifier")
  };

  // Parses yield expression inside generator.

  pp$3.parseYield = function() {
    var node = this.startNode();
    this.next();
    if (this.type == tt.semi || this.canInsertSemicolon() || (this.type != tt.star && !this.type.startsExpr)) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(tt.star);
      node.argument = this.parseMaybeAssign();
    }
    return this.finishNode(node, "YieldExpression")
  };

  var pp$4 = Parser.prototype;

  // This function is used to raise exceptions on parse errors. It
  // takes an offset integer (into the current `input`) to indicate
  // the location of the error, attaches the position to the end
  // of the error message, and then raises a `SyntaxError` with that
  // message.

  pp$4.raise = function(pos, message) {
    var loc = getLineInfo(this.input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    throw err
  };

  pp$4.raiseRecoverable = pp$4.raise;

  pp$4.curPosition = function() {
    if (this.options.locations) {
      return new Position(this.curLine, this.pos - this.lineStart)
    }
  };

  var Node = function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    if (parser.options.locations)
      this.loc = new SourceLocation(parser, loc);
    if (parser.options.directSourceFile)
      this.sourceFile = parser.options.directSourceFile;
    if (parser.options.ranges)
      this.range = [pos, 0];
  };

  // Start an AST node, attaching a start offset.

  var pp$5 = Parser.prototype;

  pp$5.startNode = function() {
    return new Node(this, this.start, this.startLoc)
  };

  pp$5.startNodeAt = function(pos, loc) {
    return new Node(this, pos, loc)
  };

  // Finish an AST node, adding `type` and `end` properties.

  function finishNodeAt(node, type, pos, loc) {
    node.type = type;
    node.end = pos;
    if (this.options.locations)
      node.loc.end = loc;
    if (this.options.ranges)
      node.range[1] = pos;
    return node
  }

  pp$5.finishNode = function(node, type) {
    return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
  };

  // Finish node at given position

  pp$5.finishNodeAt = function(node, type, pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
  };

  var TokContext = function TokContext(token, isExpr, preserveSpace, override) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
    this.override = override;
  };

  var types = {
    b_stat: new TokContext("{", false),
    b_expr: new TokContext("{", true),
    b_tmpl: new TokContext("${", true),
    p_stat: new TokContext("(", false),
    p_expr: new TokContext("(", true),
    q_tmpl: new TokContext("`", true, true, function (p) { return p.readTmplToken(); }),
    f_expr: new TokContext("function", true)
  };

  var pp$6 = Parser.prototype;

  pp$6.initialContext = function() {
    return [types.b_stat]
  };

  pp$6.braceIsBlock = function(prevType) {
    if (prevType === tt.colon) {
      var parent = this.curContext();
      if (parent === types.b_stat || parent === types.b_expr)
        return !parent.isExpr
    }
    if (prevType === tt._return)
      return lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
    if (prevType === tt._else || prevType === tt.semi || prevType === tt.eof || prevType === tt.parenR)
      return true
    if (prevType == tt.braceL)
      return this.curContext() === types.b_stat
    return !this.exprAllowed
  };

  pp$6.updateContext = function(prevType) {
    var update, type = this.type;
    if (type.keyword && prevType == tt.dot)
      this.exprAllowed = false;
    else if (update = type.updateContext)
      update.call(this, prevType);
    else
      this.exprAllowed = type.beforeExpr;
  };

  // Token-specific context update code

  tt.parenR.updateContext = tt.braceR.updateContext = function() {
    if (this.context.length == 1) {
      this.exprAllowed = true;
      return
    }
    var out = this.context.pop();
    if (out === types.b_stat && this.curContext() === types.f_expr) {
      this.context.pop();
      this.exprAllowed = false;
    } else if (out === types.b_tmpl) {
      this.exprAllowed = true;
    } else {
      this.exprAllowed = !out.isExpr;
    }
  };

  tt.braceL.updateContext = function(prevType) {
    this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
    this.exprAllowed = true;
  };

  tt.dollarBraceL.updateContext = function() {
    this.context.push(types.b_tmpl);
    this.exprAllowed = true;
  };

  tt.parenL.updateContext = function(prevType) {
    var statementParens = prevType === tt._if || prevType === tt._for || prevType === tt._with || prevType === tt._while;
    this.context.push(statementParens ? types.p_stat : types.p_expr);
    this.exprAllowed = true;
  };

  tt.incDec.updateContext = function() {
    // tokExprAllowed stays unchanged
  };

  tt._function.updateContext = function(prevType) {
    if (prevType.beforeExpr && prevType !== tt.semi && prevType !== tt._else &&
        !((prevType === tt.colon || prevType === tt.braceL) && this.curContext() === types.b_stat))
      this.context.push(types.f_expr);
    this.exprAllowed = false;
  };

  tt.backQuote.updateContext = function() {
    if (this.curContext() === types.q_tmpl)
      this.context.pop();
    else
      this.context.push(types.q_tmpl);
    this.exprAllowed = false;
  };

  // Object type used to represent tokens. Note that normally, tokens
  // simply exist as properties on the parser object. This is only
  // used for the onToken callback and the external tokenizer.

  var Token = function Token(p) {
    this.type = p.type;
    this.value = p.value;
    this.start = p.start;
    this.end = p.end;
    if (p.options.locations)
      this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
    if (p.options.ranges)
      this.range = [p.start, p.end];
  };

  // ## Tokenizer

  var pp$7 = Parser.prototype;

  // Are we running under Rhino?
  var isRhino = typeof Packages == "object" && Object.prototype.toString.call(Packages) == "[object JavaPackage]";

  // Move to the next token

  pp$7.next = function() {
    if (this.options.onToken)
      this.options.onToken(new Token(this));

    this.lastTokEnd = this.end;
    this.lastTokStart = this.start;
    this.lastTokEndLoc = this.endLoc;
    this.lastTokStartLoc = this.startLoc;
    this.nextToken();
  };

  pp$7.getToken = function() {
    this.next();
    return new Token(this)
  };

  // If we're in an ES6 environment, make parsers iterable
  if (typeof Symbol !== "undefined")
    pp$7[Symbol.iterator] = function () {
      var self = this;
      return {next: function () {
        var token = self.getToken();
        return {
          done: token.type === tt.eof,
          value: token
        }
      }}
    };

  // Toggle strict mode. Re-reads the next number or string to please
  // pedantic tests (`"use strict"; 010;` should fail).

  pp$7.setStrict = function(strict) {
    var this$1 = this;

    this.strict = strict;
    if (this.type !== tt.num && this.type !== tt.string) return
    this.pos = this.start;
    if (this.options.locations) {
      while (this.pos < this.lineStart) {
        this$1.lineStart = this$1.input.lastIndexOf("\n", this$1.lineStart - 2) + 1;
        --this$1.curLine;
      }
    }
    this.nextToken();
  };

  pp$7.curContext = function() {
    return this.context[this.context.length - 1]
  };

  // Read a single token, updating the parser object's token-related
  // properties.

  pp$7.nextToken = function() {
    var curContext = this.curContext();
    if (!curContext || !curContext.preserveSpace) this.skipSpace();

    this.start = this.pos;
    if (this.options.locations) this.startLoc = this.curPosition();
    if (this.pos >= this.input.length) return this.finishToken(tt.eof)

    if (curContext.override) return curContext.override(this)
    else this.readToken(this.fullCharCodeAtPos());
  };

  pp$7.readToken = function(code) {
    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
      return this.readWord()

    return this.getTokenFromCode(code)
  };

  pp$7.fullCharCodeAtPos = function() {
    var code = this.input.charCodeAt(this.pos);
    if (code <= 0xd7ff || code >= 0xe000) return code
    var next = this.input.charCodeAt(this.pos + 1);
    return (code << 10) + next - 0x35fdc00
  };

  pp$7.skipBlockComment = function() {
    var this$1 = this;

    var startLoc = this.options.onComment && this.curPosition();
    var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
    if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
    this.pos = end + 2;
    if (this.options.locations) {
      lineBreakG.lastIndex = start;
      var match;
      while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
        ++this$1.curLine;
        this$1.lineStart = match.index + match[0].length;
      }
    }
    if (this.options.onComment)
      this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition());
  };

  pp$7.skipLineComment = function(startSkip) {
    var this$1 = this;

    var start = this.pos;
    var startLoc = this.options.onComment && this.curPosition();
    var ch = this.input.charCodeAt(this.pos+=startSkip);
    while (this.pos < this.input.length && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
      ++this$1.pos;
      ch = this$1.input.charCodeAt(this$1.pos);
    }
    if (this.options.onComment)
      this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                             startLoc, this.curPosition());
  };

  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.

  pp$7.skipSpace = function() {
    var this$1 = this;

    loop: while (this.pos < this.input.length) {
      var ch = this$1.input.charCodeAt(this$1.pos);
      switch (ch) {
        case 32: case 160: // ' '
          ++this$1.pos;
          break
        case 13:
          if (this$1.input.charCodeAt(this$1.pos + 1) === 10) {
            ++this$1.pos;
          }
        case 10: case 8232: case 8233:
          ++this$1.pos;
          if (this$1.options.locations) {
            ++this$1.curLine;
            this$1.lineStart = this$1.pos;
          }
          break
        case 47: // '/'
          switch (this$1.input.charCodeAt(this$1.pos + 1)) {
            case 42: // '*'
              this$1.skipBlockComment();
              break
            case 47:
              this$1.skipLineComment(2);
              break
            default:
              break loop
          }
          break
        default:
          if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
            ++this$1.pos;
          } else {
            break loop
          }
      }
    }
  };

  // Called at the end of every token. Sets `end`, `val`, and
  // maintains `context` and `exprAllowed`, and skips the space after
  // the token, so that the next one's `start` will point at the
  // right position.

  pp$7.finishToken = function(type, val) {
    this.end = this.pos;
    if (this.options.locations) this.endLoc = this.curPosition();
    var prevType = this.type;
    this.type = type;
    this.value = val;

    this.updateContext(prevType);
  };

  // ### Token reading

  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.
  //
  pp$7.readToken_dot = function() {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) return this.readNumber(true)
    var next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
      this.pos += 3;
      return this.finishToken(tt.ellipsis)
    } else {
      ++this.pos;
      return this.finishToken(tt.dot)
    }
  };

  pp$7.readToken_slash = function() { // '/'
    var next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) {++this.pos; return this.readRegexp()}
    if (next === 61) return this.finishOp(tt.assign, 2)
    return this.finishOp(tt.slash, 1)
  };

  pp$7.readToken_mult_modulo_exp = function(code) { // '%*'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    var tokentype = code === 42 ? tt.star : tt.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && next === 42) {
      ++size;
      tokentype = tt.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 61) return this.finishOp(tt.assign, size + 1)
    return this.finishOp(tokentype, size)
  };

  pp$7.readToken_pipe_amp = function(code) { // '|&'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) return this.finishOp(code === 124 ? tt.logicalOR : tt.logicalAND, 2)
    if (next === 61) return this.finishOp(tt.assign, 2)
    return this.finishOp(code === 124 ? tt.bitwiseOR : tt.bitwiseAND, 1)
  };

  pp$7.readToken_caret = function() { // '^'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) return this.finishOp(tt.assign, 2)
    return this.finishOp(tt.bitwiseXOR, 1)
  };

  pp$7.readToken_plus_min = function(code) { // '+-'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next == 45 && this.input.charCodeAt(this.pos + 2) == 62 &&
          lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) {
        // A `-->` line comment
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken()
      }
      return this.finishOp(tt.incDec, 2)
    }
    if (next === 61) return this.finishOp(tt.assign, 2)
    return this.finishOp(tt.plusMin, 1)
  };

  pp$7.readToken_lt_gt = function(code) { // '<>'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(tt.assign, size + 1)
      return this.finishOp(tt.bitShift, size)
    }
    if (next == 33 && code == 60 && this.input.charCodeAt(this.pos + 2) == 45 &&
        this.input.charCodeAt(this.pos + 3) == 45) {
      if (this.inModule) this.unexpected();
      // `<!--`, an XML-style comment that should be interpreted as a line comment
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken()
    }
    if (next === 61) size = 2;
    return this.finishOp(tt.relational, size)
  };

  pp$7.readToken_eq_excl = function(code) { // '=!'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) return this.finishOp(tt.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2)
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(tt.arrow)
    }
    return this.finishOp(code === 61 ? tt.eq : tt.prefix, 1)
  };

  pp$7.getTokenFromCode = function(code) {
    switch (code) {
      // The interpretation of a dot depends on whether it is followed
      // by a digit or another two dots.
    case 46: // '.'
      return this.readToken_dot()

      // Punctuation tokens.
    case 40: ++this.pos; return this.finishToken(tt.parenL)
    case 41: ++this.pos; return this.finishToken(tt.parenR)
    case 59: ++this.pos; return this.finishToken(tt.semi)
    case 44: ++this.pos; return this.finishToken(tt.comma)
    case 91: ++this.pos; return this.finishToken(tt.bracketL)
    case 93: ++this.pos; return this.finishToken(tt.bracketR)
    case 123: ++this.pos; return this.finishToken(tt.braceL)
    case 125: ++this.pos; return this.finishToken(tt.braceR)
    case 58: ++this.pos; return this.finishToken(tt.colon)
    case 63: ++this.pos; return this.finishToken(tt.question)

    case 96: // '`'
      if (this.options.ecmaVersion < 6) break
      ++this.pos;
      return this.finishToken(tt.backQuote)

    case 48: // '0'
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) return this.readRadixNumber(16) // '0x', '0X' - hex number
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) return this.readRadixNumber(8) // '0o', '0O' - octal number
        if (next === 98 || next === 66) return this.readRadixNumber(2) // '0b', '0B' - binary number
      }
      // Anything else beginning with a digit is an integer, octal
      // number, or float.
    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
      return this.readNumber(false)

      // Quotes produce strings.
    case 34: case 39: // '"', "'"
      return this.readString(code)

      // Operators are parsed inline in tiny state machines. '=' (61) is
      // often referred to. `finishOp` simply skips the amount of
      // characters it is given as second argument, and returns a token
      // of the type given by its first argument.

    case 47: // '/'
      return this.readToken_slash()

    case 37: case 42: // '%*'
      return this.readToken_mult_modulo_exp(code)

    case 124: case 38: // '|&'
      return this.readToken_pipe_amp(code)

    case 94: // '^'
      return this.readToken_caret()

    case 43: case 45: // '+-'
      return this.readToken_plus_min(code)

    case 60: case 62: // '<>'
      return this.readToken_lt_gt(code)

    case 61: case 33: // '=!'
      return this.readToken_eq_excl(code)

    case 126: // '~'
      return this.finishOp(tt.prefix, 1)
    }

    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };

  pp$7.finishOp = function(type, size) {
    var str = this.input.slice(this.pos, this.pos + size);
    this.pos += size;
    return this.finishToken(type, str)
  };

  // Parse a regular expression. Some context-awareness is necessary,
  // since a '/' inside a '[]' set does not end the expression.

  function tryCreateRegexp(src, flags, throwErrorAt, parser) {
    try {
      return new RegExp(src, flags)
    } catch (e) {
      if (throwErrorAt !== undefined) {
        if (e instanceof SyntaxError) parser.raise(throwErrorAt, "Error parsing regular expression: " + e.message);
        throw e
      }
    }
  }

  var regexpUnicodeSupport = !!tryCreateRegexp("\uffff", "u");

  pp$7.readRegexp = function() {
    var this$1 = this;

    var escaped, inClass, start = this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) this$1.raise(start, "Unterminated regular expression");
      var ch = this$1.input.charAt(this$1.pos);
      if (lineBreak.test(ch)) this$1.raise(start, "Unterminated regular expression");
      if (!escaped) {
        if (ch === "[") inClass = true;
        else if (ch === "]" && inClass) inClass = false;
        else if (ch === "/" && !inClass) break
        escaped = ch === "\\";
      } else escaped = false;
      ++this$1.pos;
    }
    var content = this.input.slice(start, this.pos);
    ++this.pos;
    // Need to use `readWord1` because '\uXXXX' sequences are allowed
    // here (don't ask).
    var mods = this.readWord1();
    var tmp = content, tmpFlags = "";
    if (mods) {
      var validFlags = /^[gim]*$/;
      if (this.options.ecmaVersion >= 6) validFlags = /^[gimuy]*$/;
      if (!validFlags.test(mods)) this.raise(start, "Invalid regular expression flag");
      if (mods.indexOf("u") >= 0) {
        if (regexpUnicodeSupport) {
          tmpFlags = "u";
        } else {
          // Replace each astral symbol and every Unicode escape sequence that
          // possibly represents an astral symbol or a paired surrogate with a
          // single ASCII symbol to avoid throwing on regular expressions that
          // are only valid in combination with the `/u` flag.
          // Note: replacing with the ASCII symbol `x` might cause false
          // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
          // perfectly valid pattern that is equivalent to `[a-b]`, but it would
          // be replaced by `[x-b]` which throws an error.
          tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}/g, function (_match, code, offset) {
            code = Number("0x" + code);
            if (code > 0x10FFFF) this$1.raise(start + offset + 3, "Code point out of bounds");
            return "x"
          });
          tmp = tmp.replace(/\\u([a-fA-F0-9]{4})|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
          tmpFlags = tmpFlags.replace("u", "");
        }
      }
    }
    // Detect invalid regular expressions.
    var value = null;
    // Rhino's regular expression parser is flaky and throws uncatchable exceptions,
    // so don't do detection if we are running under Rhino
    if (!isRhino) {
      tryCreateRegexp(tmp, tmpFlags, start, this);
      // Get a regular expression object for this pattern-flag pair, or `null` in
      // case the current environment doesn't support the flags it uses.
      value = tryCreateRegexp(content, mods);
    }
    return this.finishToken(tt.regexp, {pattern: content, flags: mods, value: value})
  };

  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.

  pp$7.readInt = function(radix, len) {
    var this$1 = this;

    var start = this.pos, total = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
      var code = this$1.input.charCodeAt(this$1.pos), val;
      if (code >= 97) val = code - 97 + 10; // a
      else if (code >= 65) val = code - 65 + 10; // A
      else if (code >= 48 && code <= 57) val = code - 48; // 0-9
      else val = Infinity;
      if (val >= radix) break
      ++this$1.pos;
      total = total * radix + val;
    }
    if (this.pos === start || len != null && this.pos - start !== len) return null

    return total
  };

  pp$7.readRadixNumber = function(radix) {
    this.pos += 2; // 0x
    var val = this.readInt(radix);
    if (val == null) this.raise(this.start + 2, "Expected number in radix " + radix);
    if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
    return this.finishToken(tt.num, val)
  };

  // Read an integer, octal integer, or floating-point number.

  pp$7.readNumber = function(startsWithDot) {
    var start = this.pos, isFloat = false, octal = this.input.charCodeAt(this.pos) === 48;
    if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number");
    var next = this.input.charCodeAt(this.pos);
    if (next === 46) { // '.'
      ++this.pos;
      this.readInt(10);
      isFloat = true;
      next = this.input.charCodeAt(this.pos);
    }
    if (next === 69 || next === 101) { // 'eE'
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next === 45) ++this.pos; // '+-'
      if (this.readInt(10) === null) this.raise(start, "Invalid number");
      isFloat = true;
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");

    var str = this.input.slice(start, this.pos), val;
    if (isFloat) val = parseFloat(str);
    else if (!octal || str.length === 1) val = parseInt(str, 10);
    else if (/[89]/.test(str) || this.strict) this.raise(start, "Invalid number");
    else val = parseInt(str, 8);
    return this.finishToken(tt.num, val)
  };

  // Read a string value, interpreting backslash-escapes.

  pp$7.readCodePoint = function() {
    var ch = this.input.charCodeAt(this.pos), code;

    if (ch === 123) {
      if (this.options.ecmaVersion < 6) this.unexpected();
      var codePos = ++this.pos;
      code = this.readHexChar(this.input.indexOf('}', this.pos) - this.pos);
      ++this.pos;
      if (code > 0x10FFFF) this.raise(codePos, "Code point out of bounds");
    } else {
      code = this.readHexChar(4);
    }
    return code
  };

  function codePointToString(code) {
    // UTF-16 Decoding
    if (code <= 0xFFFF) return String.fromCharCode(code)
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
  }

  pp$7.readString = function(quote) {
    var this$1 = this;

    var out = "", chunkStart = ++this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) this$1.raise(this$1.start, "Unterminated string constant");
      var ch = this$1.input.charCodeAt(this$1.pos);
      if (ch === quote) break
      if (ch === 92) { // '\'
        out += this$1.input.slice(chunkStart, this$1.pos);
        out += this$1.readEscapedChar(false);
        chunkStart = this$1.pos;
      } else {
        if (isNewLine(ch)) this$1.raise(this$1.start, "Unterminated string constant");
        ++this$1.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(tt.string, out)
  };

  // Reads template string tokens.

  pp$7.readTmplToken = function() {
    var this$1 = this;

    var out = "", chunkStart = this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) this$1.raise(this$1.start, "Unterminated template");
      var ch = this$1.input.charCodeAt(this$1.pos);
      if (ch === 96 || ch === 36 && this$1.input.charCodeAt(this$1.pos + 1) === 123) { // '`', '${'
        if (this$1.pos === this$1.start && this$1.type === tt.template) {
          if (ch === 36) {
            this$1.pos += 2;
            return this$1.finishToken(tt.dollarBraceL)
          } else {
            ++this$1.pos;
            return this$1.finishToken(tt.backQuote)
          }
        }
        out += this$1.input.slice(chunkStart, this$1.pos);
        return this$1.finishToken(tt.template, out)
      }
      if (ch === 92) { // '\'
        out += this$1.input.slice(chunkStart, this$1.pos);
        out += this$1.readEscapedChar(true);
        chunkStart = this$1.pos;
      } else if (isNewLine(ch)) {
        out += this$1.input.slice(chunkStart, this$1.pos);
        ++this$1.pos;
        switch (ch) {
          case 13:
            if (this$1.input.charCodeAt(this$1.pos) === 10) ++this$1.pos;
          case 10:
            out += "\n";
            break
          default:
            out += String.fromCharCode(ch);
            break
        }
        if (this$1.options.locations) {
          ++this$1.curLine;
          this$1.lineStart = this$1.pos;
        }
        chunkStart = this$1.pos;
      } else {
        ++this$1.pos;
      }
    }
  };

  // Used to read escaped characters

  pp$7.readEscapedChar = function(inTemplate) {
    var ch = this.input.charCodeAt(++this.pos);
    ++this.pos;
    switch (ch) {
    case 110: return "\n" // 'n' -> '\n'
    case 114: return "\r" // 'r' -> '\r'
    case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
    case 117: return codePointToString(this.readCodePoint()) // 'u'
    case 116: return "\t" // 't' -> '\t'
    case 98: return "\b" // 'b' -> '\b'
    case 118: return "\u000b" // 'v' -> '\u000b'
    case 102: return "\f" // 'f' -> '\f'
    case 13: if (this.input.charCodeAt(this.pos) === 10) ++this.pos; // '\r\n'
    case 10: // ' \n'
      if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
      return ""
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        if (octalStr !== "0" && (this.strict || inTemplate)) {
          this.raise(this.pos - 2, "Octal literal in strict mode");
        }
        this.pos += octalStr.length - 1;
        return String.fromCharCode(octal)
      }
      return String.fromCharCode(ch)
    }
  };

  // Used to read character escape sequences ('\x', '\u', '\U').

  pp$7.readHexChar = function(len) {
    var codePos = this.pos;
    var n = this.readInt(16, len);
    if (n === null) this.raise(codePos, "Bad character escape sequence");
    return n
  };

  // Read an identifier, and return it as a string. Sets `this.containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Incrementally adds only escaped chars, adding other chunks as-is
  // as a micro-optimization.

  pp$7.readWord1 = function() {
    var this$1 = this;

    this.containsEsc = false;
    var word = "", first = true, chunkStart = this.pos;
    var astral = this.options.ecmaVersion >= 6;
    while (this.pos < this.input.length) {
      var ch = this$1.fullCharCodeAtPos();
      if (isIdentifierChar(ch, astral)) {
        this$1.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) { // "\"
        this$1.containsEsc = true;
        word += this$1.input.slice(chunkStart, this$1.pos);
        var escStart = this$1.pos;
        if (this$1.input.charCodeAt(++this$1.pos) != 117) // "u"
          this$1.raise(this$1.pos, "Expecting Unicode escape sequence \\uXXXX");
        ++this$1.pos;
        var esc = this$1.readCodePoint();
        if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
          this$1.raise(escStart, "Invalid Unicode escape");
        word += codePointToString(esc);
        chunkStart = this$1.pos;
      } else {
        break
      }
      first = false;
    }
    return word + this.input.slice(chunkStart, this.pos)
  };

  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.

  pp$7.readWord = function() {
    var word = this.readWord1();
    var type = tt.name;
    if ((this.options.ecmaVersion >= 6 || !this.containsEsc) && this.keywords.test(word))
      type = keywordTypes[word];
    return this.finishToken(type, word)
  };

  var version = "3.3.0";

  // The main exported interface (under `self.acorn` when in the
  // browser) is a `parse` function that takes a code string and
  // returns an abstract syntax tree as specified by [Mozilla parser
  // API][api].
  //
  // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

  function parse(input, options) {
    return new Parser(options, input).parse()
  }

  // This function tries to parse a single expression at a given
  // offset in a string. Useful for parsing mixed-language formats
  // that embed JavaScript expressions.

  function parseExpressionAt(input, pos, options) {
    var p = new Parser(options, input, pos);
    p.nextToken();
    return p.parseExpression()
  }

  // Acorn is organized as a tokenizer and a recursive-descent parser.
  // The `tokenizer` export provides an interface to the tokenizer.

  function tokenizer(input, options) {
    return new Parser(options, input)
  }

  exports.version = version;
  exports.parse = parse;
  exports.parseExpressionAt = parseExpressionAt;
  exports.tokenizer = tokenizer;
  exports.Parser = Parser;
  exports.plugins = plugins;
  exports.defaultOptions = defaultOptions;
  exports.Position = Position;
  exports.SourceLocation = SourceLocation;
  exports.getLineInfo = getLineInfo;
  exports.Node = Node;
  exports.TokenType = TokenType;
  exports.tokTypes = tt;
  exports.TokContext = TokContext;
  exports.tokContexts = types;
  exports.isIdentifierChar = isIdentifierChar;
  exports.isIdentifierStart = isIdentifierStart;
  exports.Token = Token;
  exports.isNewLine = isNewLine;
  exports.lineBreak = lineBreak;
  exports.lineBreakG = lineBreakG;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
});

var acorn$1 = (acorn && typeof acorn === 'object' && 'default' in acorn ? acorn['default'] : acorn);

var xhtml = __commonjs(function (module) {
module.exports = {
  quot: '\u0022',
  amp: '&',
  apos: '\u0027',
  lt: '<',
  gt: '>',
  nbsp: '\u00A0',
  iexcl: '\u00A1',
  cent: '\u00A2',
  pound: '\u00A3',
  curren: '\u00A4',
  yen: '\u00A5',
  brvbar: '\u00A6',
  sect: '\u00A7',
  uml: '\u00A8',
  copy: '\u00A9',
  ordf: '\u00AA',
  laquo: '\u00AB',
  not: '\u00AC',
  shy: '\u00AD',
  reg: '\u00AE',
  macr: '\u00AF',
  deg: '\u00B0',
  plusmn: '\u00B1',
  sup2: '\u00B2',
  sup3: '\u00B3',
  acute: '\u00B4',
  micro: '\u00B5',
  para: '\u00B6',
  middot: '\u00B7',
  cedil: '\u00B8',
  sup1: '\u00B9',
  ordm: '\u00BA',
  raquo: '\u00BB',
  frac14: '\u00BC',
  frac12: '\u00BD',
  frac34: '\u00BE',
  iquest: '\u00BF',
  Agrave: '\u00C0',
  Aacute: '\u00C1',
  Acirc: '\u00C2',
  Atilde: '\u00C3',
  Auml: '\u00C4',
  Aring: '\u00C5',
  AElig: '\u00C6',
  Ccedil: '\u00C7',
  Egrave: '\u00C8',
  Eacute: '\u00C9',
  Ecirc: '\u00CA',
  Euml: '\u00CB',
  Igrave: '\u00CC',
  Iacute: '\u00CD',
  Icirc: '\u00CE',
  Iuml: '\u00CF',
  ETH: '\u00D0',
  Ntilde: '\u00D1',
  Ograve: '\u00D2',
  Oacute: '\u00D3',
  Ocirc: '\u00D4',
  Otilde: '\u00D5',
  Ouml: '\u00D6',
  times: '\u00D7',
  Oslash: '\u00D8',
  Ugrave: '\u00D9',
  Uacute: '\u00DA',
  Ucirc: '\u00DB',
  Uuml: '\u00DC',
  Yacute: '\u00DD',
  THORN: '\u00DE',
  szlig: '\u00DF',
  agrave: '\u00E0',
  aacute: '\u00E1',
  acirc: '\u00E2',
  atilde: '\u00E3',
  auml: '\u00E4',
  aring: '\u00E5',
  aelig: '\u00E6',
  ccedil: '\u00E7',
  egrave: '\u00E8',
  eacute: '\u00E9',
  ecirc: '\u00EA',
  euml: '\u00EB',
  igrave: '\u00EC',
  iacute: '\u00ED',
  icirc: '\u00EE',
  iuml: '\u00EF',
  eth: '\u00F0',
  ntilde: '\u00F1',
  ograve: '\u00F2',
  oacute: '\u00F3',
  ocirc: '\u00F4',
  otilde: '\u00F5',
  ouml: '\u00F6',
  divide: '\u00F7',
  oslash: '\u00F8',
  ugrave: '\u00F9',
  uacute: '\u00FA',
  ucirc: '\u00FB',
  uuml: '\u00FC',
  yacute: '\u00FD',
  thorn: '\u00FE',
  yuml: '\u00FF',
  OElig: '\u0152',
  oelig: '\u0153',
  Scaron: '\u0160',
  scaron: '\u0161',
  Yuml: '\u0178',
  fnof: '\u0192',
  circ: '\u02C6',
  tilde: '\u02DC',
  Alpha: '\u0391',
  Beta: '\u0392',
  Gamma: '\u0393',
  Delta: '\u0394',
  Epsilon: '\u0395',
  Zeta: '\u0396',
  Eta: '\u0397',
  Theta: '\u0398',
  Iota: '\u0399',
  Kappa: '\u039A',
  Lambda: '\u039B',
  Mu: '\u039C',
  Nu: '\u039D',
  Xi: '\u039E',
  Omicron: '\u039F',
  Pi: '\u03A0',
  Rho: '\u03A1',
  Sigma: '\u03A3',
  Tau: '\u03A4',
  Upsilon: '\u03A5',
  Phi: '\u03A6',
  Chi: '\u03A7',
  Psi: '\u03A8',
  Omega: '\u03A9',
  alpha: '\u03B1',
  beta: '\u03B2',
  gamma: '\u03B3',
  delta: '\u03B4',
  epsilon: '\u03B5',
  zeta: '\u03B6',
  eta: '\u03B7',
  theta: '\u03B8',
  iota: '\u03B9',
  kappa: '\u03BA',
  lambda: '\u03BB',
  mu: '\u03BC',
  nu: '\u03BD',
  xi: '\u03BE',
  omicron: '\u03BF',
  pi: '\u03C0',
  rho: '\u03C1',
  sigmaf: '\u03C2',
  sigma: '\u03C3',
  tau: '\u03C4',
  upsilon: '\u03C5',
  phi: '\u03C6',
  chi: '\u03C7',
  psi: '\u03C8',
  omega: '\u03C9',
  thetasym: '\u03D1',
  upsih: '\u03D2',
  piv: '\u03D6',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwnj: '\u200C',
  zwj: '\u200D',
  lrm: '\u200E',
  rlm: '\u200F',
  ndash: '\u2013',
  mdash: '\u2014',
  lsquo: '\u2018',
  rsquo: '\u2019',
  sbquo: '\u201A',
  ldquo: '\u201C',
  rdquo: '\u201D',
  bdquo: '\u201E',
  dagger: '\u2020',
  Dagger: '\u2021',
  bull: '\u2022',
  hellip: '\u2026',
  permil: '\u2030',
  prime: '\u2032',
  Prime: '\u2033',
  lsaquo: '\u2039',
  rsaquo: '\u203A',
  oline: '\u203E',
  frasl: '\u2044',
  euro: '\u20AC',
  image: '\u2111',
  weierp: '\u2118',
  real: '\u211C',
  trade: '\u2122',
  alefsym: '\u2135',
  larr: '\u2190',
  uarr: '\u2191',
  rarr: '\u2192',
  darr: '\u2193',
  harr: '\u2194',
  crarr: '\u21B5',
  lArr: '\u21D0',
  uArr: '\u21D1',
  rArr: '\u21D2',
  dArr: '\u21D3',
  hArr: '\u21D4',
  forall: '\u2200',
  part: '\u2202',
  exist: '\u2203',
  empty: '\u2205',
  nabla: '\u2207',
  isin: '\u2208',
  notin: '\u2209',
  ni: '\u220B',
  prod: '\u220F',
  sum: '\u2211',
  minus: '\u2212',
  lowast: '\u2217',
  radic: '\u221A',
  prop: '\u221D',
  infin: '\u221E',
  ang: '\u2220',
  and: '\u2227',
  or: '\u2228',
  cap: '\u2229',
  cup: '\u222A',
  'int': '\u222B',
  there4: '\u2234',
  sim: '\u223C',
  cong: '\u2245',
  asymp: '\u2248',
  ne: '\u2260',
  equiv: '\u2261',
  le: '\u2264',
  ge: '\u2265',
  sub: '\u2282',
  sup: '\u2283',
  nsub: '\u2284',
  sube: '\u2286',
  supe: '\u2287',
  oplus: '\u2295',
  otimes: '\u2297',
  perp: '\u22A5',
  sdot: '\u22C5',
  lceil: '\u2308',
  rceil: '\u2309',
  lfloor: '\u230A',
  rfloor: '\u230B',
  lang: '\u2329',
  rang: '\u232A',
  loz: '\u25CA',
  spades: '\u2660',
  clubs: '\u2663',
  hearts: '\u2665',
  diams: '\u2666'
};
});

var require$$0 = (xhtml && typeof xhtml === 'object' && 'default' in xhtml ? xhtml['default'] : xhtml);

var inject = __commonjs(function (module) {
'use strict';

var XHTMLEntities = require$$0;

var hexNumber = /^[\da-fA-F]+$/;
var decimalNumber = /^\d+$/;

module.exports = function(acorn) {
  var tt = acorn.tokTypes;
  var tc = acorn.tokContexts;

  tc.j_oTag = new acorn.TokContext('<tag', false);
  tc.j_cTag = new acorn.TokContext('</tag', false);
  tc.j_expr = new acorn.TokContext('<tag>...</tag>', true, true);

  tt.jsxName = new acorn.TokenType('jsxName');
  tt.jsxText = new acorn.TokenType('jsxText', {beforeExpr: true});
  tt.jsxTagStart = new acorn.TokenType('jsxTagStart');
  tt.jsxTagEnd = new acorn.TokenType('jsxTagEnd');

  tt.jsxTagStart.updateContext = function() {
    this.context.push(tc.j_expr); // treat as beginning of JSX expression
    this.context.push(tc.j_oTag); // start opening tag context
    this.exprAllowed = false;
  };
  tt.jsxTagEnd.updateContext = function(prevType) {
    var out = this.context.pop();
    if (out === tc.j_oTag && prevType === tt.slash || out === tc.j_cTag) {
      this.context.pop();
      this.exprAllowed = this.curContext() === tc.j_expr;
    } else {
      this.exprAllowed = true;
    }
  };

  var pp = acorn.Parser.prototype;

  // Reads inline JSX contents token.

  pp.jsx_readToken = function() {
    var out = '', chunkStart = this.pos;
    for (;;) {
      if (this.pos >= this.input.length)
        this.raise(this.start, 'Unterminated JSX contents');
      var ch = this.input.charCodeAt(this.pos);

      switch (ch) {
      case 60: // '<'
      case 123: // '{'
        if (this.pos === this.start) {
          if (ch === 60 && this.exprAllowed) {
            ++this.pos;
            return this.finishToken(tt.jsxTagStart);
          }
          return this.getTokenFromCode(ch);
        }
        out += this.input.slice(chunkStart, this.pos);
        return this.finishToken(tt.jsxText, out);

      case 38: // '&'
        out += this.input.slice(chunkStart, this.pos);
        out += this.jsx_readEntity();
        chunkStart = this.pos;
        break;

      default:
        if (acorn.isNewLine(ch)) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.jsx_readNewLine(true);
          chunkStart = this.pos;
        } else {
          ++this.pos;
        }
      }
    }
  };

  pp.jsx_readNewLine = function(normalizeCRLF) {
    var ch = this.input.charCodeAt(this.pos);
    var out;
    ++this.pos;
    if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
      ++this.pos;
      out = normalizeCRLF ? '\n' : '\r\n';
    } else {
      out = String.fromCharCode(ch);
    }
    if (this.options.locations) {
      ++this.curLine;
      this.lineStart = this.pos;
    }

    return out;
  };

  pp.jsx_readString = function(quote) {
    var out = '', chunkStart = ++this.pos;
    for (;;) {
      if (this.pos >= this.input.length)
        this.raise(this.start, 'Unterminated string constant');
      var ch = this.input.charCodeAt(this.pos);
      if (ch === quote) break;
      if (ch === 38) { // '&'
        out += this.input.slice(chunkStart, this.pos);
        out += this.jsx_readEntity();
        chunkStart = this.pos;
      } else if (acorn.isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.pos);
        out += this.jsx_readNewLine(false);
        chunkStart = this.pos;
      } else {
        ++this.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(tt.string, out);
  };

  pp.jsx_readEntity = function() {
    var str = '', count = 0, entity;
    var ch = this.input[this.pos];
    if (ch !== '&')
      this.raise(this.pos, 'Entity must start with an ampersand');
    var startPos = ++this.pos;
    while (this.pos < this.input.length && count++ < 10) {
      ch = this.input[this.pos++];
      if (ch === ';') {
        if (str[0] === '#') {
          if (str[1] === 'x') {
            str = str.substr(2);
            if (hexNumber.test(str))
              entity = String.fromCharCode(parseInt(str, 16));
          } else {
            str = str.substr(1);
            if (decimalNumber.test(str))
              entity = String.fromCharCode(parseInt(str, 10));
          }
        } else {
          entity = XHTMLEntities[str];
        }
        break;
      }
      str += ch;
    }
    if (!entity) {
      this.pos = startPos;
      return '&';
    }
    return entity;
  };


  // Read a JSX identifier (valid tag or attribute name).
  //
  // Optimized version since JSX identifiers can't contain
  // escape characters and so can be read as single slice.
  // Also assumes that first character was already checked
  // by isIdentifierStart in readToken.

  pp.jsx_readWord = function() {
    var ch, start = this.pos;
    do {
      ch = this.input.charCodeAt(++this.pos);
    } while (acorn.isIdentifierChar(ch) || ch === 45); // '-'
    return this.finishToken(tt.jsxName, this.input.slice(start, this.pos));
  };

  // Transforms JSX element name to string.

  function getQualifiedJSXName(object) {
    if (object.type === 'JSXIdentifier')
      return object.name;

    if (object.type === 'JSXNamespacedName')
      return object.namespace.name + ':' + object.name.name;

    if (object.type === 'JSXMemberExpression')
      return getQualifiedJSXName(object.object) + '.' +
      getQualifiedJSXName(object.property);
  }

  // Parse next token as JSX identifier

  pp.jsx_parseIdentifier = function() {
    var node = this.startNode();
    if (this.type === tt.jsxName)
      node.name = this.value;
    else if (this.type.keyword)
      node.name = this.type.keyword;
    else
      this.unexpected();
    this.next();
    return this.finishNode(node, 'JSXIdentifier');
  };

  // Parse namespaced identifier.

  pp.jsx_parseNamespacedName = function() {
    var startPos = this.start, startLoc = this.startLoc;
    var name = this.jsx_parseIdentifier();
    if (!this.options.plugins.jsx.allowNamespaces || !this.eat(tt.colon)) return name;
    var node = this.startNodeAt(startPos, startLoc);
    node.namespace = name;
    node.name = this.jsx_parseIdentifier();
    return this.finishNode(node, 'JSXNamespacedName');
  };

  // Parses element name in any form - namespaced, member
  // or single identifier.

  pp.jsx_parseElementName = function() {
    var startPos = this.start, startLoc = this.startLoc;
    var node = this.jsx_parseNamespacedName();
    if (this.type === tt.dot && node.type === 'JSXNamespacedName' && !this.options.plugins.jsx.allowNamespacedObjects) {
      this.unexpected();
    }
    while (this.eat(tt.dot)) {
      var newNode = this.startNodeAt(startPos, startLoc);
      newNode.object = node;
      newNode.property = this.jsx_parseIdentifier();
      node = this.finishNode(newNode, 'JSXMemberExpression');
    }
    return node;
  };

  // Parses any type of JSX attribute value.

  pp.jsx_parseAttributeValue = function() {
    switch (this.type) {
    case tt.braceL:
      var node = this.jsx_parseExpressionContainer();
      if (node.expression.type === 'JSXEmptyExpression')
        this.raise(node.start, 'JSX attributes must only be assigned a non-empty expression');
      return node;

    case tt.jsxTagStart:
    case tt.string:
      return this.parseExprAtom();

    default:
      this.raise(this.start, 'JSX value should be either an expression or a quoted JSX text');
    }
  };

  // JSXEmptyExpression is unique type since it doesn't actually parse anything,
  // and so it should start at the end of last read token (left brace) and finish
  // at the beginning of the next one (right brace).

  pp.jsx_parseEmptyExpression = function() {
    var node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
    return this.finishNodeAt(node, 'JSXEmptyExpression', this.start, this.startLoc);
  };

  // Parses JSX expression enclosed into curly brackets.


  pp.jsx_parseExpressionContainer = function() {
    var node = this.startNode();
    this.next();
    node.expression = this.type === tt.braceR
      ? this.jsx_parseEmptyExpression()
      : this.parseExpression();
    this.expect(tt.braceR);
    return this.finishNode(node, 'JSXExpressionContainer');
  };

  // Parses following JSX attribute name-value pair.

  pp.jsx_parseAttribute = function() {
    var node = this.startNode();
    if (this.eat(tt.braceL)) {
      this.expect(tt.ellipsis);
      node.argument = this.parseMaybeAssign();
      this.expect(tt.braceR);
      return this.finishNode(node, 'JSXSpreadAttribute');
    }
    node.name = this.jsx_parseNamespacedName();
    node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
    return this.finishNode(node, 'JSXAttribute');
  };

  // Parses JSX opening tag starting after '<'.

  pp.jsx_parseOpeningElementAt = function(startPos, startLoc) {
    var node = this.startNodeAt(startPos, startLoc);
    node.attributes = [];
    node.name = this.jsx_parseElementName();
    while (this.type !== tt.slash && this.type !== tt.jsxTagEnd)
      node.attributes.push(this.jsx_parseAttribute());
    node.selfClosing = this.eat(tt.slash);
    this.expect(tt.jsxTagEnd);
    return this.finishNode(node, 'JSXOpeningElement');
  };

  // Parses JSX closing tag starting after '</'.

  pp.jsx_parseClosingElementAt = function(startPos, startLoc) {
    var node = this.startNodeAt(startPos, startLoc);
    node.name = this.jsx_parseElementName();
    this.expect(tt.jsxTagEnd);
    return this.finishNode(node, 'JSXClosingElement');
  };

  // Parses entire JSX element, including it's opening tag
  // (starting after '<'), attributes, contents and closing tag.

  pp.jsx_parseElementAt = function(startPos, startLoc) {
    var node = this.startNodeAt(startPos, startLoc);
    var children = [];
    var openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
    var closingElement = null;

    if (!openingElement.selfClosing) {
      contents: for (;;) {
        switch (this.type) {
        case tt.jsxTagStart:
          startPos = this.start; startLoc = this.startLoc;
          this.next();
          if (this.eat(tt.slash)) {
            closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
            break contents;
          }
          children.push(this.jsx_parseElementAt(startPos, startLoc));
          break;

        case tt.jsxText:
          children.push(this.parseExprAtom());
          break;

        case tt.braceL:
          children.push(this.jsx_parseExpressionContainer());
          break;

        default:
          this.unexpected();
        }
      }
      if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
        this.raise(
          closingElement.start,
          'Expected corresponding JSX closing tag for <' + getQualifiedJSXName(openingElement.name) + '>');
      }
    }

    node.openingElement = openingElement;
    node.closingElement = closingElement;
    node.children = children;
    if (this.type === tt.relational && this.value === "<") {
      this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag");
    }
    return this.finishNode(node, 'JSXElement');
  };

  // Parses entire JSX element from current position.

  pp.jsx_parseElement = function() {
    var startPos = this.start, startLoc = this.startLoc;
    this.next();
    return this.jsx_parseElementAt(startPos, startLoc);
  };

  acorn.plugins.jsx = function(instance, opts) {
    if (!opts) {
      return;
    }

    if (typeof opts !== 'object') {
      opts = {};
    }

    instance.options.plugins.jsx = {
      allowNamespaces: opts.allowNamespaces !== false,
      allowNamespacedObjects: !!opts.allowNamespacedObjects
    };

    instance.extend('parseExprAtom', function(inner) {
      return function(refShortHandDefaultPos) {
        if (this.type === tt.jsxText)
          return this.parseLiteral(this.value);
        else if (this.type === tt.jsxTagStart)
          return this.jsx_parseElement();
        else
          return inner.call(this, refShortHandDefaultPos);
      };
    });

    instance.extend('readToken', function(inner) {
      return function(code) {
        var context = this.curContext();

        if (context === tc.j_expr) return this.jsx_readToken();

        if (context === tc.j_oTag || context === tc.j_cTag) {
          if (acorn.isIdentifierStart(code)) return this.jsx_readWord();

          if (code == 62) {
            ++this.pos;
            return this.finishToken(tt.jsxTagEnd);
          }

          if ((code === 34 || code === 39) && context == tc.j_oTag)
            return this.jsx_readString(code);
        }

        if (code === 60 && this.exprAllowed) {
          ++this.pos;
          return this.finishToken(tt.jsxTagStart);
        }
        return inner.call(this, code);
      };
    });

    instance.extend('updateContext', function(inner) {
      return function(prevType) {
        if (this.type == tt.braceL) {
          var curContext = this.curContext();
          if (curContext == tc.j_oTag) this.context.push(tc.b_expr);
          else if (curContext == tc.j_expr) this.context.push(tc.b_tmpl);
          else inner.call(this, prevType);
          this.exprAllowed = true;
        } else if (this.type === tt.slash && prevType === tt.jsxTagStart) {
          this.context.length -= 2; // do not consider JSX expr -> JSX open tag -> ... anymore
          this.context.push(tc.j_cTag); // reconsider as closing tag context
          this.exprAllowed = false;
        } else {
          return inner.call(this, prevType);
        }
      };
    });
  };

  return acorn;
};
});

var acornJsx = (inject && typeof inject === 'object' && 'default' in inject ? inject['default'] : inject);

var inject$1 = __commonjs(function (module) {
'use strict';

module.exports = function(acorn) {
  var tt = acorn.tokTypes;
  var pp = acorn.Parser.prototype;

  // this is the same parseObj that acorn has with...
  function parseObj(isPattern, refDestructuringErrors) {
    var this$1 = this;

    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this$1.eat(tt.braceR)) {
      if (!first) {
        this$1.expect(tt.comma);
        if (this$1.afterTrailingComma(tt.braceR)) break
      } else first = false;

      var prop = this$1.startNode(), isGenerator, startPos, startLoc;
      if (this$1.options.ecmaVersion >= 6) {
        // ...the spread logic borrowed from babylon :)
        if (this$1.type === tt.ellipsis) {
          prop = this$1.parseSpread();
          prop.type = isPattern ? "RestProperty" : "SpreadProperty";
          node.properties.push(prop);
          continue
        }

        prop.method = false;
        prop.shorthand = false;
        if (isPattern || refDestructuringErrors) {
          startPos = this$1.start;
          startLoc = this$1.startLoc;
        }
        if (!isPattern)
          isGenerator = this$1.eat(tt.star);
      }
      this$1.parsePropertyName(prop);
      this$1.parsePropertyValue(prop, isPattern, isGenerator, startPos, startLoc, refDestructuringErrors);
      this$1.checkPropClash(prop, propHash);
      node.properties.push(this$1.finishNode(prop, "Property"));
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  }

  acorn.plugins.objectSpread = function objectSpreadPlugin(instance) {
    pp.parseObj = parseObj;
  };

  return acorn;
};
});

var acornObjectSpread = (inject$1 && typeof inject$1 === 'object' && 'default' in inject$1 ? inject$1['default'] : inject$1);

var vlq = __commonjs(function (module, exports, global) {
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	 true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) :
	(factory((global.vlq = global.vlq || {})));
}(__commonjs_global, (function (exports) { 'use strict';

var charToInteger = {};
var integerToChar = {};

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split( '' ).forEach( function ( char, i ) {
	charToInteger[ char ] = i;
	integerToChar[ i ] = char;
});

function decode ( string ) {
	var result = [];
	var shift = 0;
	var value = 0;

	for ( var i = 0; i < string.length; i += 1 ) {
		var integer = charToInteger[ string[i] ];

		if ( integer === undefined ) {
			throw new Error( 'Invalid character (' + string[i] + ')' );
		}

		var hasContinuationBit = integer & 32;

		integer &= 31;
		value += integer << shift;

		if ( hasContinuationBit ) {
			shift += 5;
		} else {
			var shouldNegate = value & 1;
			value >>= 1;

			result.push( shouldNegate ? -value : value );

			// reset
			value = shift = 0;
		}
	}

	return result;
}

function encode ( value ) {
	var result;

	if ( typeof value === 'number' ) {
		result = encodeInteger( value );
	} else {
		result = '';
		for ( var i = 0; i < value.length; i += 1 ) {
			result += encodeInteger( value[i] );
		}
	}

	return result;
}

function encodeInteger ( num ) {
	var result = '';

	if ( num < 0 ) {
		num = ( -num << 1 ) | 1;
	} else {
		num <<= 1;
	}

	do {
		var clamped = num & 31;
		num >>= 5;

		if ( num > 0 ) {
			clamped |= 32;
		}

		result += integerToChar[ clamped ];
	} while ( num > 0 );

	return result;
}

exports.decode = decode;
exports.encode = encode;

Object.defineProperty(exports, '__esModule', { value: true });

})));
});

var require$$0$1 = (vlq && typeof vlq === 'object' && 'default' in vlq ? vlq['default'] : vlq);

var magicString_cjs = __commonjs(function (module) {
'use strict';

var vlq = require$$0$1;

function Chunk ( start, end, content ) {
	this.start = start;
	this.end = end;
	this.original = content;

	this.intro = '';
	this.outro = '';

	this.content = content;
	this.storeName = false;
	this.edited = false;

	// we make these non-enumerable, for sanity while debugging
	Object.defineProperties( this, {
		previous: { writable: true, value: null },
		next: { writable: true, value: null }
	});
}

Chunk.prototype = {
	append: function append ( content ) {
		this.outro += content;
	},

	clone: function clone () {
		var chunk = new Chunk( this.start, this.end, this.original );

		chunk.intro = this.intro;
		chunk.outro = this.outro;
		chunk.content = this.content;
		chunk.storeName = this.storeName;
		chunk.edited = this.edited;

		return chunk;
	},

	contains: function contains ( index ) {
		return this.start < index && index < this.end;
	},

	eachNext: function eachNext ( fn ) {
		var chunk = this;
		while ( chunk ) {
			fn( chunk );
			chunk = chunk.next;
		}
	},

	eachPrevious: function eachPrevious ( fn ) {
		var chunk = this;
		while ( chunk ) {
			fn( chunk );
			chunk = chunk.previous;
		}
	},

	edit: function edit ( content, storeName ) {
		this.content = content;
		this.storeName = storeName;

		this.edited = true;

		return this;
	},

	prepend: function prepend ( content ) {
		this.intro = content + this.intro;
	},

	split: function split ( index ) {
		var sliceIndex = index - this.start;

		var originalBefore = this.original.slice( 0, sliceIndex );
		var originalAfter = this.original.slice( sliceIndex );

		this.original = originalBefore;

		var newChunk = new Chunk( index, this.end, originalAfter );
		newChunk.outro = this.outro;
		this.outro = '';

		this.end = index;

		if ( this.edited ) {
			// TODO is this block necessary?...
			newChunk.edit( '', false );
			this.content = '';
		} else {
			this.content = originalBefore;
		}

		newChunk.next = this.next;
		if ( newChunk.next ) newChunk.next.previous = newChunk;
		newChunk.previous = this;
		this.next = newChunk;

		return newChunk;
	},

	toString: function toString () {
		return this.intro + this.content + this.outro;
	},

	trimEnd: function trimEnd ( rx ) {
		this.outro = this.outro.replace( rx, '' );
		if ( this.outro.length ) return true;

		var trimmed = this.content.replace( rx, '' );

		if ( trimmed.length ) {
			if ( trimmed !== this.content ) {
				this.split( this.start + trimmed.length ).edit( '', false );
			}

			return true;
		} else {
			this.edit( '', false );

			this.intro = this.intro.replace( rx, '' );
			if ( this.intro.length ) return true;
		}
	},

	trimStart: function trimStart ( rx ) {
		this.intro = this.intro.replace( rx, '' );
		if ( this.intro.length ) return true;

		var trimmed = this.content.replace( rx, '' );

		if ( trimmed.length ) {
			if ( trimmed !== this.content ) {
				this.split( this.end - trimmed.length );
				this.edit( '', false );
			}

			return true;
		} else {
			this.edit( '', false );

			this.outro = this.outro.replace( rx, '' );
			if ( this.outro.length ) return true;
		}
	}
};

var _btoa;

if ( typeof window !== 'undefined' && typeof window.btoa === 'function' ) {
	_btoa = window.btoa;
} else if ( typeof Buffer === 'function' ) {
	_btoa = function ( str ) { return new Buffer( str ).toString( 'base64' ); };
} else {
	_btoa = function () {
		throw new Error( 'Unsupported environment: `window.btoa` or `Buffer` should be supported.' );
	};
}

var btoa = _btoa;

function SourceMap ( properties ) {
	this.version = 3;

	this.file           = properties.file;
	this.sources        = properties.sources;
	this.sourcesContent = properties.sourcesContent;
	this.names          = properties.names;
	this.mappings       = properties.mappings;
}

SourceMap.prototype = {
	toString: function toString () {
		return JSON.stringify( this );
	},

	toUrl: function toUrl () {
		return 'data:application/json;charset=utf-8;base64,' + btoa( this.toString() );
	}
};

function guessIndent ( code ) {
	var lines = code.split( '\n' );

	var tabbed = lines.filter( function ( line ) { return /^\t+/.test( line ); } );
	var spaced = lines.filter( function ( line ) { return /^ {2,}/.test( line ); } );

	if ( tabbed.length === 0 && spaced.length === 0 ) {
		return null;
	}

	// More lines tabbed than spaced? Assume tabs, and
	// default to tabs in the case of a tie (or nothing
	// to go on)
	if ( tabbed.length >= spaced.length ) {
		return '\t';
	}

	// Otherwise, we need to guess the multiple
	var min = spaced.reduce( function ( previous, current ) {
		var numSpaces = /^ +/.exec( current )[0].length;
		return Math.min( numSpaces, previous );
	}, Infinity );

	return new Array( min + 1 ).join( ' ' );
}

function getLocator ( source ) {
	var originalLines = source.split( '\n' );

	var start = 0;
	var lineRanges = originalLines.map( function ( line, i ) {
		var end = start + line.length + 1;
		var range = { start: start, end: end, line: i };

		start = end;
		return range;
	});

	var i = 0;

	function rangeContains ( range, index ) {
		return range.start <= index && index < range.end;
	}

	function getLocation ( range, index ) {
		return { line: range.line, column: index - range.start };
	}

	return function locate ( index ) {
		var range = lineRanges[i];

		var d = index >= range.end ? 1 : -1;

		while ( range ) {
			if ( rangeContains( range, index ) ) return getLocation( range, index );

			i += d;
			range = lineRanges[i];
		}
	};
}

function encodeMappings ( original, intro, chunk, hires, sourcemapLocations, sourceIndex, offsets, names ) {
	var rawLines = [];

	var generatedCodeLine = intro.split( '\n' ).length - 1;
	var rawSegments = rawLines[ generatedCodeLine ] = [];

	var generatedCodeColumn = 0;

	var locate = getLocator( original );

	function addEdit ( content, original, loc, nameIndex, i ) {
		if ( i || content.length ) {
			rawSegments.push({
				generatedCodeLine: generatedCodeLine,
				generatedCodeColumn: generatedCodeColumn,
				sourceCodeLine: loc.line,
				sourceCodeColumn: loc.column,
				sourceCodeName: nameIndex,
				sourceIndex: sourceIndex
			});
		}

		var lines = content.split( '\n' );
		var lastLine = lines.pop();

		if ( lines.length ) {
			generatedCodeLine += lines.length;
			rawLines[ generatedCodeLine ] = rawSegments = [];
			generatedCodeColumn = lastLine.length;
		} else {
			generatedCodeColumn += lastLine.length;
		}

		lines = original.split( '\n' );
		lastLine = lines.pop();

		if ( lines.length ) {
			loc.line += lines.length;
			loc.column = lastLine.length;
		} else {
			loc.column += lastLine.length;
		}
	}

	function addUneditedChunk ( chunk, loc ) {
		var originalCharIndex = chunk.start;
		var first = true;

		while ( originalCharIndex < chunk.end ) {
			if ( hires || first || sourcemapLocations[ originalCharIndex ] ) {
				rawSegments.push({
					generatedCodeLine: generatedCodeLine,
					generatedCodeColumn: generatedCodeColumn,
					sourceCodeLine: loc.line,
					sourceCodeColumn: loc.column,
					sourceCodeName: -1,
					sourceIndex: sourceIndex
				});
			}

			if ( original[ originalCharIndex ] === '\n' ) {
				loc.line += 1;
				loc.column = 0;
				generatedCodeLine += 1;
				rawLines[ generatedCodeLine ] = rawSegments = [];
				generatedCodeColumn = 0;
			} else {
				loc.column += 1;
				generatedCodeColumn += 1;
			}

			originalCharIndex += 1;
			first = false;
		}
	}

	while ( chunk ) {
		var loc = locate( chunk.start );

		if ( chunk.intro.length ) {
			addEdit( chunk.intro, '', loc, -1, !!chunk.previous );
		}

		if ( chunk.edited ) {
			addEdit( chunk.content, chunk.original, loc, chunk.storeName ? names.indexOf( chunk.original ) : -1, !!chunk.previous );
		} else {
			addUneditedChunk( chunk, loc );
		}

		if ( chunk.outro.length ) {
			addEdit( chunk.outro, '', loc, -1, !!chunk.previous );
		}

		var nextChunk = chunk.next;
		chunk = nextChunk;
	}

	offsets.sourceIndex = offsets.sourceIndex || 0;
	offsets.sourceCodeLine = offsets.sourceCodeLine || 0;
	offsets.sourceCodeColumn = offsets.sourceCodeColumn || 0;
	offsets.sourceCodeName = offsets.sourceCodeName || 0;

	var encoded = rawLines.map( function ( segments ) {
		var generatedCodeColumn = 0;

		return segments.map( function ( segment ) {
			var arr = [
				segment.generatedCodeColumn - generatedCodeColumn,
				segment.sourceIndex - offsets.sourceIndex,
				segment.sourceCodeLine - offsets.sourceCodeLine,
				segment.sourceCodeColumn - offsets.sourceCodeColumn
			];

			generatedCodeColumn = segment.generatedCodeColumn;
			offsets.sourceIndex = segment.sourceIndex;
			offsets.sourceCodeLine = segment.sourceCodeLine;
			offsets.sourceCodeColumn = segment.sourceCodeColumn;

			if ( ~segment.sourceCodeName ) {
				arr.push( segment.sourceCodeName - offsets.sourceCodeName );
				offsets.sourceCodeName = segment.sourceCodeName;
			}

			return vlq.encode( arr );
		}).join( ',' );
	}).join( ';' );

	return encoded;
}

function getRelativePath ( from, to ) {
	var fromParts = from.split( /[\/\\]/ );
	var toParts = to.split( /[\/\\]/ );

	fromParts.pop(); // get dirname

	while ( fromParts[0] === toParts[0] ) {
		fromParts.shift();
		toParts.shift();
	}

	if ( fromParts.length ) {
		var i = fromParts.length;
		while ( i-- ) fromParts[i] = '..';
	}

	return fromParts.concat( toParts ).join( '/' );
}

var toString = Object.prototype.toString;

function isObject ( thing ) {
	return toString.call( thing ) === '[object Object]';
}

function MagicString ( string, options ) {
	if ( options === void 0 ) options = {};

	var chunk = new Chunk( 0, string.length, string );

	Object.defineProperties( this, {
		original:              { writable: true, value: string },
		outro:                 { writable: true, value: '' },
		intro:                 { writable: true, value: '' },
		firstChunk:            { writable: true, value: chunk },
		lastChunk:             { writable: true, value: chunk },
		lastSearchedChunk:     { writable: true, value: chunk },
		byStart:               { writable: true, value: {} },
		byEnd:                 { writable: true, value: {} },
		filename:              { writable: true, value: options.filename },
		indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
		sourcemapLocations:    { writable: true, value: {} },
		storedNames:           { writable: true, value: {} },
		indentStr:             { writable: true, value: guessIndent( string ) }
	});

	this.byStart[ 0 ] = chunk;
	this.byEnd[ string.length ] = chunk;
}

MagicString.prototype = {
	addSourcemapLocation: function addSourcemapLocation ( char ) {
		this.sourcemapLocations[ char ] = true;
	},

	append: function append ( content ) {
		if ( typeof content !== 'string' ) throw new TypeError( 'outro content must be a string' );

		this.outro += content;
		return this;
	},

	clone: function clone () {
		var cloned = new MagicString( this.original, { filename: this.filename });

		var originalChunk = this.firstChunk;
		var clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();

		while ( originalChunk ) {
			cloned.byStart[ clonedChunk.start ] = clonedChunk;
			cloned.byEnd[ clonedChunk.end ] = clonedChunk;

			var nextOriginalChunk = originalChunk.next;
			var nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();

			if ( nextClonedChunk ) {
				clonedChunk.next = nextClonedChunk;
				nextClonedChunk.previous = clonedChunk;

				clonedChunk = nextClonedChunk;
			}

			originalChunk = nextOriginalChunk;
		}

		cloned.lastChunk = clonedChunk;

		if ( this.indentExclusionRanges ) {
			cloned.indentExclusionRanges = typeof this.indentExclusionRanges[0] === 'number' ?
				[ this.indentExclusionRanges[0], this.indentExclusionRanges[1] ] :
				this.indentExclusionRanges.map( function ( range ) { return [ range.start, range.end ]; } );
		}

		Object.keys( this.sourcemapLocations ).forEach( function ( loc ) {
			cloned.sourcemapLocations[ loc ] = true;
		});

		return cloned;
	},

	generateMap: function generateMap ( options ) {
		options = options || {};

		var names = Object.keys( this.storedNames );

		var map = new SourceMap({
			file: ( options.file ? options.file.split( /[\/\\]/ ).pop() : null ),
			sources: [ options.source ? getRelativePath( options.file || '', options.source ) : null ],
			sourcesContent: options.includeContent ? [ this.original ] : [ null ],
			names: names,
			mappings: this.getMappings( options.hires, 0, {}, names )
		});
		return map;
	},

	getIndentString: function getIndentString () {
		return this.indentStr === null ? '\t' : this.indentStr;
	},

	getMappings: function getMappings ( hires, sourceIndex, offsets, names ) {
		return encodeMappings( this.original, this.intro, this.firstChunk, hires, this.sourcemapLocations, sourceIndex, offsets, names );
	},

	indent: function indent ( indentStr, options ) {
		var this$1 = this;

		var pattern = /^[^\r\n]/gm;

		if ( isObject( indentStr ) ) {
			options = indentStr;
			indentStr = undefined;
		}

		indentStr = indentStr !== undefined ? indentStr : ( this.indentStr || '\t' );

		if ( indentStr === '' ) return this; // noop

		options = options || {};

		// Process exclusion ranges
		var isExcluded = {};

		if ( options.exclude ) {
			var exclusions = typeof options.exclude[0] === 'number' ? [ options.exclude ] : options.exclude;
			exclusions.forEach( function ( exclusion ) {
				for ( var i = exclusion[0]; i < exclusion[1]; i += 1 ) {
					isExcluded[i] = true;
				}
			});
		}

		var shouldIndentNextCharacter = options.indentStart !== false;
		var replacer = function ( match ) {
			if ( shouldIndentNextCharacter ) return ("" + indentStr + match);
			shouldIndentNextCharacter = true;
			return match;
		};

		this.intro = this.intro.replace( pattern, replacer );

		var charIndex = 0;

		var chunk = this.firstChunk;

		while ( chunk ) {
			var end = chunk.end;

			if ( chunk.edited ) {
				if ( !isExcluded[ charIndex ] ) {
					chunk.content = chunk.content.replace( pattern, replacer );

					if ( chunk.content.length ) {
						shouldIndentNextCharacter = chunk.content[ chunk.content.length - 1 ] === '\n';
					}
				}
			} else {
				charIndex = chunk.start;

				while ( charIndex < end ) {
					if ( !isExcluded[ charIndex ] ) {
						var char = this$1.original[ charIndex ];

						if ( char === '\n' ) {
							shouldIndentNextCharacter = true;
						} else if ( char !== '\r' && shouldIndentNextCharacter ) {
							shouldIndentNextCharacter = false;

							if ( charIndex === chunk.start ) {
								chunk.prepend( indentStr );
							} else {
								var rhs = chunk.split( charIndex );
								rhs.prepend( indentStr );

								this$1.byStart[ charIndex ] = rhs;
								this$1.byEnd[ charIndex ] = chunk;

								chunk = rhs;
							}
						}
					}

					charIndex += 1;
				}
			}

			charIndex = chunk.end;
			chunk = chunk.next;
		}

		this.outro = this.outro.replace( pattern, replacer );

		return this;
	},

	insert: function insert () {
		throw new Error( 'magicString.insert(...) is deprecated. Use insertRight(...) or insertLeft(...)' );
	},

	insertLeft: function insertLeft ( index, content ) {
		if ( typeof content !== 'string' ) throw new TypeError( 'inserted content must be a string' );

		this._split( index );

		var chunk = this.byEnd[ index ];

		if ( chunk ) {
			chunk.append( content );
		} else {
			this.intro += content;
		}

		return this;
	},

	insertRight: function insertRight ( index, content ) {
		if ( typeof content !== 'string' ) throw new TypeError( 'inserted content must be a string' );

		this._split( index );

		var chunk = this.byStart[ index ];

		if ( chunk ) {
			chunk.prepend( content );
		} else {
			this.outro += content;
		}

		return this;
	},

	move: function move ( start, end, index ) {
		if ( index >= start && index <= end ) throw new Error( 'Cannot move a selection inside itself' );

		this._split( start );
		this._split( end );
		this._split( index );

		var first = this.byStart[ start ];
		var last = this.byEnd[ end ];

		var oldLeft = first.previous;
		var oldRight = last.next;

		var newRight = this.byStart[ index ];
		if ( !newRight && last === this.lastChunk ) return this;
		var newLeft = newRight ? newRight.previous : this.lastChunk;

		if ( oldLeft ) oldLeft.next = oldRight;
		if ( oldRight ) oldRight.previous = oldLeft;

		if ( newLeft ) newLeft.next = first;
		if ( newRight ) newRight.previous = last;

		if ( !first.previous ) this.firstChunk = last.next;
		if ( !last.next ) {
			this.lastChunk = first.previous;
			this.lastChunk.next = null;
		}

		first.previous = newLeft;
		last.next = newRight;

		if ( !newLeft ) this.firstChunk = first;
		if ( !newRight ) this.lastChunk = last;

		return this;
	},

	overwrite: function overwrite ( start, end, content, storeName ) {
		var this$1 = this;

		if ( typeof content !== 'string' ) throw new TypeError( 'replacement content must be a string' );

		while ( start < 0 ) start += this$1.original.length;
		while ( end < 0 ) end += this$1.original.length;

		if ( end > this.original.length ) throw new Error( 'end is out of bounds' );
		if ( start === end ) throw new Error( 'Cannot overwrite a zero-length range – use insertLeft or insertRight instead' );

		this._split( start );
		this._split( end );

		if ( storeName ) {
			var original = this.original.slice( start, end );
			this.storedNames[ original ] = true;
		}

		var first = this.byStart[ start ];
		var last = this.byEnd[ end ];

		if ( first ) {
			first.edit( content, storeName );

			if ( first !== last ) {
				first.outro = '';

				var chunk = first.next;
				while ( chunk !== last ) {
					chunk.edit( '', false );
					chunk.intro = chunk.outro = '';
					chunk = chunk.next;
				}

				chunk.edit( '', false );
				chunk.intro = '';
			}
		}

		else {
			// must be inserting at the end
			var newChunk = new Chunk( start, end, '' ).edit( content, storeName );

			// TODO last chunk in the array may not be the last chunk, if it's moved...
			last.next = newChunk;
			newChunk.previous = last;
		}

		return this;
	},

	prepend: function prepend ( content ) {
		if ( typeof content !== 'string' ) throw new TypeError( 'outro content must be a string' );

		this.intro = content + this.intro;
		return this;
	},

	remove: function remove ( start, end ) {
		var this$1 = this;

		while ( start < 0 ) start += this$1.original.length;
		while ( end < 0 ) end += this$1.original.length;

		if ( start === end ) return this;

		if ( start < 0 || end > this.original.length ) throw new Error( 'Character is out of bounds' );
		if ( start > end ) throw new Error( 'end must be greater than start' );

		return this.overwrite( start, end, '', false );
	},

	slice: function slice ( start, end ) {
		var this$1 = this;
		if ( start === void 0 ) start = 0;
		if ( end === void 0 ) end = this.original.length;

		while ( start < 0 ) start += this$1.original.length;
		while ( end < 0 ) end += this$1.original.length;

		var result = '';

		// find start chunk
		var chunk = this.firstChunk;
		while ( chunk && ( chunk.start > start || chunk.end <= start ) ) {

			// found end chunk before start
			if ( chunk.start < end && chunk.end >= end ) {
				return result;
			}

			chunk = chunk.next;
		}

		if ( chunk && chunk.edited && chunk.start !== start ) throw new Error(("Cannot use replaced character " + start + " as slice start anchor."));

		var startChunk = chunk;
		while ( chunk ) {
			if ( chunk.intro && ( startChunk !== chunk || chunk.start === start ) ) {
				result += chunk.intro;
			}

			var containsEnd = chunk.start < end && chunk.end >= end;
			if ( containsEnd && chunk.edited && chunk.end !== end ) throw new Error(("Cannot use replaced character " + end + " as slice end anchor."));

			var sliceStart = startChunk === chunk ? start - chunk.start : 0;
			var sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;

			result += chunk.content.slice( sliceStart, sliceEnd );

			if ( chunk.outro && ( !containsEnd || chunk.end === end ) ) {
				result += chunk.outro;
			}

			if ( containsEnd ) {
				break;
			}

			chunk = chunk.next;
		}

		return result;
	},

	// TODO deprecate this? not really very useful
	snip: function snip ( start, end ) {
		var clone = this.clone();
		clone.remove( 0, start );
		clone.remove( end, clone.original.length );

		return clone;
	},

	_split: function _split ( index ) {
		var this$1 = this;

		if ( this.byStart[ index ] || this.byEnd[ index ] ) return;

		var chunk = this.lastSearchedChunk;
		var searchForward = index > chunk.end;

		while ( true ) {
			if ( chunk.contains( index ) ) return this$1._splitChunk( chunk, index );

			chunk = searchForward ?
				this$1.byStart[ chunk.end ] :
				this$1.byEnd[ chunk.start ];
		}
	},

	_splitChunk: function _splitChunk ( chunk, index ) {
		if ( chunk.edited && chunk.content.length ) { // zero-length edited chunks are a special case (overlapping replacements)
			var loc = getLocator( this.original )( index );
			throw new Error( ("Cannot split a chunk that has already been edited (" + (loc.line) + ":" + (loc.column) + " – \"" + (chunk.original) + "\")") );
		}

		var newChunk = chunk.split( index );

		this.byEnd[ index ] = chunk;
		this.byStart[ index ] = newChunk;
		this.byEnd[ newChunk.end ] = newChunk;

		if ( chunk === this.lastChunk ) this.lastChunk = newChunk;

		this.lastSearchedChunk = chunk;
		return true;
	},

	toString: function toString () {
		var str = this.intro;

		var chunk = this.firstChunk;
		while ( chunk ) {
			str += chunk.toString();
			chunk = chunk.next;
		}

		return str + this.outro;
	},

	trimLines: function trimLines () {
		return this.trim('[\\r\\n]');
	},

	trim: function trim ( charType ) {
		return this.trimStart( charType ).trimEnd( charType );
	},

	trimEnd: function trimEnd ( charType ) {
		var this$1 = this;

		var rx = new RegExp( ( charType || '\\s' ) + '+$' );

		this.outro = this.outro.replace( rx, '' );
		if ( this.outro.length ) return this;

		var chunk = this.lastChunk;

		do {
			var end = chunk.end;
			var aborted = chunk.trimEnd( rx );

			// if chunk was trimmed, we have a new lastChunk
			if ( chunk.end !== end ) {
				this$1.lastChunk = chunk.next;

				this$1.byEnd[ chunk.end ] = chunk;
				this$1.byStart[ chunk.next.start ] = chunk.next;
			}

			if ( aborted ) return this$1;
			chunk = chunk.previous;
		} while ( chunk );

		return this;
	},

	trimStart: function trimStart ( charType ) {
		var this$1 = this;

		var rx = new RegExp( '^' + ( charType || '\\s' ) + '+' );

		this.intro = this.intro.replace( rx, '' );
		if ( this.intro.length ) return this;

		var chunk = this.firstChunk;

		do {
			var end = chunk.end;
			var aborted = chunk.trimStart( rx );

			if ( chunk.end !== end ) {
				// special case...
				if ( chunk === this$1.lastChunk ) this$1.lastChunk = chunk.next;

				this$1.byEnd[ chunk.end ] = chunk;
				this$1.byStart[ chunk.next.start ] = chunk.next;
			}

			if ( aborted ) return this$1;
			chunk = chunk.next;
		} while ( chunk );

		return this;
	}
};

var hasOwnProp = Object.prototype.hasOwnProperty;

function Bundle ( options ) {
	if ( options === void 0 ) options = {};

	this.intro = options.intro || '';
	this.separator = options.separator !== undefined ? options.separator : '\n';

	this.sources = [];

	this.uniqueSources = [];
	this.uniqueSourceIndexByFilename = {};
}

Bundle.prototype = {
	addSource: function addSource ( source ) {
		if ( source instanceof MagicString ) {
			return this.addSource({
				content: source,
				filename: source.filename,
				separator: this.separator
			});
		}

		if ( !isObject( source ) || !source.content ) {
			throw new Error( 'bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`' );
		}

		[ 'filename', 'indentExclusionRanges', 'separator' ].forEach( function ( option ) {
			if ( !hasOwnProp.call( source, option ) ) source[ option ] = source.content[ option ];
		});

		if ( source.separator === undefined ) { // TODO there's a bunch of this sort of thing, needs cleaning up
			source.separator = this.separator;
		}

		if ( source.filename ) {
			if ( !hasOwnProp.call( this.uniqueSourceIndexByFilename, source.filename ) ) {
				this.uniqueSourceIndexByFilename[ source.filename ] = this.uniqueSources.length;
				this.uniqueSources.push({ filename: source.filename, content: source.content.original });
			} else {
				var uniqueSource = this.uniqueSources[ this.uniqueSourceIndexByFilename[ source.filename ] ];
				if ( source.content.original !== uniqueSource.content ) {
					throw new Error( ("Illegal source: same filename (" + (source.filename) + "), different contents") );
				}
			}
		}

		this.sources.push( source );
		return this;
	},

	append: function append ( str, options ) {
		this.addSource({
			content: new MagicString( str ),
			separator: ( options && options.separator ) || ''
		});

		return this;
	},

	clone: function clone () {
		var bundle = new Bundle({
			intro: this.intro,
			separator: this.separator
		});

		this.sources.forEach( function ( source ) {
			bundle.addSource({
				filename: source.filename,
				content: source.content.clone(),
				separator: source.separator
			});
		});

		return bundle;
	},

	generateMap: function generateMap ( options ) {
		var this$1 = this;

		var offsets = {};

		var names = [];
		this.sources.forEach( function ( source ) {
			Object.keys( source.content.storedNames ).forEach( function ( name ) {
				if ( !~names.indexOf( name ) ) names.push( name );
			});
		});

		var encoded = (
			getSemis( this.intro ) +
			this.sources.map( function ( source, i ) {
				var prefix = ( i > 0 ) ? ( getSemis( source.separator ) || ',' ) : '';
				var mappings;

				// we don't bother encoding sources without a filename
				if ( !source.filename ) {
					mappings = getSemis( source.content.toString() );
				} else {
					var sourceIndex = this$1.uniqueSourceIndexByFilename[ source.filename ];
					mappings = source.content.getMappings( options.hires, sourceIndex, offsets, names );
				}

				return prefix + mappings;
			}).join( '' )
		);

		return new SourceMap({
			file: ( options.file ? options.file.split( /[\/\\]/ ).pop() : null ),
			sources: this.uniqueSources.map( function ( source ) {
				return options.file ? getRelativePath( options.file, source.filename ) : source.filename;
			}),
			sourcesContent: this.uniqueSources.map( function ( source ) {
				return options.includeContent ? source.content : null;
			}),
			names: names,
			mappings: encoded
		});
	},

	getIndentString: function getIndentString () {
		var indentStringCounts = {};

		this.sources.forEach( function ( source ) {
			var indentStr = source.content.indentStr;

			if ( indentStr === null ) return;

			if ( !indentStringCounts[ indentStr ] ) indentStringCounts[ indentStr ] = 0;
			indentStringCounts[ indentStr ] += 1;
		});

		return ( Object.keys( indentStringCounts ).sort( function ( a, b ) {
			return indentStringCounts[a] - indentStringCounts[b];
		})[0] ) || '\t';
	},

	indent: function indent ( indentStr ) {
		var this$1 = this;

		if ( !arguments.length ) {
			indentStr = this.getIndentString();
		}

		if ( indentStr === '' ) return this; // noop

		var trailingNewline = !this.intro || this.intro.slice( -1 ) === '\n';

		this.sources.forEach( function ( source, i ) {
			var separator = source.separator !== undefined ? source.separator : this$1.separator;
			var indentStart = trailingNewline || ( i > 0 && /\r?\n$/.test( separator ) );

			source.content.indent( indentStr, {
				exclude: source.indentExclusionRanges,
				indentStart: indentStart//: trailingNewline || /\r?\n$/.test( separator )  //true///\r?\n/.test( separator )
			});

			// TODO this is a very slow way to determine this
			trailingNewline = source.content.toString().slice( 0, -1 ) === '\n';
		});

		if ( this.intro ) {
			this.intro = indentStr + this.intro.replace( /^[^\n]/gm, function ( match, index ) {
				return index > 0 ? indentStr + match : match;
			});
		}

		return this;
	},

	prepend: function prepend ( str ) {
		this.intro = str + this.intro;
		return this;
	},

	toString: function toString () {
		var this$1 = this;

		var body = this.sources.map( function ( source, i ) {
			var separator = source.separator !== undefined ? source.separator : this$1.separator;
			var str = ( i > 0 ? separator : '' ) + source.content.toString();

			return str;
		}).join( '' );

		return this.intro + body;
	},

	trimLines: function trimLines () {
		return this.trim('[\\r\\n]');
	},

	trim: function trim ( charType ) {
		return this.trimStart( charType ).trimEnd( charType );
	},

	trimStart: function trimStart ( charType ) {
		var this$1 = this;

		var rx = new RegExp( '^' + ( charType || '\\s' ) + '+' );
		this.intro = this.intro.replace( rx, '' );

		if ( !this.intro ) {
			var source;
			var i = 0;

			do {
				source = this$1.sources[i];

				if ( !source ) {
					break;
				}

				source.content.trimStart( charType );
				i += 1;
			} while ( source.content.toString() === '' ); // TODO faster way to determine non-empty source?
		}

		return this;
	},

	trimEnd: function trimEnd ( charType ) {
		var this$1 = this;

		var rx = new RegExp( ( charType || '\\s' ) + '+$' );

		var source;
		var i = this.sources.length - 1;

		do {
			source = this$1.sources[i];

			if ( !source ) {
				this$1.intro = this$1.intro.replace( rx, '' );
				break;
			}

			source.content.trimEnd( charType );
			i -= 1;
		} while ( source.content.toString() === '' ); // TODO faster way to determine non-empty source?

		return this;
	}
};

function getSemis ( str ) {
	return new Array( str.split( '\n' ).length ).join( ';' );
}

MagicString.Bundle = Bundle;

module.exports = MagicString;

});

var MagicString = (magicString_cjs && typeof magicString_cjs === 'object' && 'default' in magicString_cjs ? magicString_cjs['default'] : magicString_cjs);

var keys = {
	Program: [ 'body' ],
	Literal: []
};

// used for debugging, without the noise created by
// circular references
function toJSON ( node ) {
	var obj = {};

	Object.keys( node ).forEach( function ( key ) {
		if ( key === 'parent' || key === 'program' || key === 'keys' || key === '__wrapped' ) return;

		if ( Array.isArray( node[ key ] ) ) {
			obj[ key ] = node[ key ].map( toJSON );
		} else if ( node[ key ] && node[ key ].toJSON ) {
			obj[ key ] = node[ key ].toJSON();
		} else {
			obj[ key ] = node[ key ];
		}
	});

	return obj;
}

var Node = function Node ( raw, parent ) {
	raw.parent = parent;
	raw.program = parent.program || parent;
	raw.depth = parent.depth + 1;
	raw.keys = keys[ raw.type ];
	raw.indentation = undefined;

	for ( var i = 0, list = keys[ raw.type ]; i < list.length; i += 1 ) {
		var key = list[i];

			wrap( raw[ key ], raw );
	}

	raw.program.magicString.addSourcemapLocation( raw.start );
	raw.program.magicString.addSourcemapLocation( raw.end );
};

Node.prototype.ancestor = function ancestor ( level ) {
	var node = this;
	while ( level-- ) {
		node = node.parent;
		if ( !node ) return null;
	}

	return node;
};

Node.prototype.contains = function contains ( node ) {
		var this$1 = this;

	while ( node ) {
		if ( node === this$1 ) return true;
		node = node.parent;
	}

	return false;
};

Node.prototype.findLexicalBoundary = function findLexicalBoundary () {
	return this.parent.findLexicalBoundary();
};

Node.prototype.findNearest = function findNearest ( type ) {
	if ( typeof type === 'string' ) type = new RegExp( ("^" + type + "$") );
	if ( type.test( this.type ) ) return this;
	return this.parent.findNearest( type );
};

Node.prototype.unparenthesizedParent = function unparenthesizedParent () {
	var node = this.parent;
	while ( node && node.type === 'ParenthesizedExpression' ) {
		node = node.parent;
	}
	return node;
};

Node.prototype.unparenthesize = function unparenthesize () {
	var node = this;
	while ( node.type === 'ParenthesizedExpression' ) {
		node = node.expression;
	}
	return node;
};

Node.prototype.findScope = function findScope ( functionScope ) {
	return this.parent.findScope( functionScope );
};

Node.prototype.getIndentation = function getIndentation () {
	return this.parent.getIndentation();
};

Node.prototype.initialise = function initialise ( transforms ) {
	for ( var i = 0, list = this.keys; i < list.length; i += 1 ) {
		var key = list[i];

			var value = this[ key ];

		if ( Array.isArray( value ) ) {
			value.forEach( function ( node ) { return node && node.initialise( transforms ); } );
		} else if ( value && typeof value === 'object' ) {
			value.initialise( transforms );
		}
	}
};

Node.prototype.toJSON = function toJSON$1 () {
	return toJSON( this );
};

Node.prototype.toString = function toString () {
	return this.program.magicString.original.slice( this.start, this.end );
};

Node.prototype.transpile = function transpile ( code, transforms ) {
	for ( var i = 0, list = this.keys; i < list.length; i += 1 ) {
		var key = list[i];

			var value = this[ key ];

		if ( Array.isArray( value ) ) {
			value.forEach( function ( node ) { return node && node.transpile( code, transforms ); } );
		} else if ( value && typeof value === 'object' ) {
			value.transpile( code, transforms );
		}
	}
};

function isArguments ( node ) {
	return node.type === 'Identifier' && node.name === 'arguments';
}

function spread ( code, elements, start, argumentsArrayAlias, isNew ) {
	var i = elements.length;
	var firstSpreadIndex = -1;

	while ( i-- ) {
		var element$1 = elements[i];
		if ( element$1 && element$1.type === 'SpreadElement' ) {
			if ( isArguments( element$1.argument ) ) {
				code.overwrite( element$1.argument.start, element$1.argument.end, argumentsArrayAlias );
			}

			firstSpreadIndex = i;
		}
	}

	if ( firstSpreadIndex === -1 ) return false; // false indicates no spread elements

	if (isNew) {
		for ( i = 0; i < elements.length; i += 1 ) {
			var element$2 = elements[i];
			if ( element$2.type === 'SpreadElement' ) {
				code.remove( element$2.start, element$2.argument.start );
			} else {
				code.insertRight( element$2.start, '[' );
				code.insertRight( element$2.end, ']' );
			}
		}

		return true; // true indicates some spread elements
	}

	var element = elements[ firstSpreadIndex ];
	var previousElement = elements[ firstSpreadIndex - 1 ];

	if ( !previousElement ) {
		code.remove( start, element.start );
		code.overwrite( element.end, elements[1].start, '.concat( ' );
	} else {
		code.overwrite( previousElement.end, element.start, ' ].concat( ' );
	}

	for ( i = firstSpreadIndex; i < elements.length; i += 1 ) {
		element = elements[i];

		if ( element ) {
			if ( element.type === 'SpreadElement' ) {
				code.remove( element.start, element.argument.start );
			} else {
				code.insertLeft( element.start, '[' );
				code.insertLeft( element.end, ']' );
			}
		}
	}

	return true; // true indicates some spread elements
}

var ArrayExpression = (function (Node$$1) {
	function ArrayExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ArrayExpression.__proto__ = Node$$1;
	ArrayExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ArrayExpression.prototype.constructor = ArrayExpression;

	ArrayExpression.prototype.initialise = function initialise ( transforms ) {
		var this$1 = this;

		if ( transforms.spreadRest && this.elements.length ) {
			var lexicalBoundary = this.findLexicalBoundary();

			var i = this.elements.length;
			while ( i-- ) {
				var element = this$1.elements[i];
				if ( element && element.type === 'SpreadElement' && isArguments( element.argument ) ) {
					this$1.argumentsArrayAlias = lexicalBoundary.getArgumentsArrayAlias();
				}
			}
		}

		Node$$1.prototype.initialise.call( this, transforms );
	};

	ArrayExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.spreadRest ) {
			// erase trailing comma after last array element if not an array hole
			if ( this.elements.length ) {
				var lastElement = this.elements[ this.elements.length - 1 ];
				if ( lastElement && /\s*,/.test( code.original.slice( lastElement.end, this.end ) ) ) {
					code.overwrite( lastElement.end, this.end - 1, ' ' );
				}
			}

			if ( this.elements.length === 1 ) {
				var element = this.elements[0];

				if ( element && element.type === 'SpreadElement' ) {
					// special case – [ ...arguments ]
					if ( isArguments( element.argument ) ) {
						code.overwrite( this.start, this.end, ("[].concat( " + (this.argumentsArrayAlias) + " )") ); // TODO if this is the only use of argsArray, don't bother concating
					} else {
						code.overwrite( this.start, element.argument.start, '[].concat( ' );
						code.overwrite( element.end, this.end, ' )' );
					}
				}
			}
			else {
				var hasSpreadElements = spread( code, this.elements, this.start, this.argumentsArrayAlias );

				if ( hasSpreadElements ) {
					code.overwrite( this.end - 1, this.end, ')' );
				}
			}
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return ArrayExpression;
}(Node));

var ArrowFunctionExpression = (function (Node$$1) {
	function ArrowFunctionExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ArrowFunctionExpression.__proto__ = Node$$1;
	ArrowFunctionExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ArrowFunctionExpression.prototype.constructor = ArrowFunctionExpression;

	ArrowFunctionExpression.prototype.initialise = function initialise ( transforms ) {
		this.body.createScope();
		Node$$1.prototype.initialise.call( this, transforms );
	};

	ArrowFunctionExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.arrow ) {
			// remove arrow
			var charIndex = this.body.start;
			while ( code.original[ charIndex ] !== '=' ) {
				charIndex -= 1;
			}
			code.remove( charIndex, this.body.start );

			// wrap naked parameter
			if ( this.params.length === 1 && this.start === this.params[0].start ) {
				code.insertRight( this.params[0].start, '(' );
				code.insertLeft( this.params[0].end, ')' );
			}

			// add function
			if ( this.parent && this.parent.type === 'ExpressionStatement' ) {
				// standalone expression statement
				code.insertRight( this.start, '(function' );
				code.insertRight( this.end, ')' );
			} else {
				code.insertRight( this.start, 'function ' );
			}
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return ArrowFunctionExpression;
}(Node));

function locate ( source, index ) {
	var lines = source.split( '\n' );
	var len = lines.length;

	var lineStart = 0;
	var i;

	for ( i = 0; i < len; i += 1 ) {
		var line = lines[i];
		var lineEnd =  lineStart + line.length + 1; // +1 for newline

		if ( lineEnd > index ) {
			return { line: i + 1, column: index - lineStart, char: i };
		}

		lineStart = lineEnd;
	}

	throw new Error( 'Could not determine location of character' );
}

function pad ( num, len ) {
	var result = String( num );
	return result + repeat( ' ', len - result.length );
}

function repeat ( str, times ) {
	var result = '';
	while ( times-- ) result += str;
	return result;
}

function getSnippet ( source, loc, length ) {
	if ( length === void 0 ) length = 1;

	var first = Math.max( loc.line - 5, 0 );
	var last = loc.line;

	var numDigits = String( last ).length;

	var lines = source.split( '\n' ).slice( first, last );

	var lastLine = lines[ lines.length - 1 ];
	var offset = lastLine.slice( 0, loc.column ).replace( /\t/g, '  ' ).length;

	var snippet = lines
		.map( function ( line, i ) { return ((pad( i + first + 1, numDigits )) + " : " + (line.replace( /\t/g, '  '))); } )
		.join( '\n' );

	snippet += '\n' + repeat( ' ', numDigits + 3 + offset ) + repeat( '^', length );

	return snippet;
}

var CompileError = (function (Error) {
	function CompileError ( node, message ) {
		Error.call(this);

		var source = node.program.magicString.original;
		var loc = locate( source, node.start );

		this.name = 'CompileError';
		this.message = message + " (" + (loc.line) + ":" + (loc.column) + ")";

		this.stack = new Error().stack.replace( new RegExp( (".+new " + (this.name) + ".+\\n"), 'm' ), '' );

		this.loc = loc;
		this.snippet = getSnippet( source, loc, node.end - node.start );
	}

	if ( Error ) CompileError.__proto__ = Error;
	CompileError.prototype = Object.create( Error && Error.prototype );
	CompileError.prototype.constructor = CompileError;

	CompileError.prototype.toString = function toString () {
		return ((this.name) + ": " + (this.message) + "\n" + (this.snippet));
	};

	return CompileError;
}(Error));

var AssignmentExpression = (function (Node$$1) {
	function AssignmentExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) AssignmentExpression.__proto__ = Node$$1;
	AssignmentExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	AssignmentExpression.prototype.constructor = AssignmentExpression;

	AssignmentExpression.prototype.initialise = function initialise ( transforms ) {
		if ( this.left.type === 'Identifier' ) {
			var declaration = this.findScope( false ).findDeclaration( this.left.name );
			if ( declaration && declaration.kind === 'const' ) {
				throw new CompileError( this.left, ((this.left.name) + " is read-only") );
			}

			// special case – https://gitlab.com/Rich-Harris/buble/issues/11
			var statement = declaration && declaration.node.ancestor( 3 );
			if ( statement && statement.type === 'ForStatement' && statement.body.contains( this ) ) {
				statement.reassigned[ this.left.name ] = true;
			}
		}

		Node$$1.prototype.initialise.call( this, transforms );
	};

	AssignmentExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( this.operator === '**=' && transforms.exponentiation ) {
			this.transpileExponentiation( code, transforms );
		}

		else if ( /Pattern/.test( this.left.type ) && transforms.destructuring ) {
			this.transpileDestructuring( code, transforms );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	AssignmentExpression.prototype.transpileDestructuring = function transpileDestructuring ( code ) {
		var scope = this.findScope( true );
		var assign = scope.createIdentifier( 'assign' );
		var temporaries = [ assign ];

		var start = this.start;

		// We need to pick out some elements from the original code,
		// interleaved with generated code. These helpers are used to
		// easily do that while keeping the order of the output
		// predictable.
		var text = '';
		function use ( node ) {
			code.insertRight( node.start, text );
			code.move( node.start, node.end, start );
			text = '';
		}
		function write ( string ) {
			text += string;
		}

		write( ("(" + assign + " = ") );
		use( this.right );

		// Walk `pattern`, generating code that assigns the value in
		// `ref` to it. When `mayDuplicate` is false, the function
		// must take care to only output `ref` once.
		function destructure ( pattern, ref, mayDuplicate ) {
			if ( pattern.type === 'Identifier' || pattern.type === 'MemberExpression' ) {
				write( ', ' );
				use( pattern );
				write( (" = " + ref) );
			}

			else if ( pattern.type === 'AssignmentPattern' ) {
				if ( pattern.left.type === 'Identifier' ) {
					var target = pattern.left.name;
					var source = ref;
					if ( !mayDuplicate ) {
						write( (", " + target + " = " + ref) );
						source = target;
					}
					write( (", " + target + " = " + source + " === void 0 ? ") );
					use( pattern.right );
					write( (" : " + source) );
				}
				else {
					var target$1 = scope.createIdentifier( 'temp' );
					var source$1 = ref;
					temporaries.push( target$1 );
					if ( !mayDuplicate ) {
						write( (", " + target$1 + " = " + ref) );
						source$1 = target$1;
					}
					write( (", " + target$1 + " = " + source$1 + " === void 0 ? ") );
					use( pattern.right );
					write( (" : " + source$1) );
					destructure( pattern.left, target$1, true );
				}
			}

			else if ( pattern.type === 'ArrayPattern' ) {
				var elements = pattern.elements;
				if ( elements.length === 1 ) {
					destructure( elements[0], (ref + "[0]"), false );
				}
				else {
					if ( !mayDuplicate ) {
						var temp = scope.createIdentifier( 'array' );
						temporaries.push( temp );
						write( (", " + temp + " = " + ref) );
						ref = temp;
					}
					elements.forEach( function ( element, i ) {
						if ( element ) {
							if ( element.type === 'RestElement' ) {
								destructure( element.argument, (ref + ".slice(" + i + ")"), false );
							} else {
								destructure( element, (ref + "[" + i + "]"), false );
							}
						}
					} );
				}
			}

			else if ( pattern.type === 'ObjectPattern' ) {
				var props = pattern.properties;
				if ( props.length == 1 ) {
					var prop = props[0];
					var value = prop.computed || prop.key.type !== 'Identifier' ? (ref + "[" + (code.slice(prop.key.start, prop.key.end)) + "]") : (ref + "." + (prop.key.name));
					destructure( prop.value, value, false );
				}
				else {
					if ( !mayDuplicate ) {
						var temp$1 = scope.createIdentifier( 'obj' );
						temporaries.push( temp$1 );
						write( (", " + temp$1 + " = " + ref) );
						ref = temp$1;
					}
					props.forEach( function ( prop ) {
						var value = prop.computed || prop.key.type !== 'Identifier' ? (ref + "[" + (code.slice(prop.key.start, prop.key.end)) + "]") : (ref + "." + (prop.key.name));
						destructure( prop.value, value, false );
					} );
				}
			}

			else {
				throw new Error( ("Unexpected node type in destructuring assignment (" + (pattern.type) + ")") );
			}
		}
		destructure( this.left, assign, true );

		if ( this.unparenthesizedParent().type === 'ExpressionStatement' ) {
			// no rvalue needed for expression statement
			code.insertRight( start, (text + ")") );
		} else {
			// destructuring is part of an expression - need an rvalue
			code.insertRight( start, (text + ", " + assign + ")") );
		}

		code.remove( start, this.right.start );

		var statement = this.findNearest( /(?:Statement|Declaration)$/ );
		code.insertLeft( statement.start, ("var " + (temporaries.join( ', ' )) + ";\n" + (statement.getIndentation())) );
	};

	AssignmentExpression.prototype.transpileExponentiation = function transpileExponentiation ( code ) {
		var scope = this.findScope( false );
		var getAlias = function ( name ) {
			var declaration = scope.findDeclaration( name );
			return declaration ? declaration.name : name;
		};

		// first, the easy part – `**=` -> `=`
		var charIndex = this.left.end;
		while ( code.original[ charIndex ] !== '*' ) charIndex += 1;
		code.remove( charIndex, charIndex + 2 );

		// how we do the next part depends on a number of factors – whether
		// this is a top-level statement, and whether we're updating a
		// simple or complex reference
		var base;

		var left = this.left.unparenthesize();

		if ( left.type === 'Identifier' ) {
			base = getAlias( left.name );
		} else if ( left.type === 'MemberExpression' ) {
			var object;
			var needsObjectVar = false;
			var property;
			var needsPropertyVar = false;

			var statement = this.findNearest( /(?:Statement|Declaration)$/ );
			var i0 = statement.getIndentation();

			if ( left.property.type === 'Identifier' ) {
				property = left.computed ? getAlias( left.property.name ) : left.property.name;
			} else {
				property = scope.createIdentifier( 'property' );
				needsPropertyVar = true;
			}

			if ( left.object.type === 'Identifier' ) {
				object = getAlias( left.object.name );
			} else {
				object = scope.createIdentifier( 'object' );
				needsObjectVar = true;
			}

			if ( left.start === statement.start ) {
				if ( needsObjectVar && needsPropertyVar ) {
					code.insertRight( statement.start, ("var " + object + " = ") );
					code.overwrite( left.object.end, left.property.start, (";\n" + i0 + "var " + property + " = ") );
					code.overwrite( left.property.end, left.end, (";\n" + i0 + object + "[" + property + "]") );
				}

				else if ( needsObjectVar ) {
					code.insertRight( statement.start, ("var " + object + " = ") );
					code.insertLeft( left.object.end, (";\n" + i0) );
					code.insertLeft( left.object.end, object );
				}

				else if ( needsPropertyVar ) {
					code.insertRight( left.property.start, ("var " + property + " = ") );
					code.insertLeft( left.property.end, (";\n" + i0) );
					code.move( left.property.start, left.property.end, this.start );

					code.insertLeft( left.object.end, ("[" + property + "]") );
					code.remove( left.object.end, left.property.start );
					code.remove( left.property.end, left.end );
				}
			}

			else {
				var declarators = [];
				if ( needsObjectVar ) declarators.push( object );
				if ( needsPropertyVar ) declarators.push( property );

				if ( declarators.length ) {
					code.insertRight( statement.start, ("var " + (declarators.join( ', ' )) + ";\n" + i0) );
				}

				if ( needsObjectVar && needsPropertyVar ) {
					code.insertRight( left.start, ("( " + object + " = ") );
					code.overwrite( left.object.end, left.property.start, (", " + property + " = ") );
					code.overwrite( left.property.end, left.end, (", " + object + "[" + property + "]") );
				}

				else if ( needsObjectVar ) {
					code.insertRight( left.start, ("( " + object + " = ") );
					code.insertLeft( left.object.end, (", " + object) );
				}

				else if ( needsPropertyVar ) {
					code.insertRight( left.property.start, ("( " + property + " = ") );
					code.insertLeft( left.property.end, ", " );
					code.move( left.property.start, left.property.end, left.start );

					code.overwrite( left.object.end, left.property.start, ("[" + property + "]") );
					code.remove( left.property.end, left.end );
				}

				if ( needsPropertyVar ) {
					code.insertLeft( this.end, " )" );
				}
			}

			base = object + ( left.computed || needsPropertyVar ? ("[" + property + "]") : ("." + property) );
		}

		code.insertRight( this.right.start, ("Math.pow( " + base + ", ") );
		code.insertLeft( this.right.end, " )" );
	};

	return AssignmentExpression;
}(Node));

var BinaryExpression = (function (Node$$1) {
	function BinaryExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) BinaryExpression.__proto__ = Node$$1;
	BinaryExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	BinaryExpression.prototype.constructor = BinaryExpression;

	BinaryExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( this.operator === '**' && transforms.exponentiation ) {
			code.insertRight( this.start, "Math.pow( " );
			code.overwrite( this.left.end, this.right.start, ", " );
			code.insertLeft( this.end, " )" );
		}
		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return BinaryExpression;
}(Node));

var loopStatement = /(?:For(?:In|Of)?|While)Statement/;

var BreakStatement = (function (Node$$1) {
	function BreakStatement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) BreakStatement.__proto__ = Node$$1;
	BreakStatement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	BreakStatement.prototype.constructor = BreakStatement;

	BreakStatement.prototype.initialise = function initialise () {
		var loop = this.findNearest( loopStatement );
		var switchCase = this.findNearest( 'SwitchCase' );

		if ( loop && ( !switchCase || loop.depth > switchCase.depth ) ) {
			loop.canBreak = true;
			this.loop = loop;
		}
	};

	BreakStatement.prototype.transpile = function transpile ( code ) {
		if ( this.loop && this.loop.shouldRewriteAsFunction ) {
			if ( this.label ) throw new CompileError( this, 'Labels are not currently supported in a loop with locally-scoped variables' );
			code.overwrite( this.start, this.start + 5, "return 'break'" );
		}
	};

	return BreakStatement;
}(Node));

var CallExpression = (function (Node$$1) {
	function CallExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) CallExpression.__proto__ = Node$$1;
	CallExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	CallExpression.prototype.constructor = CallExpression;

	CallExpression.prototype.initialise = function initialise ( transforms ) {
		var this$1 = this;

		if ( transforms.spreadRest && this.arguments.length > 1 ) {
			var lexicalBoundary = this.findLexicalBoundary();

			var i = this.arguments.length;
			while ( i-- ) {
				var arg = this$1.arguments[i];
				if ( arg.type === 'SpreadElement' && isArguments( arg.argument ) ) {
					this$1.argumentsArrayAlias = lexicalBoundary.getArgumentsArrayAlias();
				}
			}
		}

		Node$$1.prototype.initialise.call( this, transforms );
	};

	CallExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.spreadRest && this.arguments.length ) {
			var hasSpreadElements = false;
			var context;

			var firstArgument = this.arguments[0];

			if ( this.arguments.length === 1 ) {
				if ( firstArgument.type === 'SpreadElement' ) {
					code.remove( firstArgument.start, firstArgument.argument.start );
					hasSpreadElements = true;
				}
			} else {
				hasSpreadElements = spread( code, this.arguments, firstArgument.start, this.argumentsArrayAlias );
			}

			if ( hasSpreadElements ) {

				// we need to handle super() and super.method() differently
				// due to its instance
				var _super = null;
				if ( this.callee.type === 'Super' ) {
					_super = this.callee;
				}
				else if ( this.callee.type === 'MemberExpression' && this.callee.object.type === 'Super' ) {
					_super = this.callee.object;
				}

				if ( !_super && this.callee.type === 'MemberExpression' ) {
					if ( this.callee.object.type === 'Identifier' ) {
						context = this.callee.object.name;
					} else {
						context = this.findScope( true ).createIdentifier( 'ref' );
						var callExpression = this.callee.object;
						var enclosure = callExpression.findNearest( /Function/ );
						var block = enclosure ? enclosure.body.body
							: callExpression.findNearest( /^Program$/ ).body;
						var lastStatementInBlock = block[ block.length - 1 ];
						var i0 = lastStatementInBlock.getIndentation();
						code.insertRight( callExpression.start, ("(" + context + " = ") );
						code.insertLeft( callExpression.end, ")" );
						code.insertLeft( lastStatementInBlock.end, ("\n" + i0 + "var " + context + ";") );
					}
				} else {
					context = 'void 0';
				}

				code.insertLeft( this.callee.end, '.apply' );

				if ( _super ) {
					_super.noCall = true; // bit hacky...

					if ( this.arguments.length > 1 ) {
						if ( firstArgument.type !== 'SpreadElement' ) {
							code.insertRight( firstArgument.start, "[ " );
						}

						code.insertLeft( this.arguments[ this.arguments.length - 1 ].end, ' )' );
					}
				}

				else if ( this.arguments.length === 1 ) {
					code.insertRight( firstArgument.start, (context + ", ") );
				} else {
					if ( firstArgument.type === 'SpreadElement' ) {
						code.insertLeft( firstArgument.start, (context + ", ") );
					} else {
						code.insertLeft( firstArgument.start, (context + ", [ ") );
					}

					code.insertLeft( this.arguments[ this.arguments.length - 1 ].end, ' )' );
				}
			}
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return CallExpression;
}(Node));

function findIndex ( array, fn ) {
	for ( var i = 0; i < array.length; i += 1 ) {
		if ( fn( array[i], i ) ) return i;
	}

	return -1;
}

var reserved = Object.create( null );
'do if in for let new try var case else enum eval null this true void with await break catch class const false super throw while yield delete export import public return static switch typeof default extends finally package private continue debugger function arguments interface protected implements instanceof'.split( ' ' )
	.forEach( function ( word ) { return reserved[ word ] = true; } );

// TODO this code is pretty wild, tidy it up
var ClassBody = (function (Node$$1) {
	function ClassBody () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ClassBody.__proto__ = Node$$1;
	ClassBody.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ClassBody.prototype.constructor = ClassBody;

	ClassBody.prototype.transpile = function transpile ( code, transforms, inFunctionExpression, superName ) {
		var this$1 = this;

		if ( transforms.classes ) {
			var name = this.parent.name;

			var indentStr = code.getIndentString();
			var i0 = this.getIndentation() + ( inFunctionExpression ? indentStr : '' );
			var i1 = i0 + indentStr;

			var constructorIndex = findIndex( this.body, function ( node ) { return node.kind === 'constructor'; } );
			var constructor = this.body[ constructorIndex ];

			var introBlock = '';
			var outroBlock = '';

			if ( this.body.length ) {
				code.remove( this.start, this.body[0].start );
				code.remove( this.body[ this.body.length - 1 ].end, this.end );
			} else {
				code.remove( this.start, this.end );
			}

			if ( constructor ) {
				constructor.value.body.isConstructorBody = true;

				var previousMethod = this.body[ constructorIndex - 1 ];
				var nextMethod = this.body[ constructorIndex + 1 ];

				// ensure constructor is first
				if ( constructorIndex > 0 ) {
					code.remove( previousMethod.end, constructor.start );
					code.move( constructor.start, nextMethod ? nextMethod.start : this.end - 1, this.body[0].start );
				}

				if ( !inFunctionExpression ) code.insertLeft( constructor.end, ';' );
			}

			var namedFunctions = this.program.options.namedFunctionExpressions !== false;
			var namedConstructor = namedFunctions || this.parent.superClass || this.parent.type !== 'ClassDeclaration';
			if ( this.parent.superClass ) {
				var inheritanceBlock = "if ( " + superName + " ) " + name + ".__proto__ = " + superName + ";\n" + i0 + name + ".prototype = Object.create( " + superName + " && " + superName + ".prototype );\n" + i0 + name + ".prototype.constructor = " + name + ";";

				if ( constructor ) {
					introBlock += "\n\n" + i0 + inheritanceBlock;
				} else {
					var fn = "function " + name + " () {" + ( superName ?
						("\n" + i1 + superName + ".apply(this, arguments);\n" + i0 + "}") :
						"}" ) + ( inFunctionExpression ? '' : ';' ) + ( this.body.length ? ("\n\n" + i0) : '' );

					inheritanceBlock = fn + inheritanceBlock;
					introBlock += inheritanceBlock + "\n\n" + i0;
				}
			} else if ( !constructor ) {
				var fn$1 = 'function ' + (namedConstructor ? name + ' ' : '') + '() {}';
				if ( this.parent.type === 'ClassDeclaration' ) fn$1 += ';';
				if ( this.body.length ) fn$1 += "\n\n" + i0;

				introBlock += fn$1;
			}

			var scope = this.findScope( false );

			var prototypeGettersAndSetters = [];
			var staticGettersAndSetters = [];
			var prototypeAccessors;
			var staticAccessors;

			this.body.forEach( function ( method, i ) {
				if ( method.kind === 'constructor' ) {
					var constructorName = namedConstructor ? ' ' + name : '';
					code.overwrite( method.key.start, method.key.end, ("function" + constructorName) );
					return;
				}

				if ( method.static ) {
					var len = code.original[ method.start + 6 ] == ' ' ? 7 : 6;
					code.remove( method.start, method.start + len );
				}

				var isAccessor = method.kind !== 'method';
				var lhs;

				var methodName = method.key.name;
				if ( reserved[ methodName ] || method.value.body.scope.references[methodName] ) {
					methodName = scope.createIdentifier( methodName );
				}

				// when method name is a string or a number let's pretend it's a computed method

				var fake_computed = false;
				if ( ! method.computed && method.key.type === 'Literal' ) {
					fake_computed = true;
					method.computed = true;
				}

				if ( isAccessor ) {
					if ( method.computed ) {
						throw new Error( 'Computed accessor properties are not currently supported' );
					}

					code.remove( method.start, method.key.start );

					if ( method.static ) {
						if ( !~staticGettersAndSetters.indexOf( method.key.name ) ) staticGettersAndSetters.push( method.key.name );
						if ( !staticAccessors ) staticAccessors = scope.createIdentifier( 'staticAccessors' );

						lhs = "" + staticAccessors;
					} else {
						if ( !~prototypeGettersAndSetters.indexOf( method.key.name ) ) prototypeGettersAndSetters.push( method.key.name );
						if ( !prototypeAccessors ) prototypeAccessors = scope.createIdentifier( 'prototypeAccessors' );

						lhs = "" + prototypeAccessors;
					}
				} else {
					lhs = method.static ?
						("" + name) :
						(name + ".prototype");
				}

				if ( !method.computed ) lhs += '.';

				var insertNewlines = ( constructorIndex > 0 && i === constructorIndex + 1 ) ||
				                       ( i === 0 && constructorIndex === this$1.body.length - 1 );

				if ( insertNewlines ) lhs = "\n\n" + i0 + lhs;

				var c = method.key.end;
				if ( method.computed ) {
					if ( fake_computed ) {
						code.insertRight( method.key.start, '[' );
						code.insertLeft( method.key.end, ']' );
					} else {
						while ( code.original[c] !== ']' ) c += 1;
						c += 1;
					}
				}

				code.insertRight( method.start, lhs );

				var funcName = method.computed || isAccessor || !namedFunctions ? '' : (methodName + " ");
				var rhs = ( isAccessor ? ("." + (method.kind)) : '' ) + " = function" + ( method.value.generator ? '* ' : ' ' ) + funcName;
				code.remove( c, method.value.start );
				code.insertRight( method.value.start, rhs );
				code.insertLeft( method.end, ';' );

				if ( method.value.generator ) code.remove( method.start, method.key.start );
			});

			if ( prototypeGettersAndSetters.length || staticGettersAndSetters.length ) {
				var intro = [];
				var outro = [];

				if ( prototypeGettersAndSetters.length ) {
					intro.push( ("var " + prototypeAccessors + " = { " + (prototypeGettersAndSetters.map( function ( name ) { return (name + ": { configurable: true }"); } ).join( ',' )) + " };") );
					outro.push( ("Object.defineProperties( " + name + ".prototype, " + prototypeAccessors + " );") );
				}

				if ( staticGettersAndSetters.length ) {
					intro.push( ("var " + staticAccessors + " = { " + (staticGettersAndSetters.map( function ( name ) { return (name + ": { configurable: true }"); } ).join( ',' )) + " };") );
					outro.push( ("Object.defineProperties( " + name + ", " + staticAccessors + " );") );
				}

				if ( constructor ) introBlock += "\n\n" + i0;
				introBlock += intro.join( ("\n" + i0) );
				if ( !constructor ) introBlock += "\n\n" + i0;

				outroBlock += "\n\n" + i0 + outro.join( ("\n" + i0) );
			}

			if ( constructor ) {
				code.insertLeft( constructor.end, introBlock );
			} else {
				code.insertRight( this.start, introBlock );
			}

			code.insertLeft( this.end, outroBlock );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return ClassBody;
}(Node));

// TODO this function is slightly flawed – it works on the original string,
// not its current edited state.
// That's not a problem for the way that it's currently used, but it could
// be in future...
function deindent ( node, code ) {
	var start = node.start;
	var end = node.end;

	var indentStr = code.getIndentString();
	var indentStrLen = indentStr.length;
	var indentStart = start - indentStrLen;

	if ( !node.program.indentExclusions[ indentStart ]
	&& code.original.slice( indentStart, start ) === indentStr ) {
		code.remove( indentStart, start );
	}

	var pattern = new RegExp( indentStr + '\\S', 'g' );
	var slice = code.original.slice( start, end );
	var match;

	while ( match = pattern.exec( slice ) ) {
		var removeStart = start + match.index;
		if ( !node.program.indentExclusions[ removeStart ] ) {
			code.remove( removeStart, removeStart + indentStrLen );
		}
	}
}

var ClassDeclaration = (function (Node$$1) {
	function ClassDeclaration () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ClassDeclaration.__proto__ = Node$$1;
	ClassDeclaration.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ClassDeclaration.prototype.constructor = ClassDeclaration;

	ClassDeclaration.prototype.initialise = function initialise ( transforms ) {
		this.name = this.id.name;
		this.findScope( true ).addDeclaration( this.id, 'class' );

		Node$$1.prototype.initialise.call( this, transforms );
	};

	ClassDeclaration.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.classes ) {
			if ( !this.superClass ) deindent( this.body, code );

			var superName = this.superClass && ( this.superClass.name || 'superclass' );

			var i0 = this.getIndentation();
			var i1 = i0 + code.getIndentString();

			// if this is an export default statement, we have to move the export to
			// after the declaration, because `export default var Foo = ...` is illegal
			var syntheticDefaultExport = this.parent.type === 'ExportDefaultDeclaration' ?
				("\n\n" + i0 + "export default " + (this.id.name) + ";") :
				'';

			if ( syntheticDefaultExport ) code.remove( this.parent.start, this.start );

			code.overwrite( this.start, this.id.start, 'var ' );

			if ( this.superClass ) {
				if ( this.superClass.end === this.body.start ) {
					code.remove( this.id.end, this.superClass.start );
					code.insertLeft( this.id.end, (" = (function (" + superName + ") {\n" + i1) );
				} else {
					code.overwrite( this.id.end, this.superClass.start, ' = ' );
					code.overwrite( this.superClass.end, this.body.start, ("(function (" + superName + ") {\n" + i1) );
				}
			} else {
				if ( this.id.end === this.body.start ) {
					code.insertLeft( this.id.end, ' = ' );
				} else {
					code.overwrite( this.id.end, this.body.start, ' = ' );
				}
			}

			this.body.transpile( code, transforms, !!this.superClass, superName );

			if ( this.superClass ) {
				code.insertLeft( this.end, ("\n\n" + i1 + "return " + (this.name) + ";\n" + i0 + "}(") );
				code.move( this.superClass.start, this.superClass.end, this.end );
				code.insertRight( this.end, ("));" + syntheticDefaultExport) );
			} else if ( syntheticDefaultExport ) {
				code.insertRight( this.end, syntheticDefaultExport );
			}
		}

		else {
			this.body.transpile( code, transforms, false, null );
		}
	};

	return ClassDeclaration;
}(Node));

var ClassExpression = (function (Node$$1) {
	function ClassExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ClassExpression.__proto__ = Node$$1;
	ClassExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ClassExpression.prototype.constructor = ClassExpression;

	ClassExpression.prototype.initialise = function initialise ( transforms ) {
		this.name = this.id ? this.id.name :
		            this.parent.type === 'VariableDeclarator' ? this.parent.id.name :
		            this.parent.type === 'AssignmentExpression' ? this.parent.left.name :
		            this.findScope( true ).createIdentifier( 'anonymous' );

		Node$$1.prototype.initialise.call( this, transforms );
	};

	ClassExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.classes ) {
			var superName = this.superClass && ( this.superClass.name || 'superclass' );

			var i0 = this.getIndentation();
			var i1 = i0 + code.getIndentString();

			if ( this.superClass ) {
				code.remove( this.start, this.superClass.start );
				code.remove( this.superClass.end, this.body.start );
				code.insertLeft( this.start, ("(function (" + superName + ") {\n" + i1) );
			} else {
				code.overwrite( this.start, this.body.start, ("(function () {\n" + i1) );
			}

			this.body.transpile( code, transforms, true, superName );

			var outro = "\n\n" + i1 + "return " + (this.name) + ";\n" + i0 + "}(";

			if ( this.superClass ) {
				code.insertLeft( this.end, outro );
				code.move( this.superClass.start, this.superClass.end, this.end );
				code.insertRight( this.end, '))' );
			} else {
				code.insertLeft( this.end, ("\n\n" + i1 + "return " + (this.name) + ";\n" + i0 + "}())") );
			}
		}

		else {
			this.body.transpile( code, transforms, false );
		}
	};

	return ClassExpression;
}(Node));

var ContinueStatement = (function (Node$$1) {
	function ContinueStatement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ContinueStatement.__proto__ = Node$$1;
	ContinueStatement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ContinueStatement.prototype.constructor = ContinueStatement;

	ContinueStatement.prototype.transpile = function transpile ( code ) {
		var loop = this.findNearest( loopStatement );
		if ( loop.shouldRewriteAsFunction ) {
			if ( this.label ) throw new CompileError( this, 'Labels are not currently supported in a loop with locally-scoped variables' );
			code.overwrite( this.start, this.start + 8, 'return' );
		}
	};

	return ContinueStatement;
}(Node));

var ExportDefaultDeclaration = (function (Node$$1) {
	function ExportDefaultDeclaration () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ExportDefaultDeclaration.__proto__ = Node$$1;
	ExportDefaultDeclaration.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ExportDefaultDeclaration.prototype.constructor = ExportDefaultDeclaration;

	ExportDefaultDeclaration.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.moduleExport ) throw new CompileError( this, 'export is not supported' );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	return ExportDefaultDeclaration;
}(Node));

var ExportNamedDeclaration = (function (Node$$1) {
	function ExportNamedDeclaration () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ExportNamedDeclaration.__proto__ = Node$$1;
	ExportNamedDeclaration.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ExportNamedDeclaration.prototype.constructor = ExportNamedDeclaration;

	ExportNamedDeclaration.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.moduleExport ) throw new CompileError( this, 'export is not supported' );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	return ExportNamedDeclaration;
}(Node));

var LoopStatement = (function (Node$$1) {
	function LoopStatement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) LoopStatement.__proto__ = Node$$1;
	LoopStatement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	LoopStatement.prototype.constructor = LoopStatement;

	LoopStatement.prototype.findScope = function findScope ( functionScope ) {
		return functionScope || !this.createdScope ? this.parent.findScope( functionScope ) : this.body.scope;
	};

	LoopStatement.prototype.initialise = function initialise ( transforms ) {
		var this$1 = this;

		this.body.createScope();
		this.createdScope = true;

		// this is populated as and when reassignments occur
		this.reassigned = Object.create( null );
		this.aliases = Object.create( null );

		Node$$1.prototype.initialise.call( this, transforms );

		if ( transforms.letConst ) {
			// see if any block-scoped declarations are referenced
			// inside function expressions
			var names = Object.keys( this.body.scope.declarations );

			var i = names.length;
			while ( i-- ) {
				var name = names[i];
				var declaration = this$1.body.scope.declarations[ name ];

				var j = declaration.instances.length;
				while ( j-- ) {
					var instance = declaration.instances[j];
					var nearestFunctionExpression = instance.findNearest( /Function/ );

					if ( nearestFunctionExpression && nearestFunctionExpression.depth > this$1.depth ) {
						this$1.shouldRewriteAsFunction = true;
						break;
					}
				}

				if ( this$1.shouldRewriteAsFunction ) break;
			}
		}
	};

	LoopStatement.prototype.transpile = function transpile ( code, transforms ) {
		var needsBlock = this.type != 'ForOfStatement' && (
			this.body.type !== 'BlockStatement'
			|| this.body.type === 'BlockStatement' && this.body.synthetic );

		if ( this.shouldRewriteAsFunction ) {
			var i0 = this.getIndentation();
			var i1 = i0 + code.getIndentString();

			var argString = this.args ? (" " + (this.args.join( ', ' )) + " ") : '';
			var paramString = this.params ? (" " + (this.params.join( ', ' )) + " ") : '';

			var functionScope = this.findScope( true );
			var loop = functionScope.createIdentifier( 'loop' );

			var before = "var " + loop + " = function (" + paramString + ") " + ( this.body.synthetic ? ("{\n" + i0 + (code.getIndentString())) : '' );
			var after = ( this.body.synthetic ? ("\n" + i0 + "}") : '' ) + ";\n\n" + i0;

			code.insertRight( this.body.start, before );
			code.insertLeft( this.body.end, after );
			code.move( this.start, this.body.start, this.body.end );

			if ( this.canBreak || this.canReturn ) {
				var returned = functionScope.createIdentifier( 'returned' );

				var insert = "{\n" + i1 + "var " + returned + " = " + loop + "(" + argString + ");\n";
				if ( this.canBreak ) insert += "\n" + i1 + "if ( " + returned + " === 'break' ) break;";
				if ( this.canReturn ) insert += "\n" + i1 + "if ( " + returned + " ) return " + returned + ".v;";
				insert += "\n" + i0 + "}";

				code.insertRight( this.body.end, insert );
			} else {
				var callExpression = loop + "(" + argString + ");";

				if ( this.type === 'DoWhileStatement' ) {
					code.overwrite( this.start, this.body.start, ("do {\n" + i1 + callExpression + "\n" + i0 + "}") );
				} else {
					code.insertRight( this.body.end, callExpression );
				}
			}
		} else if ( needsBlock ) {
			code.insertLeft( this.body.start, '{ ' );
			code.insertRight( this.body.end, ' }' );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return LoopStatement;
}(Node));

function extractNames ( node ) {
	var names = [];
	extractors[ node.type ]( names, node );
	return names;
}

var extractors = {
	Identifier: function Identifier ( names, node ) {
		names.push( node );
	},

	ObjectPattern: function ObjectPattern ( names, node ) {
		for ( var i = 0, list = node.properties; i < list.length; i += 1 ) {
			var prop = list[i];

			extractors[ prop.value.type ]( names, prop.value );
		}
	},

	ArrayPattern: function ArrayPattern ( names, node ) {
		for ( var i = 0, list = node.elements; i < list.length; i += 1 )  {
			var element = list[i];

			if ( element ) extractors[ element.type ]( names, element );
		}
	},

	RestElement: function RestElement ( names, node ) {
		extractors[ node.argument.type ]( names, node.argument );
	},

	AssignmentPattern: function AssignmentPattern ( names, node ) {
		extractors[ node.left.type ]( names, node.left );
	}
};

var ForStatement = (function (LoopStatement$$1) {
	function ForStatement () {
		LoopStatement$$1.apply(this, arguments);
	}

	if ( LoopStatement$$1 ) ForStatement.__proto__ = LoopStatement$$1;
	ForStatement.prototype = Object.create( LoopStatement$$1 && LoopStatement$$1.prototype );
	ForStatement.prototype.constructor = ForStatement;

	ForStatement.prototype.findScope = function findScope ( functionScope ) {
		return functionScope || !this.createdScope ? this.parent.findScope( functionScope ) : this.body.scope;
	};

	ForStatement.prototype.transpile = function transpile ( code, transforms ) {
		var this$1 = this;

		var i1 = this.getIndentation() + code.getIndentString();

		if ( this.shouldRewriteAsFunction ) {
			// which variables are declared in the init statement?
			var names = this.init.type === 'VariableDeclaration' ?
				[].concat.apply( [], this.init.declarations.map( function ( declarator ) { return extractNames( declarator.id ); } ) ) :
				[];

			var aliases = this.aliases;

			this.args = names.map( function ( name ) { return name in this$1.aliases ? this$1.aliases[ name ].outer : name; } );
			this.params = names.map( function ( name ) { return name in this$1.aliases ? this$1.aliases[ name ].inner : name; } );

			var updates = Object.keys( this.reassigned )
				.map( function ( name ) { return ((aliases[ name ].outer) + " = " + (aliases[ name ].inner) + ";"); } );

			if ( updates.length ) {
				if ( this.body.synthetic ) {
					code.insertLeft( this.body.body[0].end, ("; " + (updates.join(" "))) );
				} else {
					var lastStatement = this.body.body[ this.body.body.length - 1 ];
					code.insertLeft( lastStatement.end, ("\n\n" + i1 + (updates.join(("\n" + i1)))) );
				}
			}
		}

		LoopStatement$$1.prototype.transpile.call( this, code, transforms );
	};

	return ForStatement;
}(LoopStatement));

var ForInStatement = (function (LoopStatement$$1) {
	function ForInStatement () {
		LoopStatement$$1.apply(this, arguments);
	}

	if ( LoopStatement$$1 ) ForInStatement.__proto__ = LoopStatement$$1;
	ForInStatement.prototype = Object.create( LoopStatement$$1 && LoopStatement$$1.prototype );
	ForInStatement.prototype.constructor = ForInStatement;

	ForInStatement.prototype.findScope = function findScope ( functionScope ) {
		return functionScope || !this.createdScope ? this.parent.findScope( functionScope ) : this.body.scope;
	};

	ForInStatement.prototype.transpile = function transpile ( code, transforms ) {
		var this$1 = this;

		if ( this.shouldRewriteAsFunction ) {
			// which variables are declared in the init statement?
			var names = this.left.type === 'VariableDeclaration' ?
				[].concat.apply( [], this.left.declarations.map( function ( declarator ) { return extractNames( declarator.id ); } ) ) :
				[];

			this.args = names.map( function ( name ) { return name in this$1.aliases ? this$1.aliases[ name ].outer : name; } );
			this.params = names.map( function ( name ) { return name in this$1.aliases ? this$1.aliases[ name ].inner : name; } );
		}

		LoopStatement$$1.prototype.transpile.call( this, code, transforms );
	};

	return ForInStatement;
}(LoopStatement));

var handlers = {
	Identifier: destructureIdentifier,
	AssignmentPattern: destructureAssignmentPattern,
	ArrayPattern: destructureArrayPattern,
	ObjectPattern: destructureObjectPattern
};

function destructure ( code, scope, node, ref, inline, statementGenerators ) {
	handlers[ node.type ]( code, scope, node, ref, inline, statementGenerators );
}

function destructureIdentifier ( code, scope, node, ref, inline, statementGenerators ) {
	statementGenerators.push( function ( start, prefix, suffix ) {
		code.insertRight( node.start, inline ? prefix : (prefix + "var ") );
		code.insertLeft( node.end, (" = " + ref + suffix) );
		code.move( node.start, node.end, start );
	});
}

function destructureAssignmentPattern ( code, scope, node, ref, inline, statementGenerators ) {
	var isIdentifier = node.left.type === 'Identifier';
	var name = isIdentifier ? node.left.name : ref;

	if ( !inline ) {
		statementGenerators.push( function ( start, prefix, suffix ) {
			code.insertRight( node.left.end, (prefix + "if ( " + name + " === void 0 ) " + name) );
			code.move( node.left.end, node.right.end, start );
			code.insertLeft( node.right.end, suffix );
		});
	}

	if ( !isIdentifier ) {
		destructure( code, scope, node.left, ref, inline, statementGenerators );
	}
}

function destructureArrayPattern ( code, scope, node, ref, inline, statementGenerators ) {
	var c = node.start;

	node.elements.forEach( function ( element, i ) {
		if ( !element ) return;

		if ( element.type === 'RestElement' ) {
			handleProperty( code, scope, c, element.argument, (ref + ".slice(" + i + ")"), inline, statementGenerators );
		} else {
			handleProperty( code, scope, c, element, (ref + "[" + i + "]"), inline, statementGenerators );
		}
		c = element.end;
	});

	code.remove( c, node.end );
}

function destructureObjectPattern ( code, scope, node, ref, inline, statementGenerators ) {
	var c = node.start;

	node.properties.forEach( function ( prop ) {
		var value = prop.computed || prop.key.type !== 'Identifier' ? (ref + "[" + (code.slice(prop.key.start, prop.key.end)) + "]") : (ref + "." + (prop.key.name));
		handleProperty( code, scope, c, prop.value, value, inline, statementGenerators );
		c = prop.end;
	});

	code.remove( c, node.end );
}

function handleProperty ( code, scope, c, node, value, inline, statementGenerators ) {
	switch ( node.type ) {
		case 'Identifier': {
			code.remove( c, node.start );
			destructureIdentifier( code, scope, node, value, inline, statementGenerators );
			break;
		}

		case 'AssignmentPattern': {
			var name;

			var isIdentifier = node.left.type === 'Identifier';

			if ( isIdentifier ) {
				name = node.left.name;
				var declaration = scope.findDeclaration( name );
				if ( declaration ) name = declaration.name;
			} else {
				name = scope.createIdentifier( value );
			}

			statementGenerators.push( function ( start, prefix, suffix ) {
				if ( inline ) {
					code.insertRight( node.right.start, (name + " = " + value + " === undefined ? ") );
					code.insertLeft( node.right.end, (" : " + value) );
				} else {
					code.insertRight( node.right.start, (prefix + "var " + name + " = " + value + "; if ( " + name + " === void 0 ) " + name + " = ") );
					code.insertLeft( node.right.end, suffix );
				}

				code.move( node.right.start, node.right.end, start );
			});

			if ( isIdentifier ) {
				code.remove( c, node.right.start );
			} else {
				code.remove( c, node.left.start );
				code.remove( node.left.end, node.right.start );
				handleProperty( code, scope, c, node.left, name, inline, statementGenerators );
			}

			break;
		}

		case 'ObjectPattern': {
			code.remove( c, c = node.start );

			if ( node.properties.length > 1 ) {
				var ref = scope.createIdentifier( value );

				statementGenerators.push( function ( start, prefix, suffix ) {
					// this feels a tiny bit hacky, but we can't do a
					// straightforward insertLeft and keep correct order...
					code.insertRight( node.start, (prefix + "var " + ref + " = ") );
					code.overwrite( node.start, c = node.start + 1, value );
					code.insertLeft( c, suffix );

					code.move( node.start, c, start );
				});

				node.properties.forEach( function ( prop ) {
					var value = prop.computed || prop.key.type !== 'Identifier' ? (ref + "[" + (code.slice(prop.key.start, prop.key.end)) + "]") : (ref + "." + (prop.key.name));
					handleProperty( code, scope, c, prop.value, value, inline, statementGenerators );
					c = prop.end;
				});
			} else {
				var prop = node.properties[0];
				var value_suffix = prop.computed || prop.key.type !== 'Identifier' ? ("[" + (code.slice(prop.key.start, prop.key.end)) + "]") : ("." + (prop.key.name));
				handleProperty( code, scope, c, prop.value, ("" + value + value_suffix), inline, statementGenerators );
				c = prop.end;
			}

			code.remove( c, node.end );
			break;
		}

		case 'ArrayPattern': {
			code.remove( c, c = node.start );

			if ( node.elements.filter( Boolean ).length > 1 ) {
				var ref$1 = scope.createIdentifier( value );

				statementGenerators.push( function ( start, prefix, suffix ) {
					code.insertRight( node.start, (prefix + "var " + ref$1 + " = ") );
					code.overwrite( node.start, c = node.start + 1, value );
					code.insertLeft( c, suffix );

					code.move( node.start, c, start );
				});

				node.elements.forEach( function ( element, i ) {
					if ( !element ) return;

					if ( element.type === 'RestElement' ) {
						handleProperty( code, scope, c, element.argument, (ref$1 + ".slice(" + i + ")"), inline, statementGenerators );
					} else {
						handleProperty( code, scope, c, element, (ref$1 + "[" + i + "]"), inline, statementGenerators );
					}
					c = element.end;
				});
			} else {
				var index = findIndex( node.elements, Boolean );
				var element = node.elements[ index ];
				if ( element.type === 'RestElement' ) {
					handleProperty( code, scope, c, element.argument, (value + ".slice(" + index + ")"), inline, statementGenerators );
				} else {
					handleProperty( code, scope, c, element, (value + "[" + index + "]"), inline, statementGenerators );
				}
				c = element.end;
			}

			code.remove( c, node.end );
			break;
		}

		default: {
			throw new Error( ("Unexpected node type in destructuring (" + (node.type) + ")") );
		}
	}
}

var ForOfStatement = (function (LoopStatement$$1) {
	function ForOfStatement () {
		LoopStatement$$1.apply(this, arguments);
	}

	if ( LoopStatement$$1 ) ForOfStatement.__proto__ = LoopStatement$$1;
	ForOfStatement.prototype = Object.create( LoopStatement$$1 && LoopStatement$$1.prototype );
	ForOfStatement.prototype.constructor = ForOfStatement;

	ForOfStatement.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.forOf && !transforms.dangerousForOf ) throw new CompileError( this, 'for...of statements are not supported. Use `transforms: { forOf: false }` to skip transformation and disable this error, or `transforms: { dangerousForOf: true }` if you know what you\'re doing' );
		LoopStatement$$1.prototype.initialise.call( this, transforms );
	};

	ForOfStatement.prototype.transpile = function transpile ( code, transforms ) {
		if ( !transforms.dangerousForOf ) {
			LoopStatement$$1.prototype.transpile.call( this, code, transforms );
			return;
		}

		// edge case (#80)
		if ( !this.body.body[0] ) {
			if ( this.left.type === 'VariableDeclaration' && this.left.kind === 'var' ) {
				code.remove( this.start, this.left.start );
				code.insertLeft( this.left.end, ';' );
				code.remove( this.left.end, this.end );
			} else {
				code.remove( this.start, this.end );
			}

			return;
		}

		var scope = this.findScope( true );
		var i0 = this.getIndentation();
		var i1 = i0 + code.getIndentString();

		var key = scope.createIdentifier( 'i' );
		var list = scope.createIdentifier( 'list' );

		if ( this.body.synthetic ) {
			code.insertRight( this.left.start, ("{\n" + i1) );
			code.insertLeft( this.body.body[0].end, ("\n" + i0 + "}") );
		}

		var bodyStart = this.body.body[0].start;

		code.remove( this.left.end, this.right.start );
		code.move( this.left.start, this.left.end, bodyStart );


		code.insertRight( this.right.start, ("var " + key + " = 0, " + list + " = ") );
		code.insertLeft( this.right.end, ("; " + key + " < " + list + ".length; " + key + " += 1") );

		// destructuring. TODO non declaration destructuring
		var declarator = this.left.type === 'VariableDeclaration' && this.left.declarations[0];
		if ( declarator && declarator.id.type !== 'Identifier' ) {
			var statementGenerators = [];
			var ref = scope.createIdentifier( 'ref' );
			destructure( code, scope, declarator.id, ref, false, statementGenerators );

			var suffix = ";\n" + i1;
			statementGenerators.forEach( function ( fn, i ) {
				if ( i === statementGenerators.length - 1 ) {
					suffix = ";\n\n" + i1;
				}

				fn( bodyStart, '', suffix );
			});

			code.insertLeft( this.left.start + this.left.kind.length + 1, ref );
			code.insertLeft( this.left.end, (" = " + list + "[" + key + "];\n" + i1) );
		} else {
			code.insertLeft( this.left.end, (" = " + list + "[" + key + "];\n\n" + i1) );
		}

		LoopStatement$$1.prototype.transpile.call( this, code, transforms );
	};

	return ForOfStatement;
}(LoopStatement));

var FunctionDeclaration = (function (Node$$1) {
	function FunctionDeclaration () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) FunctionDeclaration.__proto__ = Node$$1;
	FunctionDeclaration.prototype = Object.create( Node$$1 && Node$$1.prototype );
	FunctionDeclaration.prototype.constructor = FunctionDeclaration;

	FunctionDeclaration.prototype.initialise = function initialise ( transforms ) {
		if ( this.generator && transforms.generator ) {
			throw new CompileError( this, 'Generators are not supported' );
		}

		this.body.createScope();

		this.findScope( true ).addDeclaration( this.id, 'function' );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	return FunctionDeclaration;
}(Node));

var FunctionExpression = (function (Node$$1) {
	function FunctionExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) FunctionExpression.__proto__ = Node$$1;
	FunctionExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	FunctionExpression.prototype.constructor = FunctionExpression;

	FunctionExpression.prototype.initialise = function initialise ( transforms ) {
		if ( this.generator && transforms.generator ) {
			throw new CompileError( this, 'Generators are not supported' );
		}

		this.body.createScope();

		if ( this.id ) {
			// function expression IDs belong to the child scope...
			this.body.scope.addDeclaration( this.id, 'function' );
		}

		Node$$1.prototype.initialise.call( this, transforms );

		var parent = this.parent;
		var methodName;

		if ( transforms.conciseMethodProperty
				&& parent.type === 'Property'
				&& parent.kind === 'init'
				&& parent.method
				&& parent.key.type === 'Identifier' ) {
			// object literal concise method
			methodName = parent.key.name;
		}
		else if ( transforms.classes
				&& parent.type === 'MethodDefinition'
				&& parent.kind === 'method'
				&& parent.key.type === 'Identifier' ) {
			// method definition in a class
			methodName = parent.key.name;
		}
		else if ( this.id && this.id.type === 'Identifier' ) {
			// naked function expression
			methodName = this.id.alias || this.id.name;
		}

		if ( methodName ) {
			for ( var i = 0, list = this.params; i < list.length; i += 1 ) {
				var param = list[i];

				if ( param.type === 'Identifier' && methodName === param.name ) {
					// workaround for Safari 9/WebKit bug:
					// https://gitlab.com/Rich-Harris/buble/issues/154
					// change parameter name when same as method name

					var scope = this.body.scope;
					var declaration = scope.declarations[ methodName ];

					var alias = scope.createIdentifier( methodName );
					param.alias = alias;

					for ( var i$1 = 0, list$1 = declaration.instances; i$1 < list$1.length; i$1 += 1 ) {
						var identifier = list$1[i$1];

						identifier.alias = alias;
					}

					break;
				}
			}
		}
	};

	return FunctionExpression;
}(Node));

function isReference ( node, parent ) {
	if ( node.type === 'MemberExpression' ) {
		return !node.computed && isReference( node.object, node );
	}

	if ( node.type === 'Identifier' ) {
		// the only time we could have an identifier node without a parent is
		// if it's the entire body of a function without a block statement –
		// i.e. an arrow function expression like `a => a`
		if ( !parent ) return true;

		if ( /(Function|Class)Expression/.test( parent.type ) ) return false;

		if ( parent.type === 'VariableDeclarator' ) return node === parent.init;

		// TODO is this right?
		if ( parent.type === 'MemberExpression' || parent.type === 'MethodDefinition' ) {
			return parent.computed || node === parent.object;
		}

		if ( parent.type === 'ArrayPattern' ) return false;

		// disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
		if ( parent.type === 'Property' ) {
			if ( parent.parent.type === 'ObjectPattern' ) return false;
			return parent.computed || node === parent.value;
		}

		// disregard the `bar` in `class Foo { bar () {...} }`
		if ( parent.type === 'MethodDefinition' ) return false;

		// disregard the `bar` in `export { foo as bar }`
		if ( parent.type === 'ExportSpecifier' && node !== parent.local ) return false;

		return true;
	}
}

var Identifier = (function (Node$$1) {
	function Identifier () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) Identifier.__proto__ = Node$$1;
	Identifier.prototype = Object.create( Node$$1 && Node$$1.prototype );
	Identifier.prototype.constructor = Identifier;

	Identifier.prototype.findScope = function findScope ( functionScope ) {
		if ( this.parent.params && ~this.parent.params.indexOf( this ) ) {
			return this.parent.body.scope;
		}

		if ( this.parent.type === 'FunctionExpression' && this === this.parent.id ) {
			return this.parent.body.scope;
		}

		return this.parent.findScope( functionScope	);
	};

	Identifier.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.arrow && isReference( this, this.parent ) ) {
			if ( this.name === 'arguments' && !this.findScope( false ).contains( this.name ) ) {
				var lexicalBoundary = this.findLexicalBoundary();
				var arrowFunction = this.findNearest( 'ArrowFunctionExpression' );
				var loop = this.findNearest( loopStatement );

				if ( arrowFunction && arrowFunction.depth > lexicalBoundary.depth ) {
					this.alias = lexicalBoundary.getArgumentsAlias();
				}

				if ( loop && loop.body.contains( this ) && loop.depth > lexicalBoundary.depth ) {
					this.alias = lexicalBoundary.getArgumentsAlias();
				}
			}

			this.findScope( false ).addReference( this );
		}
	};

	Identifier.prototype.transpile = function transpile ( code ) {
		if ( this.alias ) {
			code.overwrite( this.start, this.end, this.alias, true );
		}
	};

	return Identifier;
}(Node));

var IfStatement = (function (Node$$1) {
	function IfStatement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) IfStatement.__proto__ = Node$$1;
	IfStatement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	IfStatement.prototype.constructor = IfStatement;

	IfStatement.prototype.initialise = function initialise ( transforms ) {
		Node$$1.prototype.initialise.call( this, transforms );
	};

	IfStatement.prototype.transpile = function transpile ( code, transforms ) {
		if ( this.consequent.type !== 'BlockStatement'
				|| this.consequent.type === 'BlockStatement' && this.consequent.synthetic ) {
			code.insertLeft( this.consequent.start, '{ ' );
			code.insertRight( this.consequent.end, ' }' );
		}

		if ( this.alternate && this.alternate.type !== 'IfStatement' && (
				this.alternate.type !== 'BlockStatement'
				|| this.alternate.type === 'BlockStatement' && this.alternate.synthetic ) ) {
			code.insertLeft( this.alternate.start, '{ ' );
			code.insertRight( this.alternate.end, ' }' );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return IfStatement;
}(Node));

var ImportDeclaration = (function (Node$$1) {
	function ImportDeclaration () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ImportDeclaration.__proto__ = Node$$1;
	ImportDeclaration.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ImportDeclaration.prototype.constructor = ImportDeclaration;

	ImportDeclaration.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.moduleImport ) throw new CompileError( this, 'import is not supported' );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	return ImportDeclaration;
}(Node));

var ImportDefaultSpecifier = (function (Node$$1) {
	function ImportDefaultSpecifier () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ImportDefaultSpecifier.__proto__ = Node$$1;
	ImportDefaultSpecifier.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ImportDefaultSpecifier.prototype.constructor = ImportDefaultSpecifier;

	ImportDefaultSpecifier.prototype.initialise = function initialise ( transforms ) {
		this.findScope( true ).addDeclaration( this.local, 'import' );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	return ImportDefaultSpecifier;
}(Node));

var ImportSpecifier = (function (Node$$1) {
	function ImportSpecifier () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ImportSpecifier.__proto__ = Node$$1;
	ImportSpecifier.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ImportSpecifier.prototype.constructor = ImportSpecifier;

	ImportSpecifier.prototype.initialise = function initialise ( transforms ) {
		this.findScope( true ).addDeclaration( this.local, 'import' );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	return ImportSpecifier;
}(Node));

var hasDashes = function ( val ) { return /-/.test(val); };

var formatKey = function ( key ) { return hasDashes(key) ? ("'" + key + "'") : key; };

var formatVal = function ( val ) { return val ? '' : 'true'; };

var JSXAttribute = (function (Node$$1) {
	function JSXAttribute () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) JSXAttribute.__proto__ = Node$$1;
	JSXAttribute.prototype = Object.create( Node$$1 && Node$$1.prototype );
	JSXAttribute.prototype.constructor = JSXAttribute;

	JSXAttribute.prototype.transpile = function transpile ( code, transforms ) {
		var ref	= this.name;
		var start = ref.start;
		var name = ref.name;

		// Overwrite equals sign if value is present.
		var end = this.value ? this.value.start : this.name.end;

		code.overwrite( start, end, ((formatKey(name)) + ": " + (formatVal(this.value))) );

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return JSXAttribute;
}(Node));

function containsNewLine ( node ) {
	return node.type === 'Literal' && !/\S/.test( node.value ) && /\n/.test( node.value );
}

var JSXClosingElement = (function (Node$$1) {
	function JSXClosingElement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) JSXClosingElement.__proto__ = Node$$1;
	JSXClosingElement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	JSXClosingElement.prototype.constructor = JSXClosingElement;

	JSXClosingElement.prototype.transpile = function transpile ( code ) {
		var spaceBeforeParen = true;

		var lastChild = this.parent.children[ this.parent.children.length - 1 ];

		// omit space before closing paren if
		//   a) this is on a separate line, or
		//   b) there are no children but there are attributes
		if ( ( lastChild && containsNewLine( lastChild ) ) || ( this.parent.openingElement.attributes.length ) ) {
			spaceBeforeParen = false;
		}

		code.overwrite( this.start, this.end, spaceBeforeParen ? ' )' : ')' );
	};

	return JSXClosingElement;
}(Node));

function normalise ( str, removeTrailingWhitespace ) {
	if ( removeTrailingWhitespace && /\n/.test( str ) ) {
		str = str.replace( /\s+$/, '' );
	}

	str = str
		.replace( /^\n\r?\s+/, '' )       // remove leading newline + space
		.replace( /\s*\n\r?\s*/gm, ' ' ); // replace newlines with spaces

	// TODO prefer single quotes?
	return JSON.stringify( str );
}

var JSXElement = (function (Node$$1) {
	function JSXElement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) JSXElement.__proto__ = Node$$1;
	JSXElement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	JSXElement.prototype.constructor = JSXElement;

	JSXElement.prototype.transpile = function transpile ( code, transforms ) {
		Node$$1.prototype.transpile.call( this, code, transforms );

		var children = this.children.filter( function ( child ) {
			if ( child.type !== 'Literal' ) return true;

			// remove whitespace-only literals, unless on a single line
			return /\S/.test( child.value ) || !/\n/.test( child.value );
		});

		if ( children.length ) {
			var c = this.openingElement.end;

			var i;
			for ( i = 0; i < children.length; i += 1 ) {
				var child = children[i];

				if ( child.type === 'JSXExpressionContainer' && child.expression.type === 'JSXEmptyExpression' ) {
					// empty block is a no op
				} else {
					var tail = code.original[ c ] === '\n' && child.type !== 'Literal' ? '' : ' ';
					code.insertLeft( c, ("," + tail) );
				}

				if ( child.type === 'Literal' ) {
					var str = normalise( child.value, i === children.length - 1 );
					code.overwrite( child.start, child.end, str );
				}

				c = child.end;
			}
		}
	};

	return JSXElement;
}(Node));

var JSXExpressionContainer = (function (Node$$1) {
	function JSXExpressionContainer () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) JSXExpressionContainer.__proto__ = Node$$1;
	JSXExpressionContainer.prototype = Object.create( Node$$1 && Node$$1.prototype );
	JSXExpressionContainer.prototype.constructor = JSXExpressionContainer;

	JSXExpressionContainer.prototype.transpile = function transpile ( code, transforms ) {
		code.remove( this.start, this.expression.start );
		code.remove( this.expression.end, this.end );

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return JSXExpressionContainer;
}(Node));

var JSXOpeningElement = (function (Node$$1) {
	function JSXOpeningElement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) JSXOpeningElement.__proto__ = Node$$1;
	JSXOpeningElement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	JSXOpeningElement.prototype.constructor = JSXOpeningElement;

	JSXOpeningElement.prototype.transpile = function transpile ( code, transforms ) {
		var this$1 = this;

		code.overwrite( this.start, this.name.start, ((this.program.jsx) + "( ") );

		var html = this.name.type === 'JSXIdentifier' && this.name.name[0] === this.name.name[0].toLowerCase();
		if ( html ) code.insertRight( this.name.start, "'" );

		var len = this.attributes.length;
		var c = this.name.end;

		if ( len ) {
			var i;

			var hasSpread = false;
			for ( i = 0; i < len; i += 1 ) {
				if ( this$1.attributes[i].type === 'JSXSpreadAttribute' ) {
					hasSpread = true;
					break;
				}
			}

			c = this.attributes[0].end;

			for ( i = 0; i < len; i += 1 ) {
				var attr = this$1.attributes[i];

				if ( i > 0 ) {
					if ( attr.start === c )
						code.insertRight( c, ', ' );
					else
						code.overwrite( c, attr.start, ', ' );
				}

				if ( hasSpread && attr.type !== 'JSXSpreadAttribute' ) {
					var lastAttr = this$1.attributes[ i - 1 ];
					var nextAttr = this$1.attributes[ i + 1 ];

					if ( !lastAttr || lastAttr.type === 'JSXSpreadAttribute' ) {
						code.insertRight( attr.start, '{ ' );
					}

					if ( !nextAttr || nextAttr.type === 'JSXSpreadAttribute' ) {
						code.insertLeft( attr.end, ' }' );
					}
				}

				c = attr.end;
			}

			var after;
			var before;
			if ( hasSpread ) {
				if ( len === 1 ) {
					before = html ? "'," : ',';
				} else {
					if (!this.program.options.objectAssign) {
						throw new CompileError( this, 'Mixed JSX attributes ending in spread requires specified objectAssign option with \'Object.assign\' or polyfill helper.' );
					}
					before = html ? ("', " + (this.program.options.objectAssign) + "({},") : (", " + (this.program.options.objectAssign) + "({},");
					after = ')';
				}
			} else {
				before = html ? "', {" : ', {';
				after = ' }';
			}

			code.insertRight( this.name.end, before );

			if ( after ) {
				code.insertLeft( this.attributes[ len - 1 ].end, after );
			}
		} else {
			code.insertLeft( this.name.end, html ? "', null" : ", null" );
			c = this.name.end;
		}

		Node$$1.prototype.transpile.call( this, code, transforms );

		if ( this.selfClosing ) {
			code.overwrite( c, this.end, this.attributes.length ? ")" : " )" );
		} else {
			code.remove( c, this.end );
		}
	};

	return JSXOpeningElement;
}(Node));

var JSXSpreadAttribute = (function (Node$$1) {
	function JSXSpreadAttribute () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) JSXSpreadAttribute.__proto__ = Node$$1;
	JSXSpreadAttribute.prototype = Object.create( Node$$1 && Node$$1.prototype );
	JSXSpreadAttribute.prototype.constructor = JSXSpreadAttribute;

	JSXSpreadAttribute.prototype.transpile = function transpile ( code, transforms ) {
		code.remove( this.start, this.argument.start );
		code.remove( this.argument.end, this.end );

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return JSXSpreadAttribute;
}(Node));

var regenerate = __commonjs(function (module, exports, global) {
/*! https://mths.be/regenerate v1.3.3 by @mathias | MIT license */
(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js/io.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var ERRORS = {
		'rangeOrder': 'A range\u2019s `stop` value must be greater than or equal ' +
			'to the `start` value.',
		'codePointRange': 'Invalid code point value. Code points range from ' +
			'U+000000 to U+10FFFF.'
	};

	// https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs
	var HIGH_SURROGATE_MIN = 0xD800;
	var HIGH_SURROGATE_MAX = 0xDBFF;
	var LOW_SURROGATE_MIN = 0xDC00;
	var LOW_SURROGATE_MAX = 0xDFFF;

	// In Regenerate output, `\0` is never preceded by `\` because we sort by
	// code point value, so let’s keep this regular expression simple.
	var regexNull = /\\x00([^0123456789]|$)/g;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var extend = function(destination, source) {
		var key;
		for (key in source) {
			if (hasOwnProperty.call(source, key)) {
				destination[key] = source[key];
			}
		}
		return destination;
	};

	var forEach = function(array, callback) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			callback(array[index], index);
		}
	};

	var toString = object.toString;
	var isArray = function(value) {
		return toString.call(value) == '[object Array]';
	};
	var isNumber = function(value) {
		return typeof value == 'number' ||
			toString.call(value) == '[object Number]';
	};

	// This assumes that `number` is a positive integer that `toString()`s nicely
	// (which is the case for all code point values).
	var zeroes = '0000';
	var pad = function(number, totalCharacters) {
		var string = String(number);
		return string.length < totalCharacters
			? (zeroes + string).slice(-totalCharacters)
			: string;
	};

	var hex = function(number) {
		return Number(number).toString(16).toUpperCase();
	};

	var slice = [].slice;

	/*--------------------------------------------------------------------------*/

	var dataFromCodePoints = function(codePoints) {
		var index = -1;
		var length = codePoints.length;
		var max = length - 1;
		var result = [];
		var isStart = true;
		var tmp;
		var previous = 0;
		while (++index < length) {
			tmp = codePoints[index];
			if (isStart) {
				result.push(tmp);
				previous = tmp;
				isStart = false;
			} else {
				if (tmp == previous + 1) {
					if (index != max) {
						previous = tmp;
						continue;
					} else {
						isStart = true;
						result.push(tmp + 1);
					}
				} else {
					// End the previous range and start a new one.
					result.push(previous + 1, tmp);
					previous = tmp;
				}
			}
		}
		if (!isStart) {
			result.push(tmp + 1);
		}
		return result;
	};

	var dataRemove = function(data, codePoint) {
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var length = data.length;
		while (index < length) {
			start = data[index];
			end = data[index + 1];
			if (codePoint >= start && codePoint < end) {
				// Modify this pair.
				if (codePoint == start) {
					if (end == start + 1) {
						// Just remove `start` and `end`.
						data.splice(index, 2);
						return data;
					} else {
						// Just replace `start` with a new value.
						data[index] = codePoint + 1;
						return data;
					}
				} else if (codePoint == end - 1) {
					// Just replace `end` with a new value.
					data[index + 1] = codePoint;
					return data;
				} else {
					// Replace `[start, end]` with `[startA, endA, startB, endB]`.
					data.splice(index, 2, start, codePoint, codePoint + 1, end);
					return data;
				}
			}
			index += 2;
		}
		return data;
	};

	var dataRemoveRange = function(data, rangeStart, rangeEnd) {
		if (rangeEnd < rangeStart) {
			throw Error(ERRORS.rangeOrder);
		}
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		while (index < data.length) {
			start = data[index];
			end = data[index + 1] - 1; // Note: the `- 1` makes `end` inclusive.

			// Exit as soon as no more matching pairs can be found.
			if (start > rangeEnd) {
				return data;
			}

			// Check if this range pair is equal to, or forms a subset of, the range
			// to be removed.
			// E.g. we have `[0, 11, 40, 51]` and want to remove 0-10 → `[40, 51]`.
			// E.g. we have `[40, 51]` and want to remove 0-100 → `[]`.
			if (rangeStart <= start && rangeEnd >= end) {
				// Remove this pair.
				data.splice(index, 2);
				continue;
			}

			// Check if both `rangeStart` and `rangeEnd` are within the bounds of
			// this pair.
			// E.g. we have `[0, 11]` and want to remove 4-6 → `[0, 4, 7, 11]`.
			if (rangeStart >= start && rangeEnd < end) {
				if (rangeStart == start) {
					// Replace `[start, end]` with `[startB, endB]`.
					data[index] = rangeEnd + 1;
					data[index + 1] = end + 1;
					return data;
				}
				// Replace `[start, end]` with `[startA, endA, startB, endB]`.
				data.splice(index, 2, start, rangeStart, rangeEnd + 1, end + 1);
				return data;
			}

			// Check if only `rangeStart` is within the bounds of this pair.
			// E.g. we have `[0, 11]` and want to remove 4-20 → `[0, 4]`.
			if (rangeStart >= start && rangeStart <= end) {
				// Replace `end` with `rangeStart`.
				data[index + 1] = rangeStart;
				// Note: we cannot `return` just yet, in case any following pairs still
				// contain matching code points.
				// E.g. we have `[0, 11, 14, 31]` and want to remove 4-20
				// → `[0, 4, 21, 31]`.
			}

			// Check if only `rangeEnd` is within the bounds of this pair.
			// E.g. we have `[14, 31]` and want to remove 4-20 → `[21, 31]`.
			else if (rangeEnd >= start && rangeEnd <= end) {
				// Just replace `start`.
				data[index] = rangeEnd + 1;
				return data;
			}

			index += 2;
		}
		return data;
	};

	 var dataAdd = function(data, codePoint) {
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var lastIndex = null;
		var length = data.length;
		if (codePoint < 0x0 || codePoint > 0x10FFFF) {
			throw RangeError(ERRORS.codePointRange);
		}
		while (index < length) {
			start = data[index];
			end = data[index + 1];

			// Check if the code point is already in the set.
			if (codePoint >= start && codePoint < end) {
				return data;
			}

			if (codePoint == start - 1) {
				// Just replace `start` with a new value.
				data[index] = codePoint;
				return data;
			}

			// At this point, if `start` is `greater` than `codePoint`, insert a new
			// `[start, end]` pair before the current pair, or after the current pair
			// if there is a known `lastIndex`.
			if (start > codePoint) {
				data.splice(
					lastIndex != null ? lastIndex + 2 : 0,
					0,
					codePoint,
					codePoint + 1
				);
				return data;
			}

			if (codePoint == end) {
				// Check if adding this code point causes two separate ranges to become
				// a single range, e.g. `dataAdd([0, 4, 5, 10], 4)` → `[0, 10]`.
				if (codePoint + 1 == data[index + 2]) {
					data.splice(index, 4, start, data[index + 3]);
					return data;
				}
				// Else, just replace `end` with a new value.
				data[index + 1] = codePoint + 1;
				return data;
			}
			lastIndex = index;
			index += 2;
		}
		// The loop has finished; add the new pair to the end of the data set.
		data.push(codePoint, codePoint + 1);
		return data;
	};

	var dataAddData = function(dataA, dataB) {
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var data = dataA.slice();
		var length = dataB.length;
		while (index < length) {
			start = dataB[index];
			end = dataB[index + 1] - 1;
			if (start == end) {
				data = dataAdd(data, start);
			} else {
				data = dataAddRange(data, start, end);
			}
			index += 2;
		}
		return data;
	};

	var dataRemoveData = function(dataA, dataB) {
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var data = dataA.slice();
		var length = dataB.length;
		while (index < length) {
			start = dataB[index];
			end = dataB[index + 1] - 1;
			if (start == end) {
				data = dataRemove(data, start);
			} else {
				data = dataRemoveRange(data, start, end);
			}
			index += 2;
		}
		return data;
	};

	var dataAddRange = function(data, rangeStart, rangeEnd) {
		if (rangeEnd < rangeStart) {
			throw Error(ERRORS.rangeOrder);
		}
		if (
			rangeStart < 0x0 || rangeStart > 0x10FFFF ||
			rangeEnd < 0x0 || rangeEnd > 0x10FFFF
		) {
			throw RangeError(ERRORS.codePointRange);
		}
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var added = false;
		var length = data.length;
		while (index < length) {
			start = data[index];
			end = data[index + 1];

			if (added) {
				// The range has already been added to the set; at this point, we just
				// need to get rid of the following ranges in case they overlap.

				// Check if this range can be combined with the previous range.
				if (start == rangeEnd + 1) {
					data.splice(index - 1, 2);
					return data;
				}

				// Exit as soon as no more possibly overlapping pairs can be found.
				if (start > rangeEnd) {
					return data;
				}

				// E.g. `[0, 11, 12, 16]` and we’ve added 5-15, so we now have
				// `[0, 16, 12, 16]`. Remove the `12,16` part, as it lies within the
				// `0,16` range that was previously added.
				if (start >= rangeStart && start <= rangeEnd) {
					// `start` lies within the range that was previously added.

					if (end > rangeStart && end - 1 <= rangeEnd) {
						// `end` lies within the range that was previously added as well,
						// so remove this pair.
						data.splice(index, 2);
						index -= 2;
						// Note: we cannot `return` just yet, as there may still be other
						// overlapping pairs.
					} else {
						// `start` lies within the range that was previously added, but
						// `end` doesn’t. E.g. `[0, 11, 12, 31]` and we’ve added 5-15, so
						// now we have `[0, 16, 12, 31]`. This must be written as `[0, 31]`.
						// Remove the previously added `end` and the current `start`.
						data.splice(index - 1, 2);
						index -= 2;
					}

					// Note: we cannot return yet.
				}

			}

			else if (start == rangeEnd + 1) {
				data[index] = rangeStart;
				return data;
			}

			// Check if a new pair must be inserted *before* the current one.
			else if (start > rangeEnd) {
				data.splice(index, 0, rangeStart, rangeEnd + 1);
				return data;
			}

			else if (rangeStart >= start && rangeStart < end && rangeEnd + 1 <= end) {
				// The new range lies entirely within an existing range pair. No action
				// needed.
				return data;
			}

			else if (
				// E.g. `[0, 11]` and you add 5-15 → `[0, 16]`.
				(rangeStart >= start && rangeStart < end) ||
				// E.g. `[0, 3]` and you add 3-6 → `[0, 7]`.
				end == rangeStart
			) {
				// Replace `end` with the new value.
				data[index + 1] = rangeEnd + 1;
				// Make sure the next range pair doesn’t overlap, e.g. `[0, 11, 12, 14]`
				// and you add 5-15 → `[0, 16]`, i.e. remove the `12,14` part.
				added = true;
				// Note: we cannot `return` just yet.
			}

			else if (rangeStart <= start && rangeEnd + 1 >= end) {
				// The new range is a superset of the old range.
				data[index] = rangeStart;
				data[index + 1] = rangeEnd + 1;
				added = true;
			}

			index += 2;
		}
		// The loop has finished without doing anything; add the new pair to the end
		// of the data set.
		if (!added) {
			data.push(rangeStart, rangeEnd + 1);
		}
		return data;
	};

	var dataContains = function(data, codePoint) {
		var index = 0;
		var length = data.length;
		// Exit early if `codePoint` is not within `data`’s overall range.
		var start = data[index];
		var end = data[length - 1];
		if (length >= 2) {
			if (codePoint < start || codePoint > end) {
				return false;
			}
		}
		// Iterate over the data per `(start, end)` pair.
		while (index < length) {
			start = data[index];
			end = data[index + 1];
			if (codePoint >= start && codePoint < end) {
				return true;
			}
			index += 2;
		}
		return false;
	};

	var dataIntersection = function(data, codePoints) {
		var index = 0;
		var length = codePoints.length;
		var codePoint;
		var result = [];
		while (index < length) {
			codePoint = codePoints[index];
			if (dataContains(data, codePoint)) {
				result.push(codePoint);
			}
			++index;
		}
		return dataFromCodePoints(result);
	};

	var dataIsEmpty = function(data) {
		return !data.length;
	};

	var dataIsSingleton = function(data) {
		// Check if the set only represents a single code point.
		return data.length == 2 && data[0] + 1 == data[1];
	};

	var dataToArray = function(data) {
		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var result = [];
		var length = data.length;
		while (index < length) {
			start = data[index];
			end = data[index + 1];
			while (start < end) {
				result.push(start);
				++start;
			}
			index += 2;
		}
		return result;
	};

	/*--------------------------------------------------------------------------*/

	// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
	var floor = Math.floor;
	var highSurrogate = function(codePoint) {
		return parseInt(
			floor((codePoint - 0x10000) / 0x400) + HIGH_SURROGATE_MIN,
			10
		);
	};

	var lowSurrogate = function(codePoint) {
		return parseInt(
			(codePoint - 0x10000) % 0x400 + LOW_SURROGATE_MIN,
			10
		);
	};

	var stringFromCharCode = String.fromCharCode;
	var codePointToString = function(codePoint) {
		var string;
		// https://mathiasbynens.be/notes/javascript-escapes#single
		// Note: the `\b` escape sequence for U+0008 BACKSPACE in strings has a
		// different meaning in regular expressions (word boundary), so it cannot
		// be used here.
		if (codePoint == 0x09) {
			string = '\\t';
		}
		// Note: IE < 9 treats `'\v'` as `'v'`, so avoid using it.
		// else if (codePoint == 0x0B) {
		// 	string = '\\v';
		// }
		else if (codePoint == 0x0A) {
			string = '\\n';
		}
		else if (codePoint == 0x0C) {
			string = '\\f';
		}
		else if (codePoint == 0x0D) {
			string = '\\r';
		}
		else if (codePoint == 0x5C) {
			string = '\\\\';
		}
		else if (
			codePoint == 0x24 ||
			(codePoint >= 0x28 && codePoint <= 0x2B) ||
			(codePoint >= 0x2D && codePoint <= 0x2F) ||
			codePoint == 0x3F ||
			(codePoint >= 0x5B && codePoint <= 0x5E) ||
			(codePoint >= 0x7B && codePoint <= 0x7D)
		) {
			// The code point maps to an unsafe printable ASCII character;
			// backslash-escape it. Here’s the list of those symbols:
			//
			//     $()*+-./?[\]^{|}
			//
			// See #7 for more info.
			string = '\\' + stringFromCharCode(codePoint);
		}
		else if (codePoint >= 0x20 && codePoint <= 0x7E) {
			// The code point maps to one of these printable ASCII symbols
			// (including the space character):
			//
			//      !"#%&',/0123456789:;<=>@ABCDEFGHIJKLMNO
			//     PQRSTUVWXYZ_`abcdefghijklmnopqrstuvwxyz~
			//
			// These can safely be used directly.
			string = stringFromCharCode(codePoint);
		}
		else if (codePoint <= 0xFF) {
			// https://mathiasbynens.be/notes/javascript-escapes#hexadecimal
			string = '\\x' + pad(hex(codePoint), 2);
		}
		else { // `codePoint <= 0xFFFF` holds true.
			// https://mathiasbynens.be/notes/javascript-escapes#unicode
			string = '\\u' + pad(hex(codePoint), 4);
		}

		// There’s no need to account for astral symbols / surrogate pairs here,
		// since `codePointToString` is private and only used for BMP code points.
		// But if that’s what you need, just add an `else` block with this code:
		//
		//     string = '\\u' + pad(hex(highSurrogate(codePoint)), 4)
		//     	+ '\\u' + pad(hex(lowSurrogate(codePoint)), 4);

		return string;
	};

	var codePointToStringUnicode = function(codePoint) {
		if (codePoint <= 0xFFFF) {
			return codePointToString(codePoint);
		}
		return '\\u{' + codePoint.toString(16).toUpperCase() + '}';
	};

	var symbolToCodePoint = function(symbol) {
		var length = symbol.length;
		var first = symbol.charCodeAt(0);
		var second;
		if (
			first >= HIGH_SURROGATE_MIN && first <= HIGH_SURROGATE_MAX &&
			length > 1 // There is a next code unit.
		) {
			// `first` is a high surrogate, and there is a next character. Assume
			// it’s a low surrogate (else it’s invalid usage of Regenerate anyway).
			second = symbol.charCodeAt(1);
			// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			return (first - HIGH_SURROGATE_MIN) * 0x400 +
				second - LOW_SURROGATE_MIN + 0x10000;
		}
		return first;
	};

	var createBMPCharacterClasses = function(data) {
		// Iterate over the data per `(start, end)` pair.
		var result = '';
		var index = 0;
		var start;
		var end;
		var length = data.length;
		if (dataIsSingleton(data)) {
			return codePointToString(data[0]);
		}
		while (index < length) {
			start = data[index];
			end = data[index + 1] - 1; // Note: the `- 1` makes `end` inclusive.
			if (start == end) {
				result += codePointToString(start);
			} else if (start + 1 == end) {
				result += codePointToString(start) + codePointToString(end);
			} else {
				result += codePointToString(start) + '-' + codePointToString(end);
			}
			index += 2;
		}
		return '[' + result + ']';
	};

	var createUnicodeCharacterClasses = function(data) {
		// Iterate over the data per `(start, end)` pair.
		var result = '';
		var index = 0;
		var start;
		var end;
		var length = data.length;
		if (dataIsSingleton(data)) {
			return codePointToStringUnicode(data[0]);
		}
		while (index < length) {
			start = data[index];
			end = data[index + 1] - 1; // Note: the `- 1` makes `end` inclusive.
			if (start == end) {
				result += codePointToStringUnicode(start);
			} else if (start + 1 == end) {
				result += codePointToStringUnicode(start) + codePointToStringUnicode(end);
			} else {
				result += codePointToStringUnicode(start) + '-' + codePointToStringUnicode(end);
			}
			index += 2;
		}
		return '[' + result + ']';
	};

	var splitAtBMP = function(data) {
		// Iterate over the data per `(start, end)` pair.
		var loneHighSurrogates = [];
		var loneLowSurrogates = [];
		var bmp = [];
		var astral = [];
		var index = 0;
		var start;
		var end;
		var length = data.length;
		while (index < length) {
			start = data[index];
			end = data[index + 1] - 1; // Note: the `- 1` makes `end` inclusive.

			if (start < HIGH_SURROGATE_MIN) {

				// The range starts and ends before the high surrogate range.
				// E.g. (0, 0x10).
				if (end < HIGH_SURROGATE_MIN) {
					bmp.push(start, end + 1);
				}

				// The range starts before the high surrogate range and ends within it.
				// E.g. (0, 0xD855).
				if (end >= HIGH_SURROGATE_MIN && end <= HIGH_SURROGATE_MAX) {
					bmp.push(start, HIGH_SURROGATE_MIN);
					loneHighSurrogates.push(HIGH_SURROGATE_MIN, end + 1);
				}

				// The range starts before the high surrogate range and ends in the low
				// surrogate range. E.g. (0, 0xDCFF).
				if (end >= LOW_SURROGATE_MIN && end <= LOW_SURROGATE_MAX) {
					bmp.push(start, HIGH_SURROGATE_MIN);
					loneHighSurrogates.push(HIGH_SURROGATE_MIN, HIGH_SURROGATE_MAX + 1);
					loneLowSurrogates.push(LOW_SURROGATE_MIN, end + 1);
				}

				// The range starts before the high surrogate range and ends after the
				// low surrogate range. E.g. (0, 0x10FFFF).
				if (end > LOW_SURROGATE_MAX) {
					bmp.push(start, HIGH_SURROGATE_MIN);
					loneHighSurrogates.push(HIGH_SURROGATE_MIN, HIGH_SURROGATE_MAX + 1);
					loneLowSurrogates.push(LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1);
					if (end <= 0xFFFF) {
						bmp.push(LOW_SURROGATE_MAX + 1, end + 1);
					} else {
						bmp.push(LOW_SURROGATE_MAX + 1, 0xFFFF + 1);
						astral.push(0xFFFF + 1, end + 1);
					}
				}

			} else if (start >= HIGH_SURROGATE_MIN && start <= HIGH_SURROGATE_MAX) {

				// The range starts and ends in the high surrogate range.
				// E.g. (0xD855, 0xD866).
				if (end >= HIGH_SURROGATE_MIN && end <= HIGH_SURROGATE_MAX) {
					loneHighSurrogates.push(start, end + 1);
				}

				// The range starts in the high surrogate range and ends in the low
				// surrogate range. E.g. (0xD855, 0xDCFF).
				if (end >= LOW_SURROGATE_MIN && end <= LOW_SURROGATE_MAX) {
					loneHighSurrogates.push(start, HIGH_SURROGATE_MAX + 1);
					loneLowSurrogates.push(LOW_SURROGATE_MIN, end + 1);
				}

				// The range starts in the high surrogate range and ends after the low
				// surrogate range. E.g. (0xD855, 0x10FFFF).
				if (end > LOW_SURROGATE_MAX) {
					loneHighSurrogates.push(start, HIGH_SURROGATE_MAX + 1);
					loneLowSurrogates.push(LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1);
					if (end <= 0xFFFF) {
						bmp.push(LOW_SURROGATE_MAX + 1, end + 1);
					} else {
						bmp.push(LOW_SURROGATE_MAX + 1, 0xFFFF + 1);
						astral.push(0xFFFF + 1, end + 1);
					}
				}

			} else if (start >= LOW_SURROGATE_MIN && start <= LOW_SURROGATE_MAX) {

				// The range starts and ends in the low surrogate range.
				// E.g. (0xDCFF, 0xDDFF).
				if (end >= LOW_SURROGATE_MIN && end <= LOW_SURROGATE_MAX) {
					loneLowSurrogates.push(start, end + 1);
				}

				// The range starts in the low surrogate range and ends after the low
				// surrogate range. E.g. (0xDCFF, 0x10FFFF).
				if (end > LOW_SURROGATE_MAX) {
					loneLowSurrogates.push(start, LOW_SURROGATE_MAX + 1);
					if (end <= 0xFFFF) {
						bmp.push(LOW_SURROGATE_MAX + 1, end + 1);
					} else {
						bmp.push(LOW_SURROGATE_MAX + 1, 0xFFFF + 1);
						astral.push(0xFFFF + 1, end + 1);
					}
				}

			} else if (start > LOW_SURROGATE_MAX && start <= 0xFFFF) {

				// The range starts and ends after the low surrogate range.
				// E.g. (0xFFAA, 0x10FFFF).
				if (end <= 0xFFFF) {
					bmp.push(start, end + 1);
				} else {
					bmp.push(start, 0xFFFF + 1);
					astral.push(0xFFFF + 1, end + 1);
				}

			} else {

				// The range starts and ends in the astral range.
				astral.push(start, end + 1);

			}

			index += 2;
		}
		return {
			'loneHighSurrogates': loneHighSurrogates,
			'loneLowSurrogates': loneLowSurrogates,
			'bmp': bmp,
			'astral': astral
		};
	};

	var optimizeSurrogateMappings = function(surrogateMappings) {
		var result = [];
		var tmpLow = [];
		var addLow = false;
		var mapping;
		var nextMapping;
		var highSurrogates;
		var lowSurrogates;
		var nextHighSurrogates;
		var nextLowSurrogates;
		var index = -1;
		var length = surrogateMappings.length;
		while (++index < length) {
			mapping = surrogateMappings[index];
			nextMapping = surrogateMappings[index + 1];
			if (!nextMapping) {
				result.push(mapping);
				continue;
			}
			highSurrogates = mapping[0];
			lowSurrogates = mapping[1];
			nextHighSurrogates = nextMapping[0];
			nextLowSurrogates = nextMapping[1];

			// Check for identical high surrogate ranges.
			tmpLow = lowSurrogates;
			while (
				nextHighSurrogates &&
				highSurrogates[0] == nextHighSurrogates[0] &&
				highSurrogates[1] == nextHighSurrogates[1]
			) {
				// Merge with the next item.
				if (dataIsSingleton(nextLowSurrogates)) {
					tmpLow = dataAdd(tmpLow, nextLowSurrogates[0]);
				} else {
					tmpLow = dataAddRange(
						tmpLow,
						nextLowSurrogates[0],
						nextLowSurrogates[1] - 1
					);
				}
				++index;
				mapping = surrogateMappings[index];
				highSurrogates = mapping[0];
				lowSurrogates = mapping[1];
				nextMapping = surrogateMappings[index + 1];
				nextHighSurrogates = nextMapping && nextMapping[0];
				nextLowSurrogates = nextMapping && nextMapping[1];
				addLow = true;
			}
			result.push([
				highSurrogates,
				addLow ? tmpLow : lowSurrogates
			]);
			addLow = false;
		}
		return optimizeByLowSurrogates(result);
	};

	var optimizeByLowSurrogates = function(surrogateMappings) {
		if (surrogateMappings.length == 1) {
			return surrogateMappings;
		}
		var index = -1;
		var innerIndex = -1;
		while (++index < surrogateMappings.length) {
			var mapping = surrogateMappings[index];
			var lowSurrogates = mapping[1];
			var lowSurrogateStart = lowSurrogates[0];
			var lowSurrogateEnd = lowSurrogates[1];
			innerIndex = index; // Note: the loop starts at the next index.
			while (++innerIndex < surrogateMappings.length) {
				var otherMapping = surrogateMappings[innerIndex];
				var otherLowSurrogates = otherMapping[1];
				var otherLowSurrogateStart = otherLowSurrogates[0];
				var otherLowSurrogateEnd = otherLowSurrogates[1];
				if (
					lowSurrogateStart == otherLowSurrogateStart &&
					lowSurrogateEnd == otherLowSurrogateEnd
				) {
					// Add the code points in the other item to this one.
					if (dataIsSingleton(otherMapping[0])) {
						mapping[0] = dataAdd(mapping[0], otherMapping[0][0]);
					} else {
						mapping[0] = dataAddRange(
							mapping[0],
							otherMapping[0][0],
							otherMapping[0][1] - 1
						);
					}
					// Remove the other, now redundant, item.
					surrogateMappings.splice(innerIndex, 1);
					--innerIndex;
				}
			}
		}
		return surrogateMappings;
	};

	var surrogateSet = function(data) {
		// Exit early if `data` is an empty set.
		if (!data.length) {
			return [];
		}

		// Iterate over the data per `(start, end)` pair.
		var index = 0;
		var start;
		var end;
		var startHigh;
		var startLow;
		var endHigh;
		var endLow;
		var surrogateMappings = [];
		var length = data.length;
		while (index < length) {
			start = data[index];
			end = data[index + 1] - 1;

			startHigh = highSurrogate(start);
			startLow = lowSurrogate(start);
			endHigh = highSurrogate(end);
			endLow = lowSurrogate(end);

			var startsWithLowestLowSurrogate = startLow == LOW_SURROGATE_MIN;
			var endsWithHighestLowSurrogate = endLow == LOW_SURROGATE_MAX;
			var complete = false;

			// Append the previous high-surrogate-to-low-surrogate mappings.
			// Step 1: `(startHigh, startLow)` to `(startHigh, LOW_SURROGATE_MAX)`.
			if (
				startHigh == endHigh ||
				startsWithLowestLowSurrogate && endsWithHighestLowSurrogate
			) {
				surrogateMappings.push([
					[startHigh, endHigh + 1],
					[startLow, endLow + 1]
				]);
				complete = true;
			} else {
				surrogateMappings.push([
					[startHigh, startHigh + 1],
					[startLow, LOW_SURROGATE_MAX + 1]
				]);
			}

			// Step 2: `(startHigh + 1, LOW_SURROGATE_MIN)` to
			// `(endHigh - 1, LOW_SURROGATE_MAX)`.
			if (!complete && startHigh + 1 < endHigh) {
				if (endsWithHighestLowSurrogate) {
					// Combine step 2 and step 3.
					surrogateMappings.push([
						[startHigh + 1, endHigh + 1],
						[LOW_SURROGATE_MIN, endLow + 1]
					]);
					complete = true;
				} else {
					surrogateMappings.push([
						[startHigh + 1, endHigh],
						[LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1]
					]);
				}
			}

			// Step 3. `(endHigh, LOW_SURROGATE_MIN)` to `(endHigh, endLow)`.
			if (!complete) {
				surrogateMappings.push([
					[endHigh, endHigh + 1],
					[LOW_SURROGATE_MIN, endLow + 1]
				]);
			}

			index += 2;
		}

		// The format of `surrogateMappings` is as follows:
		//
		//     [ surrogateMapping1, surrogateMapping2 ]
		//
		// i.e.:
		//
		//     [
		//       [ highSurrogates1, lowSurrogates1 ],
		//       [ highSurrogates2, lowSurrogates2 ]
		//     ]
		return optimizeSurrogateMappings(surrogateMappings);
	};

	var createSurrogateCharacterClasses = function(surrogateMappings) {
		var result = [];
		forEach(surrogateMappings, function(surrogateMapping) {
			var highSurrogates = surrogateMapping[0];
			var lowSurrogates = surrogateMapping[1];
			result.push(
				createBMPCharacterClasses(highSurrogates) +
				createBMPCharacterClasses(lowSurrogates)
			);
		});
		return result.join('|');
	};

	var createCharacterClassesFromData = function(data, bmpOnly, hasUnicodeFlag) {
		if (hasUnicodeFlag) {
			return createUnicodeCharacterClasses(data);
		}
		var result = [];

		var parts = splitAtBMP(data);
		var loneHighSurrogates = parts.loneHighSurrogates;
		var loneLowSurrogates = parts.loneLowSurrogates;
		var bmp = parts.bmp;
		var astral = parts.astral;
		var hasLoneHighSurrogates = !dataIsEmpty(loneHighSurrogates);
		var hasLoneLowSurrogates = !dataIsEmpty(loneLowSurrogates);

		var surrogateMappings = surrogateSet(astral);

		if (bmpOnly) {
			bmp = dataAddData(bmp, loneHighSurrogates);
			hasLoneHighSurrogates = false;
			bmp = dataAddData(bmp, loneLowSurrogates);
			hasLoneLowSurrogates = false;
		}

		if (!dataIsEmpty(bmp)) {
			// The data set contains BMP code points that are not high surrogates
			// needed for astral code points in the set.
			result.push(createBMPCharacterClasses(bmp));
		}
		if (surrogateMappings.length) {
			// The data set contains astral code points; append character classes
			// based on their surrogate pairs.
			result.push(createSurrogateCharacterClasses(surrogateMappings));
		}
		// https://gist.github.com/mathiasbynens/bbe7f870208abcfec860
		if (hasLoneHighSurrogates) {
			result.push(
				createBMPCharacterClasses(loneHighSurrogates) +
				// Make sure the high surrogates aren’t part of a surrogate pair.
				'(?![\\uDC00-\\uDFFF])'
			);
		}
		if (hasLoneLowSurrogates) {
			result.push(
				// It is not possible to accurately assert the low surrogates aren’t
				// part of a surrogate pair, since JavaScript regular expressions do
				// not support lookbehind.
				'(?:[^\\uD800-\\uDBFF]|^)' +
				createBMPCharacterClasses(loneLowSurrogates)
			);
		}
		return result.join('|');
	};

	/*--------------------------------------------------------------------------*/

	// `regenerate` can be used as a constructor (and new methods can be added to
	// its prototype) but also as a regular function, the latter of which is the
	// documented and most common usage. For that reason, it’s not capitalized.
	var regenerate = function(value) {
		if (arguments.length > 1) {
			value = slice.call(arguments);
		}
		if (this instanceof regenerate) {
			this.data = [];
			return value ? this.add(value) : this;
		}
		return (new regenerate).add(value);
	};

	regenerate.version = '1.3.3';

	var proto = regenerate.prototype;
	extend(proto, {
		'add': function(value) {
			var $this = this;
			if (value == null) {
				return $this;
			}
			if (value instanceof regenerate) {
				// Allow passing other Regenerate instances.
				$this.data = dataAddData($this.data, value.data);
				return $this;
			}
			if (arguments.length > 1) {
				value = slice.call(arguments);
			}
			if (isArray(value)) {
				forEach(value, function(item) {
					$this.add(item);
				});
				return $this;
			}
			$this.data = dataAdd(
				$this.data,
				isNumber(value) ? value : symbolToCodePoint(value)
			);
			return $this;
		},
		'remove': function(value) {
			var $this = this;
			if (value == null) {
				return $this;
			}
			if (value instanceof regenerate) {
				// Allow passing other Regenerate instances.
				$this.data = dataRemoveData($this.data, value.data);
				return $this;
			}
			if (arguments.length > 1) {
				value = slice.call(arguments);
			}
			if (isArray(value)) {
				forEach(value, function(item) {
					$this.remove(item);
				});
				return $this;
			}
			$this.data = dataRemove(
				$this.data,
				isNumber(value) ? value : symbolToCodePoint(value)
			);
			return $this;
		},
		'addRange': function(start, end) {
			var $this = this;
			$this.data = dataAddRange($this.data,
				isNumber(start) ? start : symbolToCodePoint(start),
				isNumber(end) ? end : symbolToCodePoint(end)
			);
			return $this;
		},
		'removeRange': function(start, end) {
			var $this = this;
			var startCodePoint = isNumber(start) ? start : symbolToCodePoint(start);
			var endCodePoint = isNumber(end) ? end : symbolToCodePoint(end);
			$this.data = dataRemoveRange(
				$this.data,
				startCodePoint,
				endCodePoint
			);
			return $this;
		},
		'intersection': function(argument) {
			var $this = this;
			// Allow passing other Regenerate instances.
			// TODO: Optimize this by writing and using `dataIntersectionData()`.
			var array = argument instanceof regenerate ?
				dataToArray(argument.data) :
				argument;
			$this.data = dataIntersection($this.data, array);
			return $this;
		},
		'contains': function(codePoint) {
			return dataContains(
				this.data,
				isNumber(codePoint) ? codePoint : symbolToCodePoint(codePoint)
			);
		},
		'clone': function() {
			var set = new regenerate;
			set.data = this.data.slice(0);
			return set;
		},
		'toString': function(options) {
			var result = createCharacterClassesFromData(
				this.data,
				options ? options.bmpOnly : false,
				options ? options.hasUnicodeFlag : false
			);
			if (!result) {
				// For an empty set, return something that can be inserted `/here/` to
				// form a valid regular expression. Avoid `(?:)` since that matches the
				// empty string.
				return '[]';
			}
			// Use `\0` instead of `\x00` where possible.
			return result.replace(regexNull, '\\0$1');
		},
		'toRegExp': function(flags) {
			var pattern = this.toString(
				flags && flags.indexOf('u') != -1 ?
					{ 'hasUnicodeFlag': true } :
					null
			);
			return RegExp(pattern, flags || '');
		},
		'valueOf': function() { // Note: `valueOf` is aliased as `toArray`.
			return dataToArray(this.data);
		}
	});

	proto.toArray = proto.valueOf;

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return regenerate;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = regenerate;
		} else { // in Narwhal or RingoJS v0.7.0-
			freeExports.regenerate = regenerate;
		}
	} else { // in Rhino or a web browser
		root.regenerate = regenerate;
	}

}(__commonjs_global));
});

var require$$0$3 = (regenerate && typeof regenerate === 'object' && 'default' in regenerate ? regenerate['default'] : regenerate);

var characterClassEscapeSets = __commonjs(function (module, exports) {
// Generated by `/scripts/character-class-escape-sets.js`. Do not edit.
var regenerate = require$$0$3;

exports.REGULAR = {
	'd': regenerate()
		.addRange(0x30, 0x39),
	'D': regenerate()
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0xFFFF),
	's': regenerate(0x20, 0xA0, 0x1680, 0x202F, 0x205F, 0x3000, 0xFEFF)
		.addRange(0x9, 0xD)
		.addRange(0x2000, 0x200A)
		.addRange(0x2028, 0x2029),
	'S': regenerate()
		.addRange(0x0, 0x8)
		.addRange(0xE, 0x1F)
		.addRange(0x21, 0x9F)
		.addRange(0xA1, 0x167F)
		.addRange(0x1681, 0x1FFF)
		.addRange(0x200B, 0x2027)
		.addRange(0x202A, 0x202E)
		.addRange(0x2030, 0x205E)
		.addRange(0x2060, 0x2FFF)
		.addRange(0x3001, 0xFEFE)
		.addRange(0xFF00, 0xFFFF),
	'w': regenerate(0x5F)
		.addRange(0x30, 0x39)
		.addRange(0x41, 0x5A)
		.addRange(0x61, 0x7A),
	'W': regenerate(0x60)
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x40)
		.addRange(0x5B, 0x5E)
		.addRange(0x7B, 0xFFFF)
};

exports.UNICODE = {
	'd': regenerate()
		.addRange(0x30, 0x39),
	'D': regenerate()
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x10FFFF),
	's': regenerate(0x20, 0xA0, 0x1680, 0x202F, 0x205F, 0x3000, 0xFEFF)
		.addRange(0x9, 0xD)
		.addRange(0x2000, 0x200A)
		.addRange(0x2028, 0x2029),
	'S': regenerate()
		.addRange(0x0, 0x8)
		.addRange(0xE, 0x1F)
		.addRange(0x21, 0x9F)
		.addRange(0xA1, 0x167F)
		.addRange(0x1681, 0x1FFF)
		.addRange(0x200B, 0x2027)
		.addRange(0x202A, 0x202E)
		.addRange(0x2030, 0x205E)
		.addRange(0x2060, 0x2FFF)
		.addRange(0x3001, 0xFEFE)
		.addRange(0xFF00, 0x10FFFF),
	'w': regenerate(0x5F)
		.addRange(0x30, 0x39)
		.addRange(0x41, 0x5A)
		.addRange(0x61, 0x7A),
	'W': regenerate(0x60)
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x40)
		.addRange(0x5B, 0x5E)
		.addRange(0x7B, 0x10FFFF)
};

exports.UNICODE_IGNORE_CASE = {
	'd': regenerate()
		.addRange(0x30, 0x39),
	'D': regenerate()
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x10FFFF),
	's': regenerate(0x20, 0xA0, 0x1680, 0x202F, 0x205F, 0x3000, 0xFEFF)
		.addRange(0x9, 0xD)
		.addRange(0x2000, 0x200A)
		.addRange(0x2028, 0x2029),
	'S': regenerate()
		.addRange(0x0, 0x8)
		.addRange(0xE, 0x1F)
		.addRange(0x21, 0x9F)
		.addRange(0xA1, 0x167F)
		.addRange(0x1681, 0x1FFF)
		.addRange(0x200B, 0x2027)
		.addRange(0x202A, 0x202E)
		.addRange(0x2030, 0x205E)
		.addRange(0x2060, 0x2FFF)
		.addRange(0x3001, 0xFEFE)
		.addRange(0xFF00, 0x10FFFF),
	'w': regenerate(0x5F, 0x17F, 0x212A)
		.addRange(0x30, 0x39)
		.addRange(0x41, 0x5A)
		.addRange(0x61, 0x7A),
	'W': regenerate(0x4B, 0x53, 0x60)
		.addRange(0x0, 0x2F)
		.addRange(0x3A, 0x40)
		.addRange(0x5B, 0x5E)
		.addRange(0x7B, 0x10FFFF)
};
});

var require$$0$2 = (characterClassEscapeSets && typeof characterClassEscapeSets === 'object' && 'default' in characterClassEscapeSets ? characterClassEscapeSets['default'] : characterClassEscapeSets);

var require$$1 = {
	"75": 8490,
	"83": 383,
	"107": 8490,
	"115": 383,
	"181": 924,
	"197": 8491,
	"383": 83,
	"452": 453,
	"453": 452,
	"455": 456,
	"456": 455,
	"458": 459,
	"459": 458,
	"497": 498,
	"498": 497,
	"837": 8126,
	"914": 976,
	"917": 1013,
	"920": 1012,
	"921": 8126,
	"922": 1008,
	"924": 181,
	"928": 982,
	"929": 1009,
	"931": 962,
	"934": 981,
	"937": 8486,
	"962": 931,
	"976": 914,
	"977": 1012,
	"981": 934,
	"982": 928,
	"1008": 922,
	"1009": 929,
	"1012": [920,977],
	"1013": 917,
	"7776": 7835,
	"7835": 7776,
	"8126": [837,921],
	"8486": 937,
	"8490": 75,
	"8491": 197,
	"66560": 66600,
	"66561": 66601,
	"66562": 66602,
	"66563": 66603,
	"66564": 66604,
	"66565": 66605,
	"66566": 66606,
	"66567": 66607,
	"66568": 66608,
	"66569": 66609,
	"66570": 66610,
	"66571": 66611,
	"66572": 66612,
	"66573": 66613,
	"66574": 66614,
	"66575": 66615,
	"66576": 66616,
	"66577": 66617,
	"66578": 66618,
	"66579": 66619,
	"66580": 66620,
	"66581": 66621,
	"66582": 66622,
	"66583": 66623,
	"66584": 66624,
	"66585": 66625,
	"66586": 66626,
	"66587": 66627,
	"66588": 66628,
	"66589": 66629,
	"66590": 66630,
	"66591": 66631,
	"66592": 66632,
	"66593": 66633,
	"66594": 66634,
	"66595": 66635,
	"66596": 66636,
	"66597": 66637,
	"66598": 66638,
	"66599": 66639,
	"66600": 66560,
	"66601": 66561,
	"66602": 66562,
	"66603": 66563,
	"66604": 66564,
	"66605": 66565,
	"66606": 66566,
	"66607": 66567,
	"66608": 66568,
	"66609": 66569,
	"66610": 66570,
	"66611": 66571,
	"66612": 66572,
	"66613": 66573,
	"66614": 66574,
	"66615": 66575,
	"66616": 66576,
	"66617": 66577,
	"66618": 66578,
	"66619": 66579,
	"66620": 66580,
	"66621": 66581,
	"66622": 66582,
	"66623": 66583,
	"66624": 66584,
	"66625": 66585,
	"66626": 66586,
	"66627": 66587,
	"66628": 66588,
	"66629": 66589,
	"66630": 66590,
	"66631": 66591,
	"66632": 66592,
	"66633": 66593,
	"66634": 66594,
	"66635": 66595,
	"66636": 66596,
	"66637": 66597,
	"66638": 66598,
	"66639": 66599,
	"68736": 68800,
	"68737": 68801,
	"68738": 68802,
	"68739": 68803,
	"68740": 68804,
	"68741": 68805,
	"68742": 68806,
	"68743": 68807,
	"68744": 68808,
	"68745": 68809,
	"68746": 68810,
	"68747": 68811,
	"68748": 68812,
	"68749": 68813,
	"68750": 68814,
	"68751": 68815,
	"68752": 68816,
	"68753": 68817,
	"68754": 68818,
	"68755": 68819,
	"68756": 68820,
	"68757": 68821,
	"68758": 68822,
	"68759": 68823,
	"68760": 68824,
	"68761": 68825,
	"68762": 68826,
	"68763": 68827,
	"68764": 68828,
	"68765": 68829,
	"68766": 68830,
	"68767": 68831,
	"68768": 68832,
	"68769": 68833,
	"68770": 68834,
	"68771": 68835,
	"68772": 68836,
	"68773": 68837,
	"68774": 68838,
	"68775": 68839,
	"68776": 68840,
	"68777": 68841,
	"68778": 68842,
	"68779": 68843,
	"68780": 68844,
	"68781": 68845,
	"68782": 68846,
	"68783": 68847,
	"68784": 68848,
	"68785": 68849,
	"68786": 68850,
	"68800": 68736,
	"68801": 68737,
	"68802": 68738,
	"68803": 68739,
	"68804": 68740,
	"68805": 68741,
	"68806": 68742,
	"68807": 68743,
	"68808": 68744,
	"68809": 68745,
	"68810": 68746,
	"68811": 68747,
	"68812": 68748,
	"68813": 68749,
	"68814": 68750,
	"68815": 68751,
	"68816": 68752,
	"68817": 68753,
	"68818": 68754,
	"68819": 68755,
	"68820": 68756,
	"68821": 68757,
	"68822": 68758,
	"68823": 68759,
	"68824": 68760,
	"68825": 68761,
	"68826": 68762,
	"68827": 68763,
	"68828": 68764,
	"68829": 68765,
	"68830": 68766,
	"68831": 68767,
	"68832": 68768,
	"68833": 68769,
	"68834": 68770,
	"68835": 68771,
	"68836": 68772,
	"68837": 68773,
	"68838": 68774,
	"68839": 68775,
	"68840": 68776,
	"68841": 68777,
	"68842": 68778,
	"68843": 68779,
	"68844": 68780,
	"68845": 68781,
	"68846": 68782,
	"68847": 68783,
	"68848": 68784,
	"68849": 68785,
	"68850": 68786,
	"71840": 71872,
	"71841": 71873,
	"71842": 71874,
	"71843": 71875,
	"71844": 71876,
	"71845": 71877,
	"71846": 71878,
	"71847": 71879,
	"71848": 71880,
	"71849": 71881,
	"71850": 71882,
	"71851": 71883,
	"71852": 71884,
	"71853": 71885,
	"71854": 71886,
	"71855": 71887,
	"71856": 71888,
	"71857": 71889,
	"71858": 71890,
	"71859": 71891,
	"71860": 71892,
	"71861": 71893,
	"71862": 71894,
	"71863": 71895,
	"71864": 71896,
	"71865": 71897,
	"71866": 71898,
	"71867": 71899,
	"71868": 71900,
	"71869": 71901,
	"71870": 71902,
	"71871": 71903,
	"71872": 71840,
	"71873": 71841,
	"71874": 71842,
	"71875": 71843,
	"71876": 71844,
	"71877": 71845,
	"71878": 71846,
	"71879": 71847,
	"71880": 71848,
	"71881": 71849,
	"71882": 71850,
	"71883": 71851,
	"71884": 71852,
	"71885": 71853,
	"71886": 71854,
	"71887": 71855,
	"71888": 71856,
	"71889": 71857,
	"71890": 71858,
	"71891": 71859,
	"71892": 71860,
	"71893": 71861,
	"71894": 71862,
	"71895": 71863,
	"71896": 71864,
	"71897": 71865,
	"71898": 71866,
	"71899": 71867,
	"71900": 71868,
	"71901": 71869,
	"71902": 71870,
	"71903": 71871
};

var parser = __commonjs(function (module) {
// regjsparser
//
// ==================================================================
//
// See ECMA-262 Standard: 15.10.1
//
// NOTE: The ECMA-262 standard uses the term "Assertion" for /^/. Here the
//   term "Anchor" is used.
//
// Pattern ::
//      Disjunction
//
// Disjunction ::
//      Alternative
//      Alternative | Disjunction
//
// Alternative ::
//      [empty]
//      Alternative Term
//
// Term ::
//      Anchor
//      Atom
//      Atom Quantifier
//
// Anchor ::
//      ^
//      $
//      \ b
//      \ B
//      ( ? = Disjunction )
//      ( ? ! Disjunction )
//
// Quantifier ::
//      QuantifierPrefix
//      QuantifierPrefix ?
//
// QuantifierPrefix ::
//      *
//      +
//      ?
//      { DecimalDigits }
//      { DecimalDigits , }
//      { DecimalDigits , DecimalDigits }
//
// Atom ::
//      PatternCharacter
//      .
//      \ AtomEscape
//      CharacterClass
//      ( Disjunction )
//      ( ? : Disjunction )
//
// PatternCharacter ::
//      SourceCharacter but not any of: ^ $ \ . * + ? ( ) [ ] { } |
//
// AtomEscape ::
//      DecimalEscape
//      CharacterEscape
//      CharacterClassEscape
//
// CharacterEscape[U] ::
//      ControlEscape
//      c ControlLetter
//      HexEscapeSequence
//      RegExpUnicodeEscapeSequence[?U] (ES6)
//      IdentityEscape[?U]
//
// ControlEscape ::
//      one of f n r t v
// ControlLetter ::
//      one of
//          a b c d e f g h i j k l m n o p q r s t u v w x y z
//          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
//
// IdentityEscape ::
//      SourceCharacter but not IdentifierPart
//      <ZWJ>
//      <ZWNJ>
//
// DecimalEscape ::
//      DecimalIntegerLiteral [lookahead ∉ DecimalDigit]
//
// CharacterClassEscape ::
//      one of d D s S w W
//
// CharacterClass ::
//      [ [lookahead ∉ {^}] ClassRanges ]
//      [ ^ ClassRanges ]
//
// ClassRanges ::
//      [empty]
//      NonemptyClassRanges
//
// NonemptyClassRanges ::
//      ClassAtom
//      ClassAtom NonemptyClassRangesNoDash
//      ClassAtom - ClassAtom ClassRanges
//
// NonemptyClassRangesNoDash ::
//      ClassAtom
//      ClassAtomNoDash NonemptyClassRangesNoDash
//      ClassAtomNoDash - ClassAtom ClassRanges
//
// ClassAtom ::
//      -
//      ClassAtomNoDash
//
// ClassAtomNoDash ::
//      SourceCharacter but not one of \ or ] or -
//      \ ClassEscape
//
// ClassEscape ::
//      DecimalEscape
//      b
//      CharacterEscape
//      CharacterClassEscape

(function() {

  function parse(str, flags) {
    function addRaw(node) {
      node.raw = str.substring(node.range[0], node.range[1]);
      return node;
    }

    function updateRawStart(node, start) {
      node.range[0] = start;
      return addRaw(node);
    }

    function createAnchor(kind, rawLength) {
      return addRaw({
        type: 'anchor',
        kind: kind,
        range: [
          pos - rawLength,
          pos
        ]
      });
    }

    function createValue(kind, codePoint, from, to) {
      return addRaw({
        type: 'value',
        kind: kind,
        codePoint: codePoint,
        range: [from, to]
      });
    }

    function createEscaped(kind, codePoint, value, fromOffset) {
      fromOffset = fromOffset || 0;
      return createValue(kind, codePoint, pos - (value.length + fromOffset), pos);
    }

    function createCharacter(matches) {
      var _char = matches[0];
      var first = _char.charCodeAt(0);
      if (hasUnicodeFlag) {
        var second;
        if (_char.length === 1 && first >= 0xD800 && first <= 0xDBFF) {
          second = lookahead().charCodeAt(0);
          if (second >= 0xDC00 && second <= 0xDFFF) {
            // Unicode surrogate pair
            pos++;
            return createValue(
                'symbol',
                (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000,
                pos - 2, pos);
          }
        }
      }
      return createValue('symbol', first, pos - 1, pos);
    }

    function createDisjunction(alternatives, from, to) {
      return addRaw({
        type: 'disjunction',
        body: alternatives,
        range: [
          from,
          to
        ]
      });
    }

    function createDot() {
      return addRaw({
        type: 'dot',
        range: [
          pos - 1,
          pos
        ]
      });
    }

    function createCharacterClassEscape(value) {
      return addRaw({
        type: 'characterClassEscape',
        value: value,
        range: [
          pos - 2,
          pos
        ]
      });
    }

    function createReference(matchIndex) {
      return addRaw({
        type: 'reference',
        matchIndex: parseInt(matchIndex, 10),
        range: [
          pos - 1 - matchIndex.length,
          pos
        ]
      });
    }

    function createGroup(behavior, disjunction, from, to) {
      return addRaw({
        type: 'group',
        behavior: behavior,
        body: disjunction,
        range: [
          from,
          to
        ]
      });
    }

    function createQuantifier(min, max, from, to) {
      if (to == null) {
        from = pos - 1;
        to = pos;
      }

      return addRaw({
        type: 'quantifier',
        min: min,
        max: max,
        greedy: true,
        body: null, // set later on
        range: [
          from,
          to
        ]
      });
    }

    function createAlternative(terms, from, to) {
      return addRaw({
        type: 'alternative',
        body: terms,
        range: [
          from,
          to
        ]
      });
    }

    function createCharacterClass(classRanges, negative, from, to) {
      return addRaw({
        type: 'characterClass',
        body: classRanges,
        negative: negative,
        range: [
          from,
          to
        ]
      });
    }

    function createClassRange(min, max, from, to) {
      // See 15.10.2.15:
      if (min.codePoint > max.codePoint) {
        bail('invalid range in character class', min.raw + '-' + max.raw, from, to);
      }

      return addRaw({
        type: 'characterClassRange',
        min: min,
        max: max,
        range: [
          from,
          to
        ]
      });
    }

    function flattenBody(body) {
      if (body.type === 'alternative') {
        return body.body;
      } else {
        return [body];
      }
    }

    function incr(amount) {
      amount = (amount || 1);
      var res = str.substring(pos, pos + amount);
      pos += (amount || 1);
      return res;
    }

    function skip(value) {
      if (!match(value)) {
        bail('character', value);
      }
    }

    function match(value) {
      if (str.indexOf(value, pos) === pos) {
        return incr(value.length);
      }
    }

    function lookahead() {
      return str[pos];
    }

    function current(value) {
      return str.indexOf(value, pos) === pos;
    }

    function next(value) {
      return str[pos + 1] === value;
    }

    function matchReg(regExp) {
      var subStr = str.substring(pos);
      var res = subStr.match(regExp);
      if (res) {
        res.range = [];
        res.range[0] = pos;
        incr(res[0].length);
        res.range[1] = pos;
      }
      return res;
    }

    function parseDisjunction() {
      // Disjunction ::
      //      Alternative
      //      Alternative | Disjunction
      var res = [], from = pos;
      res.push(parseAlternative());

      while (match('|')) {
        res.push(parseAlternative());
      }

      if (res.length === 1) {
        return res[0];
      }

      return createDisjunction(res, from, pos);
    }

    function parseAlternative() {
      var res = [], from = pos;
      var term;

      // Alternative ::
      //      [empty]
      //      Alternative Term
      while (term = parseTerm()) {
        res.push(term);
      }

      if (res.length === 1) {
        return res[0];
      }

      return createAlternative(res, from, pos);
    }

    function parseTerm() {
      // Term ::
      //      Anchor
      //      Atom
      //      Atom Quantifier

      if (pos >= str.length || current('|') || current(')')) {
        return null; /* Means: The term is empty */
      }

      var anchor = parseAnchor();

      if (anchor) {
        return anchor;
      }

      var atom = parseAtom();
      if (!atom) {
        bail('Expected atom');
      }
      var quantifier = parseQuantifier() || false;
      if (quantifier) {
        quantifier.body = flattenBody(atom);
        // The quantifier contains the atom. Therefore, the beginning of the
        // quantifier range is given by the beginning of the atom.
        updateRawStart(quantifier, atom.range[0]);
        return quantifier;
      }
      return atom;
    }

    function parseGroup(matchA, typeA, matchB, typeB) {
      var type = null, from = pos;

      if (match(matchA)) {
        type = typeA;
      } else if (match(matchB)) {
        type = typeB;
      } else {
        return false;
      }

      var body = parseDisjunction();
      if (!body) {
        bail('Expected disjunction');
      }
      skip(')');
      var group = createGroup(type, flattenBody(body), from, pos);

      if (type == 'normal') {
        // Keep track of the number of closed groups. This is required for
        // parseDecimalEscape(). In case the string is parsed a second time the
        // value already holds the total count and no incrementation is required.
        if (firstIteration) {
          closedCaptureCounter++;
        }
      }
      return group;
    }

    function parseAnchor() {
      // Anchor ::
      //      ^
      //      $
      //      \ b
      //      \ B
      //      ( ? = Disjunction )
      //      ( ? ! Disjunction )
      if (match('^')) {
        return createAnchor('start', 1 /* rawLength */);
      } else if (match('$')) {
        return createAnchor('end', 1 /* rawLength */);
      } else if (match('\\b')) {
        return createAnchor('boundary', 2 /* rawLength */);
      } else if (match('\\B')) {
        return createAnchor('not-boundary', 2 /* rawLength */);
      } else {
        return parseGroup('(?=', 'lookahead', '(?!', 'negativeLookahead');
      }
    }

    function parseQuantifier() {
      // Quantifier ::
      //      QuantifierPrefix
      //      QuantifierPrefix ?
      //
      // QuantifierPrefix ::
      //      *
      //      +
      //      ?
      //      { DecimalDigits }
      //      { DecimalDigits , }
      //      { DecimalDigits , DecimalDigits }

      var res, from = pos;
      var quantifier;
      var min, max;

      if (match('*')) {
        quantifier = createQuantifier(0);
      }
      else if (match('+')) {
        quantifier = createQuantifier(1);
      }
      else if (match('?')) {
        quantifier = createQuantifier(0, 1);
      }
      else if (res = matchReg(/^\{([0-9]+)\}/)) {
        min = parseInt(res[1], 10);
        quantifier = createQuantifier(min, min, res.range[0], res.range[1]);
      }
      else if (res = matchReg(/^\{([0-9]+),\}/)) {
        min = parseInt(res[1], 10);
        quantifier = createQuantifier(min, undefined, res.range[0], res.range[1]);
      }
      else if (res = matchReg(/^\{([0-9]+),([0-9]+)\}/)) {
        min = parseInt(res[1], 10);
        max = parseInt(res[2], 10);
        if (min > max) {
          bail('numbers out of order in {} quantifier', '', from, pos);
        }
        quantifier = createQuantifier(min, max, res.range[0], res.range[1]);
      }

      if (quantifier) {
        if (match('?')) {
          quantifier.greedy = false;
          quantifier.range[1] += 1;
        }
      }

      return quantifier;
    }

    function parseAtom() {
      // Atom ::
      //      PatternCharacter
      //      .
      //      \ AtomEscape
      //      CharacterClass
      //      ( Disjunction )
      //      ( ? : Disjunction )

      var res;

      // jviereck: allow ']', '}' here as well to be compatible with browser's
      //   implementations: ']'.match(/]/);
      // if (res = matchReg(/^[^^$\\.*+?()[\]{}|]/)) {
      if (res = matchReg(/^[^^$\\.*+?(){[|]/)) {
        //      PatternCharacter
        return createCharacter(res);
      }
      else if (match('.')) {
        //      .
        return createDot();
      }
      else if (match('\\')) {
        //      \ AtomEscape
        res = parseAtomEscape();
        if (!res) {
          bail('atomEscape');
        }
        return res;
      }
      else if (res = parseCharacterClass()) {
        return res;
      }
      else {
        //      ( Disjunction )
        //      ( ? : Disjunction )
        return parseGroup('(?:', 'ignore', '(', 'normal');
      }
    }

    function parseUnicodeSurrogatePairEscape(firstEscape) {
      if (hasUnicodeFlag) {
        var first, second;
        if (firstEscape.kind == 'unicodeEscape' &&
          (first = firstEscape.codePoint) >= 0xD800 && first <= 0xDBFF &&
          current('\\') && next('u') ) {
          var prevPos = pos;
          pos++;
          var secondEscape = parseClassEscape();
          if (secondEscape.kind == 'unicodeEscape' &&
            (second = secondEscape.codePoint) >= 0xDC00 && second <= 0xDFFF) {
            // Unicode surrogate pair
            firstEscape.range[1] = secondEscape.range[1];
            firstEscape.codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            firstEscape.type = 'value';
            firstEscape.kind = 'unicodeCodePointEscape';
            addRaw(firstEscape);
          }
          else {
            pos = prevPos;
          }
        }
      }
      return firstEscape;
    }

    function parseClassEscape() {
      return parseAtomEscape(true);
    }

    function parseAtomEscape(insideCharacterClass) {
      // AtomEscape ::
      //      DecimalEscape
      //      CharacterEscape
      //      CharacterClassEscape

      var res, from = pos;

      res = parseDecimalEscape();
      if (res) {
        return res;
      }

      // For ClassEscape
      if (insideCharacterClass) {
        if (match('b')) {
          // 15.10.2.19
          // The production ClassEscape :: b evaluates by returning the
          // CharSet containing the one character <BS> (Unicode value 0008).
          return createEscaped('singleEscape', 0x0008, '\\b');
        } else if (match('B')) {
          bail('\\B not possible inside of CharacterClass', '', from);
        }
      }

      res = parseCharacterEscape();

      return res;
    }


    function parseDecimalEscape() {
      // DecimalEscape ::
      //      DecimalIntegerLiteral [lookahead ∉ DecimalDigit]
      //      CharacterClassEscape :: one of d D s S w W

      var res, match;

      if (res = matchReg(/^(?!0)\d+/)) {
        match = res[0];
        var refIdx = parseInt(res[0], 10);
        if (refIdx <= closedCaptureCounter) {
          // If the number is smaller than the normal-groups found so
          // far, then it is a reference...
          return createReference(res[0]);
        } else {
          // ... otherwise it needs to be interpreted as a octal (if the
          // number is in an octal format). If it is NOT octal format,
          // then the slash is ignored and the number is matched later
          // as normal characters.

          // Recall the negative decision to decide if the input must be parsed
          // a second time with the total normal-groups.
          backrefDenied.push(refIdx);

          // Reset the position again, as maybe only parts of the previous
          // matched numbers are actual octal numbers. E.g. in '019' only
          // the '01' should be matched.
          incr(-res[0].length);
          if (res = matchReg(/^[0-7]{1,3}/)) {
            return createEscaped('octal', parseInt(res[0], 8), res[0], 1);
          } else {
            // If we end up here, we have a case like /\91/. Then the
            // first slash is to be ignored and the 9 & 1 to be treated
            // like ordinary characters. Create a character for the
            // first number only here - other number-characters
            // (if available) will be matched later.
            res = createCharacter(matchReg(/^[89]/));
            return updateRawStart(res, res.range[0] - 1);
          }
        }
      }
      // Only allow octal numbers in the following. All matched numbers start
      // with a zero (if the do not, the previous if-branch is executed).
      // If the number is not octal format and starts with zero (e.g. `091`)
      // then only the zeros `0` is treated here and the `91` are ordinary
      // characters.
      // Example:
      //   /\091/.exec('\091')[0].length === 3
      else if (res = matchReg(/^[0-7]{1,3}/)) {
        match = res[0];
        if (/^0{1,3}$/.test(match)) {
          // If they are all zeros, then only take the first one.
          return createEscaped('null', 0x0000, '0', match.length + 1);
        } else {
          return createEscaped('octal', parseInt(match, 8), match, 1);
        }
      } else if (res = matchReg(/^[dDsSwW]/)) {
        return createCharacterClassEscape(res[0]);
      }
      return false;
    }

    function parseCharacterEscape() {
      // CharacterEscape ::
      //      ControlEscape
      //      c ControlLetter
      //      HexEscapeSequence
      //      UnicodeEscapeSequence
      //      IdentityEscape

      var res;
      if (res = matchReg(/^[fnrtv]/)) {
        // ControlEscape
        var codePoint = 0;
        switch (res[0]) {
          case 't': codePoint = 0x009; break;
          case 'n': codePoint = 0x00A; break;
          case 'v': codePoint = 0x00B; break;
          case 'f': codePoint = 0x00C; break;
          case 'r': codePoint = 0x00D; break;
        }
        return createEscaped('singleEscape', codePoint, '\\' + res[0]);
      } else if (res = matchReg(/^c([a-zA-Z])/)) {
        // c ControlLetter
        return createEscaped('controlLetter', res[1].charCodeAt(0) % 32, res[1], 2);
      } else if (res = matchReg(/^x([0-9a-fA-F]{2})/)) {
        // HexEscapeSequence
        return createEscaped('hexadecimalEscape', parseInt(res[1], 16), res[1], 2);
      } else if (res = matchReg(/^u([0-9a-fA-F]{4})/)) {
        // UnicodeEscapeSequence
        return parseUnicodeSurrogatePairEscape(
          createEscaped('unicodeEscape', parseInt(res[1], 16), res[1], 2)
        );
      } else if (hasUnicodeFlag && (res = matchReg(/^u\{([0-9a-fA-F]+)\}/))) {
        // RegExpUnicodeEscapeSequence (ES6 Unicode code point escape)
        return createEscaped('unicodeCodePointEscape', parseInt(res[1], 16), res[1], 4);
      } else {
        // IdentityEscape
        return parseIdentityEscape();
      }
    }

    // Taken from the Esprima parser.
    function isIdentifierPart(ch) {
      // Generated by `tools/generate-identifier-regex.js`.
      var NonAsciiIdentifierPart = new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]');

      return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
        (ch >= 65 && ch <= 90) ||         // A..Z
        (ch >= 97 && ch <= 122) ||        // a..z
        (ch >= 48 && ch <= 57) ||         // 0..9
        (ch === 92) ||                    // \ (backslash)
        ((ch >= 0x80) && NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
    }

    function parseIdentityEscape() {
      // IdentityEscape ::
      //      SourceCharacter but not IdentifierPart
      //      <ZWJ>
      //      <ZWNJ>

      var ZWJ = '\u200C';
      var ZWNJ = '\u200D';

      var tmp;

      if (!isIdentifierPart(lookahead())) {
        tmp = incr();
        return createEscaped('identifier', tmp.charCodeAt(0), tmp, 1);
      }

      if (match(ZWJ)) {
        // <ZWJ>
        return createEscaped('identifier', 0x200C, ZWJ);
      } else if (match(ZWNJ)) {
        // <ZWNJ>
        return createEscaped('identifier', 0x200D, ZWNJ);
      }

      return null;
    }

    function parseCharacterClass() {
      // CharacterClass ::
      //      [ [lookahead ∉ {^}] ClassRanges ]
      //      [ ^ ClassRanges ]

      var res, from = pos;
      if (res = matchReg(/^\[\^/)) {
        res = parseClassRanges();
        skip(']');
        return createCharacterClass(res, true, from, pos);
      } else if (match('[')) {
        res = parseClassRanges();
        skip(']');
        return createCharacterClass(res, false, from, pos);
      }

      return null;
    }

    function parseClassRanges() {
      // ClassRanges ::
      //      [empty]
      //      NonemptyClassRanges

      var res;
      if (current(']')) {
        // Empty array means nothing insinde of the ClassRange.
        return [];
      } else {
        res = parseNonemptyClassRanges();
        if (!res) {
          bail('nonEmptyClassRanges');
        }
        return res;
      }
    }

    function parseHelperClassRanges(atom) {
      var from, to, res;
      if (current('-') && !next(']')) {
        // ClassAtom - ClassAtom ClassRanges
        skip('-');

        res = parseClassAtom();
        if (!res) {
          bail('classAtom');
        }
        to = pos;
        var classRanges = parseClassRanges();
        if (!classRanges) {
          bail('classRanges');
        }
        from = atom.range[0];
        if (classRanges.type === 'empty') {
          return [createClassRange(atom, res, from, to)];
        }
        return [createClassRange(atom, res, from, to)].concat(classRanges);
      }

      res = parseNonemptyClassRangesNoDash();
      if (!res) {
        bail('nonEmptyClassRangesNoDash');
      }

      return [atom].concat(res);
    }

    function parseNonemptyClassRanges() {
      // NonemptyClassRanges ::
      //      ClassAtom
      //      ClassAtom NonemptyClassRangesNoDash
      //      ClassAtom - ClassAtom ClassRanges

      var atom = parseClassAtom();
      if (!atom) {
        bail('classAtom');
      }

      if (current(']')) {
        // ClassAtom
        return [atom];
      }

      // ClassAtom NonemptyClassRangesNoDash
      // ClassAtom - ClassAtom ClassRanges
      return parseHelperClassRanges(atom);
    }

    function parseNonemptyClassRangesNoDash() {
      // NonemptyClassRangesNoDash ::
      //      ClassAtom
      //      ClassAtomNoDash NonemptyClassRangesNoDash
      //      ClassAtomNoDash - ClassAtom ClassRanges

      var res = parseClassAtom();
      if (!res) {
        bail('classAtom');
      }
      if (current(']')) {
        //      ClassAtom
        return res;
      }

      // ClassAtomNoDash NonemptyClassRangesNoDash
      // ClassAtomNoDash - ClassAtom ClassRanges
      return parseHelperClassRanges(res);
    }

    function parseClassAtom() {
      // ClassAtom ::
      //      -
      //      ClassAtomNoDash
      if (match('-')) {
        return createCharacter('-');
      } else {
        return parseClassAtomNoDash();
      }
    }

    function parseClassAtomNoDash() {
      // ClassAtomNoDash ::
      //      SourceCharacter but not one of \ or ] or -
      //      \ ClassEscape

      var res;
      if (res = matchReg(/^[^\\\]-]/)) {
        return createCharacter(res[0]);
      } else if (match('\\')) {
        res = parseClassEscape();
        if (!res) {
          bail('classEscape');
        }

        return parseUnicodeSurrogatePairEscape(res);
      }
    }

    function bail(message, details, from, to) {
      from = from == null ? pos : from;
      to = to == null ? from : to;

      var contextStart = Math.max(0, from - 10);
      var contextEnd = Math.min(to + 10, str.length);

      // Output a bit of context and a line pointing to where our error is.
      //
      // We are assuming that there are no actual newlines in the content as this is a regular expression.
      var context = '    ' + str.substring(contextStart, contextEnd);
      var pointer = '    ' + new Array(from - contextStart + 1).join(' ') + '^';

      throw SyntaxError(message + ' at position ' + from + (details ? ': ' + details : '') + '\n' + context + '\n' + pointer);
    }

    var backrefDenied = [];
    var closedCaptureCounter = 0;
    var firstIteration = true;
    var hasUnicodeFlag = (flags || "").indexOf("u") !== -1;
    var pos = 0;

    // Convert the input to a string and treat the empty string special.
    str = String(str);
    if (str === '') {
      str = '(?:)';
    }

    var result = parseDisjunction();

    if (result.range[1] !== str.length) {
      bail('Could not parse entire input - got stuck', '', result.range[1]);
    }

    // The spec requires to interpret the `\2` in `/\2()()/` as backreference.
    // As the parser collects the number of capture groups as the string is
    // parsed it is impossible to make these decisions at the point when the
    // `\2` is handled. In case the local decision turns out to be wrong after
    // the parsing has finished, the input string is parsed a second time with
    // the total number of capture groups set.
    //
    // SEE: https://github.com/jviereck/regjsparser/issues/70
    for (var i = 0; i < backrefDenied.length; i++) {
      if (backrefDenied[i] <= closedCaptureCounter) {
        // Parse the input a second time.
        pos = 0;
        firstIteration = false;
        return parseDisjunction();
      }
    }

    return result;
  }

  var regjsparser = {
    parse: parse
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = regjsparser;
  } else {
    window.regjsparser = regjsparser;
  }

}());
});

var require$$3 = (parser && typeof parser === 'object' && 'default' in parser ? parser['default'] : parser);

var regjsgen = __commonjs(function (module, exports, global) {
/*!
 * RegJSGen
 * Copyright 2014 Benjamin Tan <https://d10.github.io/>
 * Available under MIT license <http://d10.mit-license.org/>
 */
(function() {
  'use strict';

  /** Used to determine if values are of the language type `Object` */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /*! Based on https://mths.be/fromcodepoint v0.2.0 by @mathias */

  var stringFromCharCode = String.fromCharCode;
  var floor = Math.floor;
  function fromCodePoint() {
    var MAX_SIZE = 0x4000;
    var codeUnits = [];
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    var result = '';
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (
        !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
        codePoint < 0 || // not a valid Unicode code point
        codePoint > 0x10FFFF || // not a valid Unicode code point
        floor(codePoint) != codePoint // not an integer
      ) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        // BMP code point
        codeUnits.push(codePoint);
      } else {
        // Astral code point; split in surrogate halves
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
      if (index + 1 == length || codeUnits.length > MAX_SIZE) {
        result += stringFromCharCode.apply(null, codeUnits);
        codeUnits.length = 0;
      }
    }
    return result;
  }

  function assertType(type, expected) {
    if (expected.indexOf('|') == -1) {
      if (type == expected) {
        return;
      }

      throw Error('Invalid node type: ' + type);
    }

    expected = assertType.hasOwnProperty(expected)
      ? assertType[expected]
      : (assertType[expected] = RegExp('^(?:' + expected + ')$'));

    if (expected.test(type)) {
      return;
    }

    throw Error('Invalid node type: ' + type);
  }

  /*--------------------------------------------------------------------------*/

  function generate(node) {
    var type = node.type;

    if (generate.hasOwnProperty(type) && typeof generate[type] == 'function') {
      return generate[type](node);
    }

    throw Error('Invalid node type: ' + type);
  }

  /*--------------------------------------------------------------------------*/

  function generateAlternative(node) {
    assertType(node.type, 'alternative');

    var terms = node.body,
        length = terms ? terms.length : 0;

    if (length == 1) {
      return generateTerm(terms[0]);
    } else {
      var i = -1,
          result = '';

      while (++i < length) {
        result += generateTerm(terms[i]);
      }

      return result;
    }
  }

  function generateAnchor(node) {
    assertType(node.type, 'anchor');

    switch (node.kind) {
      case 'start':
        return '^';
      case 'end':
        return '$';
      case 'boundary':
        return '\\b';
      case 'not-boundary':
        return '\\B';
      default:
        throw Error('Invalid assertion');
    }
  }

  function generateAtom(node) {
    assertType(node.type, 'anchor|characterClass|characterClassEscape|dot|group|reference|value');

    return generate(node);
  }

  function generateCharacterClass(node) {
    assertType(node.type, 'characterClass');

    var classRanges = node.body,
        length = classRanges ? classRanges.length : 0;

    var i = -1,
        result = '[';

    if (node.negative) {
      result += '^';
    }

    while (++i < length) {
      result += generateClassAtom(classRanges[i]);
    }

    result += ']';

    return result;
  }

  function generateCharacterClassEscape(node) {
    assertType(node.type, 'characterClassEscape');

    return '\\' + node.value;
  }

  function generateCharacterClassRange(node) {
    assertType(node.type, 'characterClassRange');

    var min = node.min,
        max = node.max;

    if (min.type == 'characterClassRange' || max.type == 'characterClassRange') {
      throw Error('Invalid character class range');
    }

    return generateClassAtom(min) + '-' + generateClassAtom(max);
  }

  function generateClassAtom(node) {
    assertType(node.type, 'anchor|characterClassEscape|characterClassRange|dot|value');

    return generate(node);
  }

  function generateDisjunction(node) {
    assertType(node.type, 'disjunction');

    var body = node.body,
        length = body ? body.length : 0;

    if (length == 0) {
      throw Error('No body');
    } else if (length == 1) {
      return generate(body[0]);
    } else {
      var i = -1,
          result = '';

      while (++i < length) {
        if (i != 0) {
          result += '|';
        }
        result += generate(body[i]);
      }

      return result;
    }
  }

  function generateDot(node) {
    assertType(node.type, 'dot');

    return '.';
  }

  function generateGroup(node) {
    assertType(node.type, 'group');

    var result = '(';

    switch (node.behavior) {
      case 'normal':
        break;
      case 'ignore':
        result += '?:';
        break;
      case 'lookahead':
        result += '?=';
        break;
      case 'negativeLookahead':
        result += '?!';
        break;
      default:
        throw Error('Invalid behaviour: ' + node.behaviour);
    }

    var body = node.body,
        length = body ? body.length : 0;

    if (length == 1) {
      result += generate(body[0]);
    } else {
      var i = -1;

      while (++i < length) {
        result += generate(body[i]);
      }
    }

    result += ')';

    return result;
  }

  function generateQuantifier(node) {
    assertType(node.type, 'quantifier');

    var quantifier = '',
        min = node.min,
        max = node.max;

    switch (max) {
      case undefined:
      case null:
        switch (min) {
          case 0:
            quantifier = '*';
            break;
          case 1:
            quantifier = '+';
            break;
          default:
            quantifier = '{' + min + ',}';
            break;
        }
        break;
      default:
        if (min == max) {
          quantifier = '{' + min + '}';
        }
        else if (min == 0 && max == 1) {
          quantifier = '?';
        } else {
          quantifier = '{' + min + ',' + max + '}';
        }
        break;
    }

    if (!node.greedy) {
      quantifier += '?';
    }

    return generateAtom(node.body[0]) + quantifier;
  }

  function generateReference(node) {
    assertType(node.type, 'reference');

    return '\\' + node.matchIndex;
  }

  function generateTerm(node) {
    assertType(node.type, 'anchor|characterClass|characterClassEscape|empty|group|quantifier|reference|value');

    return generate(node);
  }

  function generateValue(node) {
    assertType(node.type, 'value');

    var kind = node.kind,
        codePoint = node.codePoint;

    switch (kind) {
      case 'controlLetter':
        return '\\c' + fromCodePoint(codePoint + 64);
      case 'hexadecimalEscape':
        return '\\x' + ('00' + codePoint.toString(16).toUpperCase()).slice(-2);
      case 'identifier':
        return '\\' + fromCodePoint(codePoint);
      case 'null':
        return '\\' + codePoint;
      case 'octal':
        return '\\' + codePoint.toString(8);
      case 'singleEscape':
        switch (codePoint) {
          case 0x0008:
            return '\\b';
          case 0x009:
            return '\\t';
          case 0x00A:
            return '\\n';
          case 0x00B:
            return '\\v';
          case 0x00C:
            return '\\f';
          case 0x00D:
            return '\\r';
          default:
            throw Error('Invalid codepoint: ' + codePoint);
        }
      case 'symbol':
        return fromCodePoint(codePoint);
      case 'unicodeEscape':
        return '\\u' + ('0000' + codePoint.toString(16).toUpperCase()).slice(-4);
      case 'unicodeCodePointEscape':
        return '\\u{' + codePoint.toString(16).toUpperCase() + '}';
      default:
        throw Error('Unsupported node kind: ' + kind);
    }
  }

  /*--------------------------------------------------------------------------*/

  generate.alternative = generateAlternative;
  generate.anchor = generateAnchor;
  generate.characterClass = generateCharacterClass;
  generate.characterClassEscape = generateCharacterClassEscape;
  generate.characterClassRange = generateCharacterClassRange;
  generate.disjunction = generateDisjunction;
  generate.dot = generateDot;
  generate.group = generateGroup;
  generate.quantifier = generateQuantifier;
  generate.reference = generateReference;
  generate.value = generateValue;

  /*--------------------------------------------------------------------------*/

  // export regjsgen
  // some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (true) {
    // define as an anonymous module so, through path mapping, it can be aliased
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return {
        'generate': generate
      };
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Narwhal, Node.js, Rhino -require, or RingoJS
    freeExports.generate = generate;
  }
  // in a browser or Rhino
  else {
    root.regjsgen = {
      'generate': generate
    };
  }
}.call(__commonjs_global));
});

var require$$4 = (regjsgen && typeof regjsgen === 'object' && 'default' in regjsgen ? regjsgen['default'] : regjsgen);

var rewritePattern = __commonjs(function (module) {
var generate = require$$4.generate;
var parse = require$$3.parse;
var regenerate = require$$0$3;
var iuMappings = require$$1;
var ESCAPE_SETS = require$$0$2;

function getCharacterClassEscapeSet(character) {
	if (unicode) {
		if (ignoreCase) {
			return ESCAPE_SETS.UNICODE_IGNORE_CASE[character];
		}
		return ESCAPE_SETS.UNICODE[character];
	}
	return ESCAPE_SETS.REGULAR[character];
}

var object = {};
var hasOwnProperty = object.hasOwnProperty;
function has(object, property) {
	return hasOwnProperty.call(object, property);
}

// Prepare a Regenerate set containing all code points, used for negative
// character classes (if any).
var UNICODE_SET = regenerate().addRange(0x0, 0x10FFFF);
// Without the `u` flag, the range stops at 0xFFFF.
// https://mths.be/es6#sec-pattern-semantics
var BMP_SET = regenerate().addRange(0x0, 0xFFFF);

// Prepare a Regenerate set containing all code points that are supposed to be
// matched by `/./u`. https://mths.be/es6#sec-atom
var DOT_SET_UNICODE = UNICODE_SET.clone() // all Unicode code points
	.remove(
		// minus `LineTerminator`s (https://mths.be/es6#sec-line-terminators):
		0x000A, // Line Feed <LF>
		0x000D, // Carriage Return <CR>
		0x2028, // Line Separator <LS>
		0x2029  // Paragraph Separator <PS>
	);
// Prepare a Regenerate set containing all code points that are supposed to be
// matched by `/./` (only BMP code points).
var DOT_SET = DOT_SET_UNICODE.clone()
	.intersection(BMP_SET);

// Add a range of code points + any case-folded code points in that range to a
// set.
regenerate.prototype.iuAddRange = function(min, max) {
	var $this = this;
	do {
		var folded = caseFold(min);
		if (folded) {
			$this.add(folded);
		}
	} while (++min <= max);
	return $this;
};

function assign(target, source) {
	for (var key in source) {
		// Note: `hasOwnProperty` is not needed here.
		target[key] = source[key];
	}
}

function update(item, pattern) {
	// TODO: Test if memoizing `pattern` here is worth the effort.
	if (!pattern) {
		return;
	}
	var tree = parse(pattern, '');
	switch (tree.type) {
		case 'characterClass':
		case 'group':
		case 'value':
			// No wrapping needed.
			break;
		default:
			// Wrap the pattern in a non-capturing group.
			tree = wrap(tree, pattern);
	}
	assign(item, tree);
}

function wrap(tree, pattern) {
	// Wrap the pattern in a non-capturing group.
	return {
		'type': 'group',
		'behavior': 'ignore',
		'body': [tree],
		'raw': '(?:' + pattern + ')'
	};
}

function caseFold(codePoint) {
	return has(iuMappings, codePoint) ? iuMappings[codePoint] : false;
}

var ignoreCase = false;
var unicode = false;
function processCharacterClass(characterClassItem) {
	var set = regenerate();
	var body = characterClassItem.body.forEach(function(item) {
		switch (item.type) {
			case 'value':
				set.add(item.codePoint);
				if (ignoreCase && unicode) {
					var folded = caseFold(item.codePoint);
					if (folded) {
						set.add(folded);
					}
				}
				break;
			case 'characterClassRange':
				var min = item.min.codePoint;
				var max = item.max.codePoint;
				set.addRange(min, max);
				if (ignoreCase && unicode) {
					set.iuAddRange(min, max);
				}
				break;
			case 'characterClassEscape':
				set.add(getCharacterClassEscapeSet(item.value));
				break;
			// The `default` clause is only here as a safeguard; it should never be
			// reached. Code coverage tools should ignore it.
			/* istanbul ignore next */
			default:
				throw Error('Unknown term type: ' + item.type);
		}
	});
	if (characterClassItem.negative) {
		set = (unicode ? UNICODE_SET : BMP_SET).clone().remove(set);
	}
	update(characterClassItem, set.toString());
	return characterClassItem;
}

function processTerm(item) {
	switch (item.type) {
		case 'dot':
			update(
				item,
				(unicode ? DOT_SET_UNICODE : DOT_SET).toString()
			);
			break;
		case 'characterClass':
			item = processCharacterClass(item);
			break;
		case 'characterClassEscape':
			update(
				item,
				getCharacterClassEscapeSet(item.value).toString()
			);
			break;
		case 'alternative':
		case 'disjunction':
		case 'group':
		case 'quantifier':
			item.body = item.body.map(processTerm);
			break;
		case 'value':
			var codePoint = item.codePoint;
			var set = regenerate(codePoint);
			if (ignoreCase && unicode) {
				var folded = caseFold(codePoint);
				if (folded) {
					set.add(folded);
				}
			}
			update(item, set.toString());
			break;
		case 'anchor':
		case 'empty':
		case 'group':
		case 'reference':
			// Nothing to do here.
			break;
		// The `default` clause is only here as a safeguard; it should never be
		// reached. Code coverage tools should ignore it.
		/* istanbul ignore next */
		default:
			throw Error('Unknown term type: ' + item.type);
	}
	return item;
}

module.exports = function(pattern, flags) {
	var tree = parse(pattern, flags);
	ignoreCase = flags ? flags.indexOf('i') > -1 : false;
	unicode = flags ? flags.indexOf('u') > -1 : false;
	assign(tree, processTerm(tree));
	return generate(tree);
};
});

var rewritePattern$1 = (rewritePattern && typeof rewritePattern === 'object' && 'default' in rewritePattern ? rewritePattern['default'] : rewritePattern);

var Literal = (function (Node$$1) {
	function Literal () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) Literal.__proto__ = Node$$1;
	Literal.prototype = Object.create( Node$$1 && Node$$1.prototype );
	Literal.prototype.constructor = Literal;

	Literal.prototype.initialise = function initialise () {
		if ( typeof this.value === 'string' ) {
			this.program.indentExclusionElements.push( this );
		}
	};

	Literal.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.numericLiteral ) {
			var leading = this.raw.slice( 0, 2 );
			if ( leading === '0b' || leading === '0o' ) {
				code.overwrite( this.start, this.end, String( this.value ), true );
			}
		}

		if ( this.regex ) {
			var ref = this.regex;
			var pattern = ref.pattern;
			var flags = ref.flags;

			if ( transforms.stickyRegExp && /y/.test( flags ) ) throw new CompileError( this, 'Regular expression sticky flag is not supported' );
			if ( transforms.unicodeRegExp && /u/.test( flags ) ) {
				code.overwrite( this.start, this.end, ("/" + (rewritePattern$1( pattern, flags )) + "/" + (flags.replace( 'u', '' ))) );
			}
		}
	};

	return Literal;
}(Node));

var MemberExpression = (function (Node$$1) {
	function MemberExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) MemberExpression.__proto__ = Node$$1;
	MemberExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	MemberExpression.prototype.constructor = MemberExpression;

	MemberExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.reservedProperties && reserved[ this.property.name ] ) {
			code.overwrite( this.object.end, this.property.start, "['" );
			code.insertLeft( this.property.end, "']" );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return MemberExpression;
}(Node));

var NewExpression = (function (Node$$1) {
	function NewExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) NewExpression.__proto__ = Node$$1;
	NewExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	NewExpression.prototype.constructor = NewExpression;

	NewExpression.prototype.initialise = function initialise ( transforms ) {
		var this$1 = this;

		if ( transforms.spreadRest && this.arguments.length ) {
			var lexicalBoundary = this.findLexicalBoundary();

			var i = this.arguments.length;
			while ( i-- ) {
				var arg = this$1.arguments[i];
				if ( arg.type === 'SpreadElement' && isArguments( arg.argument ) ) {
					this$1.argumentsArrayAlias = lexicalBoundary.getArgumentsArrayAlias();
					break;
				}
			}
		}

		Node$$1.prototype.initialise.call( this, transforms );
	};

	NewExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.spreadRest && this.arguments.length ) {
			var firstArgument = this.arguments[0];
			var isNew = true;
			var hasSpreadElements = spread( code, this.arguments, firstArgument.start, this.argumentsArrayAlias, isNew );

			if ( hasSpreadElements ) {
				code.insertRight( this.start + 'new'.length, ' (Function.prototype.bind.apply(' );
				code.overwrite( this.callee.end, firstArgument.start, ', [ null ].concat( ' );
				code.insertLeft( this.end, ' ))' );
			}
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return NewExpression;
}(Node));

var ObjectExpression = (function (Node$$1) {
	function ObjectExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ObjectExpression.__proto__ = Node$$1;
	ObjectExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ObjectExpression.prototype.constructor = ObjectExpression;

	ObjectExpression.prototype.transpile = function transpile ( code, transforms ) {
		var this$1 = this;

		Node$$1.prototype.transpile.call( this, code, transforms );

		var firstPropertyStart = this.start + 1;
		var regularPropertyCount = 0;
		var spreadPropertyCount = 0;
		var computedPropertyCount = 0;

		for ( var i$2 = 0, list = this.properties; i$2 < list.length; i$2 += 1 ) {
			var prop = list[i$2];

			if ( prop.type === 'SpreadProperty' ) {
				spreadPropertyCount += 1;
			} else if ( prop.computed ) {
				computedPropertyCount += 1;
			} else if ( prop.type === 'Property' ) {
				regularPropertyCount += 1;
			}
		}

		if ( spreadPropertyCount ) {
			if ( !this.program.options.objectAssign ) {
				throw new CompileError( this, 'Object spread operator requires specified objectAssign option with \'Object.assign\' or polyfill helper.' );
			}
			// enclose run of non-spread properties in curlies
			var i = this.properties.length;
			if ( regularPropertyCount ) {
				while ( i-- ) {
					var prop$1 = this$1.properties[i];

					if ( prop$1.type === 'Property' && !prop$1.computed ) {
						var lastProp = this$1.properties[ i - 1 ];
						var nextProp = this$1.properties[ i + 1 ];

						if ( !lastProp || lastProp.type !== 'Property' || lastProp.computed ) {
							code.insertRight( prop$1.start, '{' );
						}

						if ( !nextProp || nextProp.type !== 'Property' || nextProp.computed ) {
							code.insertLeft( prop$1.end, '}' );
						}
					}
				}
			}

			// wrap the whole thing in Object.assign
			firstPropertyStart = this.properties[0].start;
			code.overwrite( this.start, firstPropertyStart, ((this.program.options.objectAssign) + "({}, "));
			code.overwrite( this.properties[ this.properties.length - 1 ].end, this.end, ')' );
		}

		if ( computedPropertyCount && transforms.computedProperty ) {
			var i0 = this.getIndentation();

			var isSimpleAssignment;
			var name;

			if ( this.parent.type === 'VariableDeclarator' && this.parent.parent.declarations.length === 1 ) {
				isSimpleAssignment = true;
				name = this.parent.id.alias || this.parent.id.name; // TODO is this right?
			} else if ( this.parent.type === 'AssignmentExpression' && this.parent.parent.type === 'ExpressionStatement' && this.parent.left.type === 'Identifier' ) {
				isSimpleAssignment = true;
				name = this.parent.left.alias || this.parent.left.name; // TODO is this right?
			} else if ( this.parent.type === 'AssignmentPattern' && this.parent.left.type === 'Identifier' ) {
				isSimpleAssignment = true;
				name = this.parent.left.alias || this.parent.left.name; // TODO is this right?
			}

			// handle block scoping
			var declaration = this.findScope( false ).findDeclaration( name );
			if ( declaration ) name = declaration.name;

			var start = firstPropertyStart;
			var end = this.end;

			if ( isSimpleAssignment ) {
				// ???
			} else {
				name = this.findScope( true ).createIdentifier( 'obj' );

				var statement = this.findNearest( /(?:Statement|Declaration)$/ );
				code.insertLeft( statement.end, ("\n" + i0 + "var " + name + ";") );

				code.insertRight( this.start, ("( " + name + " = ") );
			}

			var len = this.properties.length;
			var lastComputedProp;
			var sawNonComputedProperty = false;

			for ( var i$1 = 0; i$1 < len; i$1 += 1 ) {
				var prop$2 = this$1.properties[i$1];

				if ( prop$2.computed ) {
					lastComputedProp = prop$2;
					var moveStart = i$1 > 0 ? this$1.properties[ i$1 - 1 ].end : start;

					var propId = isSimpleAssignment ? (";\n" + i0 + name) : (", " + name);

					if (moveStart < prop$2.start) {
						code.overwrite( moveStart, prop$2.start, propId );
					} else {
						code.insertRight( prop$2.start, propId );
					}

					var c = prop$2.key.end;
					while ( code.original[c] !== ']' ) c += 1;
					c += 1;

					if ( prop$2.value.start > c ) code.remove( c, prop$2.value.start );
					code.insertLeft( c, ' = ' );
					code.move( moveStart, prop$2.end, end );

					if ( i$1 < len - 1 && ! sawNonComputedProperty ) {
						// remove trailing comma
						c = prop$2.end;
						while ( code.original[c] !== ',' ) c += 1;

						code.remove( prop$2.end, c + 1 );
					}

					if ( prop$2.method && transforms.conciseMethodProperty ) {
						code.insertRight( prop$2.value.start, 'function ' );
					}
				} else {
					sawNonComputedProperty = true;
				}
			}

			// special case
			if ( computedPropertyCount === len ) {
				code.remove( this.properties[ len - 1 ].end, this.end - 1 );
			}

			if ( !isSimpleAssignment ) {
				code.insertLeft( lastComputedProp.end, (", " + name + " )") );
			}
		}
	};

	return ObjectExpression;
}(Node));

var Property = (function (Node$$1) {
	function Property () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) Property.__proto__ = Node$$1;
	Property.prototype = Object.create( Node$$1 && Node$$1.prototype );
	Property.prototype.constructor = Property;

	Property.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.conciseMethodProperty && !this.computed && this.parent.type !== 'ObjectPattern' ) {
			if ( this.shorthand ) {
				code.insertRight( this.start, ((this.key.name) + ": ") );
			} else if ( this.method ) {
				var name = '';
				if ( this.program.options.namedFunctionExpressions !== false ) {
					if ( this.key.type === 'Literal' && typeof this.key.value === 'number' ) {
						name = "";
					} else if ( this.key.type === 'Identifier' ) {
						if ( reserved[ this.key.name ] ||
							 ! /^[a-z_$][a-z0-9_$]*$/i.test( this.key.name ) ||
						     this.value.body.scope.references[this.key.name] ) {
							name = this.findScope( true ).createIdentifier( this.key.name );
						} else {
							name = this.key.name;
						}
					} else {
						name = this.findScope( true ).createIdentifier( this.key.value );
					}
					name = ' ' + name;
				}

				if ( this.value.generator ) code.remove( this.start, this.key.start );
				code.insertLeft( this.key.end, (": function" + (this.value.generator ? '*' : '') + name) );
			}
		}

		if ( transforms.reservedProperties && reserved[ this.key.name ] ) {
			code.insertRight( this.key.start, "'" );
			code.insertLeft( this.key.end, "'" );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return Property;
}(Node));

var ReturnStatement = (function (Node$$1) {
	function ReturnStatement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ReturnStatement.__proto__ = Node$$1;
	ReturnStatement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ReturnStatement.prototype.constructor = ReturnStatement;

	ReturnStatement.prototype.initialise = function initialise ( transforms ) {
		this.loop = this.findNearest( loopStatement );
		this.nearestFunction = this.findNearest( /Function/ );

		if ( this.loop && ( !this.nearestFunction || this.loop.depth > this.nearestFunction.depth ) ) {
			this.loop.canReturn = true;
			this.shouldWrap = true;
		}

		if ( this.argument ) this.argument.initialise( transforms );
	};

	ReturnStatement.prototype.transpile = function transpile ( code, transforms ) {
		var shouldWrap = this.shouldWrap && this.loop && this.loop.shouldRewriteAsFunction;

		if ( this.argument ) {
			if ( shouldWrap ) code.insertRight( this.argument.start, "{ v: " );
			this.argument.transpile( code, transforms );
			if ( shouldWrap ) code.insertLeft( this.argument.end, " }" );
		} else if ( shouldWrap ) {
			code.insertLeft( this.start + 6, ' {}' );
		}
	};

	return ReturnStatement;
}(Node));

var SpreadProperty = (function (Node$$1) {
	function SpreadProperty () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) SpreadProperty.__proto__ = Node$$1;
	SpreadProperty.prototype = Object.create( Node$$1 && Node$$1.prototype );
	SpreadProperty.prototype.constructor = SpreadProperty;

	SpreadProperty.prototype.transpile = function transpile ( code, transforms ) {
		code.remove( this.start, this.argument.start );
		code.remove( this.argument.end, this.end );

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return SpreadProperty;
}(Node));

var Super = (function (Node$$1) {
	function Super () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) Super.__proto__ = Node$$1;
	Super.prototype = Object.create( Node$$1 && Node$$1.prototype );
	Super.prototype.constructor = Super;

	Super.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.classes ) {
			this.method = this.findNearest( 'MethodDefinition' );
			if ( !this.method ) throw new CompileError( this, 'use of super outside class method' );

			var parentClass = this.findNearest( 'ClassBody' ).parent;
			this.superClassName = parentClass.superClass && (parentClass.superClass.name || 'superclass');

			if ( !this.superClassName ) throw new CompileError( this, 'super used in base class' );

			this.isCalled = this.parent.type === 'CallExpression' && this === this.parent.callee;

			if ( this.method.kind !== 'constructor' && this.isCalled ) {
				throw new CompileError( this, 'super() not allowed outside class constructor' );
			}

			this.isMember = this.parent.type === 'MemberExpression';

			if ( !this.isCalled && !this.isMember ) {
				throw new CompileError( this, 'Unexpected use of `super` (expected `super(...)` or `super.*`)' );
			}
		}

		if ( transforms.arrow ) {
			var lexicalBoundary = this.findLexicalBoundary();
			var arrowFunction = this.findNearest( 'ArrowFunctionExpression' );
			var loop = this.findNearest( loopStatement );

			if ( arrowFunction && arrowFunction.depth > lexicalBoundary.depth ) {
				this.thisAlias = lexicalBoundary.getThisAlias();
			}

			if ( loop && loop.body.contains( this ) && loop.depth > lexicalBoundary.depth ) {
				this.thisAlias = lexicalBoundary.getThisAlias();
			}
		}
	};

	Super.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.classes ) {
			var expression = ( this.isCalled || this.method.static ) ?
				this.superClassName :
				((this.superClassName) + ".prototype");

			code.overwrite( this.start, this.end, expression, true );

			var callExpression = this.isCalled ? this.parent : this.parent.parent;

			if ( callExpression && callExpression.type === 'CallExpression' ) {
				if ( !this.noCall ) { // special case – `super( ...args )`
					code.insertLeft( callExpression.callee.end, '.call' );
				}

				var thisAlias = this.thisAlias || 'this';

				if ( callExpression.arguments.length ) {
					code.insertLeft( callExpression.arguments[0].start, (thisAlias + ", ") );
				} else {
					code.insertLeft( callExpression.end - 1, ("" + thisAlias) );
				}
			}
		}
	};

	return Super;
}(Node));

var TaggedTemplateExpression = (function (Node$$1) {
	function TaggedTemplateExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) TaggedTemplateExpression.__proto__ = Node$$1;
	TaggedTemplateExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	TaggedTemplateExpression.prototype.constructor = TaggedTemplateExpression;

	TaggedTemplateExpression.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.templateString && !transforms.dangerousTaggedTemplateString ) {
			throw new CompileError( this, 'Tagged template strings are not supported. Use `transforms: { templateString: false }` to skip transformation and disable this error, or `transforms: { dangerousTaggedTemplateString: true }` if you know what you\'re doing' );
		}

		Node$$1.prototype.initialise.call( this, transforms );
	};

	TaggedTemplateExpression.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.templateString && transforms.dangerousTaggedTemplateString ) {
			var ordered = this.quasi.expressions.concat( this.quasi.quasis ).sort( function ( a, b ) { return a.start - b.start; } );

			// insert strings at start
			var templateStrings = this.quasi.quasis.map( function ( quasi ) { return JSON.stringify( quasi.value.cooked ); } );
			code.overwrite( this.tag.end, ordered[0].start, ("([" + (templateStrings.join(', ')) + "]") );

			var lastIndex = ordered[0].start;
			ordered.forEach( function ( node ) {
				if ( node.type === 'TemplateElement' ) {
					code.remove( lastIndex, node.end );
				} else {
					code.overwrite( lastIndex, node.start, ', ' );
				}

				lastIndex = node.end;
			});

			code.overwrite( lastIndex, this.end, ')' );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return TaggedTemplateExpression;
}(Node));

var TemplateElement = (function (Node$$1) {
	function TemplateElement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) TemplateElement.__proto__ = Node$$1;
	TemplateElement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	TemplateElement.prototype.constructor = TemplateElement;

	TemplateElement.prototype.initialise = function initialise () {
		this.program.indentExclusionElements.push( this );
	};

	return TemplateElement;
}(Node));

var TemplateLiteral = (function (Node$$1) {
	function TemplateLiteral () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) TemplateLiteral.__proto__ = Node$$1;
	TemplateLiteral.prototype = Object.create( Node$$1 && Node$$1.prototype );
	TemplateLiteral.prototype.constructor = TemplateLiteral;

	TemplateLiteral.prototype.transpile = function transpile ( code, transforms ) {
		if ( transforms.templateString && this.parent.type !== 'TaggedTemplateExpression' ) {
			var ordered = this.expressions.concat( this.quasis )
				.sort( function ( a, b ) { return a.start - b.start || a.end - b.end; } )
				.filter( function ( node, i ) {
					// include all expressions
					if ( node.type !== 'TemplateElement' ) return true;

					// include all non-empty strings
					if ( node.value.raw ) return true;

					// exclude all empty strings not at the head
					return !i;
				});

			// special case – we may be able to skip the first element,
			// if it's the empty string, but only if the second and
			// third elements aren't both expressions (since they maybe
			// be numeric, and `1 + 2 + '3' === '33'`)
			if ( ordered.length >= 3 ) {
				var first = ordered[0];
				var third = ordered[2];
				if ( first.type === 'TemplateElement' && first.value.raw === '' && third.type === 'TemplateElement' ) {
					ordered.shift();
				}
			}

			var parenthesise = ( this.quasis.length !== 1 || this.expressions.length !== 0 ) &&
			                     this.parent.type !== 'AssignmentExpression' &&
			                     this.parent.type !== 'AssignmentPattern' &&
			                     this.parent.type !== 'VariableDeclarator' &&
			                     ( this.parent.type !== 'BinaryExpression' || this.parent.operator !== '+' );

			if ( parenthesise ) code.insertRight( this.start, '(' );

			var lastIndex = this.start;

			ordered.forEach( function ( node, i ) {
				if ( node.type === 'TemplateElement' ) {
					var replacement = '';
					if ( i ) replacement += ' + ';
					replacement += JSON.stringify( node.value.cooked );

					code.overwrite( lastIndex, node.end, replacement );
				} else {
					var parenthesise = node.type !== 'Identifier'; // TODO other cases where it's safe

					var replacement$1 = '';
					if ( i ) replacement$1 += ' + ';
					if ( parenthesise ) replacement$1 += '(';

					code.overwrite( lastIndex, node.start, replacement$1 );

					if ( parenthesise ) code.insertLeft( node.end, ')' );
				}

				lastIndex = node.end;
			});

			var close = '';
			if ( parenthesise ) close += ')';

			code.overwrite( lastIndex, this.end, close );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );
	};

	return TemplateLiteral;
}(Node));

var ThisExpression = (function (Node$$1) {
	function ThisExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) ThisExpression.__proto__ = Node$$1;
	ThisExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	ThisExpression.prototype.constructor = ThisExpression;

	ThisExpression.prototype.initialise = function initialise ( transforms ) {
		if ( transforms.arrow ) {
			var lexicalBoundary = this.findLexicalBoundary();
			var arrowFunction = this.findNearest( 'ArrowFunctionExpression' );
			var loop = this.findNearest( loopStatement );

			if ( ( arrowFunction && arrowFunction.depth > lexicalBoundary.depth )
			|| ( loop && loop.body.contains( this ) && loop.depth > lexicalBoundary.depth )
			|| ( loop && loop.right && loop.right.contains( this ) ) ) {
				this.alias = lexicalBoundary.getThisAlias();
			}
		}
	};

	ThisExpression.prototype.transpile = function transpile ( code ) {
		if ( this.alias ) {
			code.overwrite( this.start, this.end, this.alias, true );
		}
	};

	return ThisExpression;
}(Node));

var UpdateExpression = (function (Node$$1) {
	function UpdateExpression () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) UpdateExpression.__proto__ = Node$$1;
	UpdateExpression.prototype = Object.create( Node$$1 && Node$$1.prototype );
	UpdateExpression.prototype.constructor = UpdateExpression;

	UpdateExpression.prototype.initialise = function initialise ( transforms ) {
		if ( this.argument.type === 'Identifier' ) {
			var declaration = this.findScope( false ).findDeclaration( this.argument.name );
			if ( declaration && declaration.kind === 'const' ) {
				throw new CompileError( this, ((this.argument.name) + " is read-only") );
			}

			// special case – https://gitlab.com/Rich-Harris/buble/issues/150
			var statement = declaration && declaration.node.ancestor( 3 );
			if ( statement && statement.type === 'ForStatement' && statement.body.contains( this ) ) {
				statement.reassigned[ this.argument.name ] = true;
			}
		}

		Node$$1.prototype.initialise.call( this, transforms );
	};

	return UpdateExpression;
}(Node));

var VariableDeclaration = (function (Node$$1) {
	function VariableDeclaration () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) VariableDeclaration.__proto__ = Node$$1;
	VariableDeclaration.prototype = Object.create( Node$$1 && Node$$1.prototype );
	VariableDeclaration.prototype.constructor = VariableDeclaration;

	VariableDeclaration.prototype.initialise = function initialise ( transforms ) {
		this.scope = this.findScope( this.kind === 'var' );
		this.declarations.forEach( function ( declarator ) { return declarator.initialise( transforms ); } );
	};

	VariableDeclaration.prototype.transpile = function transpile ( code, transforms ) {
		var this$1 = this;

		var i0 = this.getIndentation();
		var kind = this.kind;

		if ( transforms.letConst && kind !== 'var' ) {
			kind = 'var';
			code.overwrite( this.start, this.start + this.kind.length, kind, true );
		}

		if ( transforms.destructuring && this.parent.type !== 'ForOfStatement' ) {
			var c = this.start;
			var lastDeclaratorIsPattern;

			this.declarations.forEach( function ( declarator, i ) {
				if ( declarator.id.type === 'Identifier' ) {
					if ( i > 0 && this$1.declarations[ i - 1 ].id.type !== 'Identifier' ) {
						code.overwrite( c, declarator.id.start, "var " );
					}
				} else {
					var inline = loopStatement.test( this$1.parent.type );

					if ( i === 0 ) {
						code.remove( c, declarator.id.start );
					} else {
						code.overwrite( c, declarator.id.start, (";\n" + i0) );
					}

					var simple = declarator.init.type === 'Identifier' && !declarator.init.rewritten;

					var name = simple ? declarator.init.name : declarator.findScope( true ).createIdentifier( 'ref' );

					var statementGenerators = [];

					if ( simple ) {
						code.remove( declarator.id.end, declarator.end );
					} else {
						statementGenerators.push( function ( start, prefix, suffix ) {
							code.insertRight( declarator.id.end, ("var " + name) );
							code.insertLeft( declarator.init.end, ("" + suffix) );
							code.move( declarator.id.end, declarator.end, start );
						});
					}

					destructure( code, declarator.findScope( false ), declarator.id, name, inline, statementGenerators );

					var prefix = inline ? 'var ' : '';
					var suffix = inline ? ", " : (";\n" + i0);
					statementGenerators.forEach( function ( fn, j ) {
						if ( i === this$1.declarations.length - 1 && j === statementGenerators.length - 1 ) {
							suffix = inline ? '' : ';';
						}

						fn( declarator.start, j === 0 ? prefix : '', suffix );
					});
				}

				declarator.transpile( code, transforms );

				c = declarator.end;
				lastDeclaratorIsPattern = declarator.id.type !== 'Identifier';
			});

			if ( lastDeclaratorIsPattern ) {
				code.remove( c, this.end );
			}
		}

		else {
			this.declarations.forEach( function ( declarator ) {
				declarator.transpile( code, transforms );
			});
		}
	};

	return VariableDeclaration;
}(Node));

var VariableDeclarator = (function (Node$$1) {
	function VariableDeclarator () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) VariableDeclarator.__proto__ = Node$$1;
	VariableDeclarator.prototype = Object.create( Node$$1 && Node$$1.prototype );
	VariableDeclarator.prototype.constructor = VariableDeclarator;

	VariableDeclarator.prototype.initialise = function initialise ( transforms ) {
		var kind = this.parent.kind;
		if ( kind === 'let' && this.parent.parent.type === 'ForStatement' ) {
			kind = 'for.let'; // special case...
		}

		this.parent.scope.addDeclaration( this.id, kind );
		Node$$1.prototype.initialise.call( this, transforms );
	};

	VariableDeclarator.prototype.transpile = function transpile ( code, transforms ) {
		if ( !this.init && transforms.letConst && this.parent.kind !== 'var' ) {
			var inLoop = this.findNearest( /Function|^For(In|Of)?Statement|^(?:Do)?WhileStatement/ );
			if ( inLoop && ! /Function/.test( inLoop.type ) && ! this.isLeftDeclaratorOfLoop() ) {
				code.insertLeft( this.id.end, ' = (void 0)' );
			}
		}

		if ( this.id ) this.id.transpile( code, transforms );
		if ( this.init ) this.init.transpile( code, transforms );
	};

	VariableDeclarator.prototype.isLeftDeclaratorOfLoop = function isLeftDeclaratorOfLoop () {
		return this.parent
			&& this.parent.type === 'VariableDeclaration'
			&& this.parent.parent
			&& (this.parent.parent.type === 'ForInStatement'
				|| this.parent.parent.type === 'ForOfStatement')
			&& this.parent.parent.left
			&& this.parent.parent.left.declarations[0] === this;
	};

	return VariableDeclarator;
}(Node));

var types = {
	ArrayExpression: ArrayExpression,
	ArrowFunctionExpression: ArrowFunctionExpression,
	AssignmentExpression: AssignmentExpression,
	BinaryExpression: BinaryExpression,
	BreakStatement: BreakStatement,
	CallExpression: CallExpression,
	ClassBody: ClassBody,
	ClassDeclaration: ClassDeclaration,
	ClassExpression: ClassExpression,
	ContinueStatement: ContinueStatement,
	DoWhileStatement: LoopStatement,
	ExportNamedDeclaration: ExportNamedDeclaration,
	ExportDefaultDeclaration: ExportDefaultDeclaration,
	ForStatement: ForStatement,
	ForInStatement: ForInStatement,
	ForOfStatement: ForOfStatement,
	FunctionDeclaration: FunctionDeclaration,
	FunctionExpression: FunctionExpression,
	Identifier: Identifier,
	IfStatement: IfStatement,
	ImportDeclaration: ImportDeclaration,
	ImportDefaultSpecifier: ImportDefaultSpecifier,
	ImportSpecifier: ImportSpecifier,
	JSXAttribute: JSXAttribute,
	JSXClosingElement: JSXClosingElement,
	JSXElement: JSXElement,
	JSXExpressionContainer: JSXExpressionContainer,
	JSXOpeningElement: JSXOpeningElement,
	JSXSpreadAttribute: JSXSpreadAttribute,
	Literal: Literal,
	MemberExpression: MemberExpression,
	NewExpression: NewExpression,
	ObjectExpression: ObjectExpression,
	Property: Property,
	ReturnStatement: ReturnStatement,
	SpreadProperty: SpreadProperty,
	Super: Super,
	TaggedTemplateExpression: TaggedTemplateExpression,
	TemplateElement: TemplateElement,
	TemplateLiteral: TemplateLiteral,
	ThisExpression: ThisExpression,
	UpdateExpression: UpdateExpression,
	VariableDeclaration: VariableDeclaration,
	VariableDeclarator: VariableDeclarator,
	WhileStatement: LoopStatement
};

var statementsWithBlocks = {
	IfStatement: 'consequent',
	ForStatement: 'body',
	ForInStatement: 'body',
	ForOfStatement: 'body',
	WhileStatement: 'body',
	DoWhileStatement: 'body',
	ArrowFunctionExpression: 'body'
};

function wrap ( raw, parent ) {
	if ( !raw ) return;

	if ( 'length' in raw ) {
		var i = raw.length;
		while ( i-- ) wrap( raw[i], parent );
		return;
	}

	// with e.g. shorthand properties, key and value are
	// the same node. We don't want to wrap an object twice
	if ( raw.__wrapped ) return;
	raw.__wrapped = true;

	if ( !keys[ raw.type ] ) {
		keys[ raw.type ] = Object.keys( raw ).filter( function ( key ) { return typeof raw[ key ] === 'object'; } );
	}

	// special case – body-less if/for/while statements. TODO others?
	var bodyType = statementsWithBlocks[ raw.type ];
	if ( bodyType && raw[ bodyType ].type !== 'BlockStatement' ) {
		var expression = raw[ bodyType ];

		// create a synthetic block statement, otherwise all hell
		// breaks loose when it comes to block scoping
		raw[ bodyType ] = {
			start: expression.start,
			end: expression.end,
			type: 'BlockStatement',
			body: [ expression ],
			synthetic: true
		};
	}

	new Node( raw, parent );

	var type = ( raw.type === 'BlockStatement' ? BlockStatement : types[ raw.type ] ) || Node;
	raw.__proto__ = type.prototype;
}

var letConst = /^(?:let|const)$/;

function Scope ( options ) {
	options = options || {};

	this.parent = options.parent;
	this.isBlockScope = !!options.block;

	var scope = this;
	while ( scope.isBlockScope ) scope = scope.parent;
	this.functionScope = scope;

	this.identifiers = [];
	this.declarations = Object.create( null );
	this.references = Object.create( null );
	this.blockScopedDeclarations = this.isBlockScope ? null : Object.create( null );
	this.aliases = this.isBlockScope ? null : Object.create( null );
}

Scope.prototype = {
	addDeclaration: function addDeclaration ( node, kind ) {
		for ( var i = 0, list = extractNames( node ); i < list.length; i += 1 ) {
			var identifier = list[i];

			var name = identifier.name;
			var existingDeclaration = this.declarations[ name ];
			if ( existingDeclaration && ( letConst.test( kind ) || letConst.test( existingDeclaration.kind ) ) ) {
				// TODO warn about double var declarations?
				throw new CompileError( identifier, (name + " is already declared") );
			}

			var declaration = { name: name, node: identifier, kind: kind, instances: [] };
			this.declarations[ name ] = declaration;

			if ( this.isBlockScope ) {
				if ( !this.functionScope.blockScopedDeclarations[ name ] ) this.functionScope.blockScopedDeclarations[ name ] = [];
				this.functionScope.blockScopedDeclarations[ name ].push( declaration );
			}
		}
	},

	addReference: function addReference ( identifier ) {
		if ( this.consolidated ) {
			this.consolidateReference( identifier );
		} else {
			this.identifiers.push( identifier );
		}
	},

	consolidate: function consolidate () {
		var this$1 = this;

		for ( var i = 0; i < this$1.identifiers.length; i += 1 ) { // we might push to the array during consolidation, so don't cache length
			var identifier = this$1.identifiers[i];
			this$1.consolidateReference( identifier );
		}

		this.consolidated = true; // TODO understand why this is necessary... seems bad
	},

	consolidateReference: function consolidateReference ( identifier ) {
		var declaration = this.declarations[ identifier.name ];
		if ( declaration ) {
			declaration.instances.push( identifier );
		} else {
			this.references[ identifier.name ] = true;
			if ( this.parent ) this.parent.addReference( identifier );
		}
	},

	contains: function contains ( name ) {
		return this.declarations[ name ] ||
		       ( this.parent ? this.parent.contains( name ) : false );
	},

	createIdentifier: function createIdentifier ( base ) {
		var this$1 = this;

		if ( typeof base === 'number' ) base = base.toString();

		base = base
			.replace( /\s/g, '' )
			.replace( /\[([^\]]+)\]/g, '_$1' )
			.replace( /[^a-zA-Z0-9_$]/g, '_' )
			.replace( /_{2,}/, '_' );

		var name = base;
		var counter = 1;

		while ( this$1.declarations[ name ] || this$1.references[ name ] || this$1.aliases[ name ] || name in reserved ) {
			name = base + "$" + (counter++);
		}

		this.aliases[ name ] = true;
		return name;
	},

	findDeclaration: function findDeclaration ( name ) {
		return this.declarations[ name ] ||
		       ( this.parent && this.parent.findDeclaration( name ) );
	}
};

function isUseStrict ( node ) {
	if ( !node ) return false;
	if ( node.type !== 'ExpressionStatement' ) return false;
	if ( node.expression.type !== 'Literal' ) return false;
	return node.expression.value === 'use strict';
}

var BlockStatement = (function (Node$$1) {
	function BlockStatement () {
		Node$$1.apply(this, arguments);
	}

	if ( Node$$1 ) BlockStatement.__proto__ = Node$$1;
	BlockStatement.prototype = Object.create( Node$$1 && Node$$1.prototype );
	BlockStatement.prototype.constructor = BlockStatement;

	BlockStatement.prototype.createScope = function createScope () {
		var this$1 = this;

		this.parentIsFunction = /Function/.test( this.parent.type );
		this.isFunctionBlock = this.parentIsFunction || this.parent.type === 'Root';
		this.scope = new Scope({
			block: !this.isFunctionBlock,
			parent: this.parent.findScope( false )
		});

		if ( this.parentIsFunction ) {
			this.parent.params.forEach( function ( node ) {
				this$1.scope.addDeclaration( node, 'param' );
			});
		}
	};

	BlockStatement.prototype.initialise = function initialise ( transforms ) {
		this.thisAlias = null;
		this.argumentsAlias = null;
		this.defaultParameters = [];

		// normally the scope gets created here, during initialisation,
		// but in some cases (e.g. `for` statements), we need to create
		// the scope early, as it pertains to both the init block and
		// the body of the statement
		if ( !this.scope ) this.createScope();

		this.body.forEach( function ( node ) { return node.initialise( transforms ); } );

		this.scope.consolidate();
	};

	BlockStatement.prototype.findLexicalBoundary = function findLexicalBoundary () {
		if ( this.type === 'Program' ) return this;
		if ( /^Function/.test( this.parent.type ) ) return this;

		return this.parent.findLexicalBoundary();
	};

	BlockStatement.prototype.findScope = function findScope ( functionScope ) {
		if ( functionScope && !this.isFunctionBlock ) return this.parent.findScope( functionScope );
		return this.scope;
	};

	BlockStatement.prototype.getArgumentsAlias = function getArgumentsAlias () {
		if ( !this.argumentsAlias ) {
			this.argumentsAlias = this.scope.createIdentifier( 'arguments' );
		}

		return this.argumentsAlias;
	};

	BlockStatement.prototype.getArgumentsArrayAlias = function getArgumentsArrayAlias () {
		if ( !this.argumentsArrayAlias ) {
			this.argumentsArrayAlias = this.scope.createIdentifier( 'argsArray' );
		}

		return this.argumentsArrayAlias;
	};

	BlockStatement.prototype.getThisAlias = function getThisAlias () {
		if ( !this.thisAlias ) {
			this.thisAlias = this.scope.createIdentifier( 'this' );
		}

		return this.thisAlias;
	};

	BlockStatement.prototype.getIndentation = function getIndentation () {
		var this$1 = this;

		if ( this.indentation === undefined ) {
			var source = this.program.magicString.original;

			var useOuter = this.synthetic || !this.body.length;
			var c = useOuter ? this.start : this.body[0].start;

			while ( c && source[c] !== '\n' ) c -= 1;

			this.indentation = '';

			while ( true ) { // eslint-disable-line no-constant-condition
				c += 1;
				var char = source[c];

				if ( char !== ' ' && char !== '\t' ) break;

				this$1.indentation += char;
			}

			var indentString = this.program.magicString.getIndentString();

			// account for dedented class constructors
			var parent = this.parent;
			while ( parent ) {
				if ( parent.kind === 'constructor' && !parent.parent.parent.superClass ) {
					this$1.indentation = this$1.indentation.replace( indentString, '' );
				}

				parent = parent.parent;
			}

			if ( useOuter ) this.indentation += indentString;
		}

		return this.indentation;
	};

	BlockStatement.prototype.transpile = function transpile ( code, transforms ) {
		var this$1 = this;

		var indentation = this.getIndentation();

		var introStatementGenerators = [];

		if ( this.argumentsAlias ) {
			introStatementGenerators.push( function ( start, prefix, suffix ) {
				var assignment = prefix + "var " + (this$1.argumentsAlias) + " = arguments" + suffix;
				code.insertLeft( start, assignment );
			});
		}

		if ( this.thisAlias ) {
			introStatementGenerators.push( function ( start, prefix, suffix ) {
				var assignment = prefix + "var " + (this$1.thisAlias) + " = this" + suffix;
				code.insertLeft( start, assignment );
			});
		}

		if ( this.argumentsArrayAlias ) {
			introStatementGenerators.push( function ( start, prefix, suffix ) {
				var i = this$1.scope.createIdentifier( 'i' );
				var assignment = prefix + "var " + i + " = arguments.length, " + (this$1.argumentsArrayAlias) + " = Array(" + i + ");\n" + indentation + "while ( " + i + "-- ) " + (this$1.argumentsArrayAlias) + "[" + i + "] = arguments[" + i + "]" + suffix;
				code.insertLeft( start, assignment );
			});
		}

		if ( /Function/.test( this.parent.type ) ) {
			this.transpileParameters( code, transforms, indentation, introStatementGenerators );
		}

		if ( transforms.letConst && this.isFunctionBlock ) {
			this.transpileBlockScopedIdentifiers( code );
		}

		Node$$1.prototype.transpile.call( this, code, transforms );

		if ( this.synthetic ) {
			if ( this.parent.type === 'ArrowFunctionExpression' ) {
				var expr = this.body[0];

				if ( introStatementGenerators.length ) {
					code.insertLeft( this.start, "{" ).insertRight( this.end, ((this.parent.getIndentation()) + "}") );

					code.insertRight( expr.start, ("\n" + indentation + "return ") );
					code.insertLeft( expr.end, ";\n" );
				} else if ( transforms.arrow ) {
					code.insertLeft( expr.start, "{ return " );
					code.insertLeft( expr.end, "; }" );
				}
			}

			else if ( introStatementGenerators.length ) {
				code.insertLeft( this.start, "{" ).insertRight( this.end, "}" );
			}
		}

		var start;
		if ( isUseStrict( this.body[0] ) ) {
			start = this.body[0].end;
		} else if ( this.synthetic || this.parent.type === 'Root' ) {
			start = this.start;
		} else {
			start = this.start + 1;
		}

		var prefix = "\n" + indentation;
		var suffix = ';';
		introStatementGenerators.forEach( function ( fn, i ) {
			if ( i === introStatementGenerators.length - 1 ) suffix = ";\n";
			fn( start, prefix, suffix );
		});
	};

	BlockStatement.prototype.transpileParameters = function transpileParameters ( code, transforms, indentation, introStatementGenerators ) {
		var this$1 = this;

		var params = this.parent.params;

		params.forEach( function ( param ) {
			if ( param.type === 'AssignmentPattern' && param.left.type === 'Identifier' ) {
				if ( transforms.defaultParameter ) {
					introStatementGenerators.push( function ( start, prefix, suffix ) {
						var lhs = prefix + "if ( " + (param.left.name) + " === void 0 ) " + (param.left.name);

						code
							.insertRight( param.left.end, lhs )
							.move( param.left.end, param.right.end, start )
							.insertLeft( param.right.end, suffix );
					});
				}
			}

			else if ( param.type === 'RestElement' ) {
				if ( transforms.spreadRest ) {
					introStatementGenerators.push( function ( start, prefix, suffix ) {
						var penultimateParam = params[ params.length - 2 ];

						if ( penultimateParam ) {
							code.remove( penultimateParam ? penultimateParam.end : param.start, param.end );
						} else {
							var start$1 = param.start, end = param.end; // TODO https://gitlab.com/Rich-Harris/buble/issues/8

							while ( /\s/.test( code.original[ start$1 - 1 ] ) ) start$1 -= 1;
							while ( /\s/.test( code.original[ end ] ) ) end += 1;

							code.remove( start$1, end );
						}

						var name = param.argument.name;
						var len = this$1.scope.createIdentifier( 'len' );
						var count = params.length - 1;

						if ( count ) {
							code.insertLeft( start, (prefix + "var " + name + " = [], " + len + " = arguments.length - " + count + ";\n" + indentation + "while ( " + len + "-- > 0 ) " + name + "[ " + len + " ] = arguments[ " + len + " + " + count + " ]" + suffix) );
						} else {
							code.insertLeft( start, (prefix + "var " + name + " = [], " + len + " = arguments.length;\n" + indentation + "while ( " + len + "-- ) " + name + "[ " + len + " ] = arguments[ " + len + " ]" + suffix) );
						}
					});
				}
			}

			else if ( param.type !== 'Identifier' ) {
				if ( transforms.parameterDestructuring ) {
					var ref = this$1.scope.createIdentifier( 'ref' );
					destructure( code, this$1.scope, param, ref, false, introStatementGenerators );
					code.insertLeft( param.start, ref );
				}
			}
		});
	};

	BlockStatement.prototype.transpileBlockScopedIdentifiers = function transpileBlockScopedIdentifiers ( code ) {
		var this$1 = this;

		Object.keys( this.scope.blockScopedDeclarations ).forEach( function ( name ) {
			var declarations = this$1.scope.blockScopedDeclarations[ name ];

			for ( var i = 0, list = declarations; i < list.length; i += 1 ) {
				var declaration = list[i];

				var cont = false; // TODO implement proper continue...

				if ( declaration.kind === 'for.let' ) {
					// special case
					var forStatement = declaration.node.findNearest( 'ForStatement' );

					if ( forStatement.shouldRewriteAsFunction ) {
						var outerAlias = this$1.scope.createIdentifier( name );
						var innerAlias = forStatement.reassigned[ name ] ?
							this$1.scope.createIdentifier( name ) :
							name;

						declaration.name = outerAlias;
						code.overwrite( declaration.node.start, declaration.node.end, outerAlias, true );

						forStatement.aliases[ name ] = {
							outer: outerAlias,
							inner: innerAlias
						};

						for ( var i$1 = 0, list$1 = declaration.instances; i$1 < list$1.length; i$1 += 1 ) {
							var identifier = list$1[i$1];

							var alias = forStatement.body.contains( identifier ) ?
								innerAlias :
								outerAlias;

							if ( name !== alias ) {
								code.overwrite( identifier.start, identifier.end, alias, true );
							}
						}

						cont = true;
					}
				}

				if ( !cont ) {
					var alias$1 = this$1.scope.createIdentifier( name );

					if ( name !== alias$1 ) {
						declaration.name = alias$1;
						code.overwrite( declaration.node.start, declaration.node.end, alias$1, true );

						for ( var i$2 = 0, list$2 = declaration.instances; i$2 < list$2.length; i$2 += 1 ) {
							var identifier$1 = list$2[i$2];

							identifier$1.rewritten = true;
							code.overwrite( identifier$1.start, identifier$1.end, alias$1, true );
						}
					}
				}
			}
		});
	};

	return BlockStatement;
}(Node));

function Program ( source, ast, transforms, options ) {
	var this$1 = this;

	this.type = 'Root';

	// options
	this.jsx = options.jsx || 'React.createElement';
	this.options = options;

	this.source = source;
	this.magicString = new MagicString( source );

	this.ast = ast;
	this.depth = 0;

	wrap( this.body = ast, this );
	this.body.__proto__ = BlockStatement.prototype;

	this.indentExclusionElements = [];
	this.body.initialise( transforms );

	this.indentExclusions = Object.create( null );
	for ( var i$1 = 0, list = this.indentExclusionElements; i$1 < list.length; i$1 += 1 ) {
		var node = list[i$1];

		for ( var i = node.start; i < node.end; i += 1 ) {
			this$1.indentExclusions[ i ] = true;
		}
	}

	this.body.transpile( this.magicString, transforms );
}

Program.prototype = {
	export: function export$1 ( options ) {
		if ( options === void 0 ) options = {};

		return {
			code: this.magicString.toString(),
			map: this.magicString.generateMap({
				file: options.file,
				source: options.source,
				includeContent: options.includeContent !== false
			})
		};
	},

	findNearest: function findNearest () {
		return null;
	},

	findScope: function findScope () {
		return null;
	}
};

var matrix = {
	chrome: {
		    48: 1333689725,
		    49: 1342078975,
		    50: 1610514431,
		    51: 1610514431,
		    52: 2147385343
	},
	firefox: {
		    43: 1207307741,
		    44: 1207307741,
		    45: 1207307741,
		    46: 1476267485,
		    47: 1476296671,
		    48: 1476296671
	},
	safari: {
		     8: 1073741824,
		     9: 1328940894
	},
	ie: {
		     8: 0,
		     9: 1073741824,
		    10: 1073741824,
		    11: 1073770592
	},
	edge: {
		    12: 1591620701,
		    13: 1608400479
	},
	node: {
		'0.10': 1075052608,
		'0.12': 1091830852,
		     4: 1327398527,
		     5: 1327398527,
		     6: 1610514431
	}
};

var features = [
	'arrow',
	'classes',
	'collections',
	'computedProperty',
	'conciseMethodProperty',
	'constLoop',
	'constRedef',
	'defaultParameter',
	'destructuring',
	'extendNatives',
	'forOf',
	'generator',
	'letConst',
	'letLoop',
	'letLoopScope',
	'moduleExport',
	'moduleImport',
	'numericLiteral',
	'objectProto',
	'objectSuper',
	'oldOctalLiteral',
	'parameterDestructuring',
	'spreadRest',
	'stickyRegExp',
	'symbol',
	'templateString',
	'unicodeEscape',
	'unicodeIdentifier',
	'unicodeRegExp',

	// ES2016
	'exponentiation',

	// additional transforms, not from
	// https://featuretests.io
	'reservedProperties'
];

var version = "0.16.0";

var ref = [
	acornObjectSpread,
	acornJsx
].reduce( function ( final, plugin ) { return plugin( final ); }, acorn$1 );
var parse = ref.parse;

var dangerousTransforms = [
	'dangerousTaggedTemplateString',
	'dangerousForOf'
];

function target ( target ) {
	var targets = Object.keys( target );
	var bitmask = targets.length ?
		2147483647 :
		1073741824;

	Object.keys( target ).forEach( function ( environment ) {
		var versions = matrix[ environment ];
		if ( !versions ) throw new Error( ("Unknown environment '" + environment + "'. Please raise an issue at https://gitlab.com/Rich-Harris/buble/issues") );

		var targetVersion = target[ environment ];
		if ( !( targetVersion in versions ) ) throw new Error( ("Support data exists for the following versions of " + environment + ": " + (Object.keys( versions ).join( ', ')) + ". Please raise an issue at https://gitlab.com/Rich-Harris/buble/issues") );
		var support = versions[ targetVersion ];

		bitmask &= support;
	});

	var transforms = Object.create( null );
	features.forEach( function ( name, i ) {
		transforms[ name ] = !( bitmask & 1 << i );
	});

	dangerousTransforms.forEach( function ( name ) {
		transforms[ name ] = false;
	});

	return transforms;
}

function transform ( source, options ) {
	if ( options === void 0 ) options = {};

	var ast;
	var jsx = null;

	try {
		ast = parse( source, {
			ecmaVersion: 7,
			preserveParens: true,
			sourceType: 'module',
			onComment: function (block, text) {
				if ( !jsx ) {
					var match = /@jsx\s+([^\s]+)/.exec( text );
					if ( match ) jsx = match[1];
				}
			},
			plugins: {
				jsx: true,
				objectSpread: true
			}
		});
		options.jsx = jsx || options.jsx;
	} catch ( err ) {
		err.snippet = getSnippet( source, err.loc );
		err.toString = function () { return ((err.name) + ": " + (err.message) + "\n" + (err.snippet)); };
		throw err;
	}

	var transforms = target( options.target || {} );
	Object.keys( options.transforms || {} ).forEach( function ( name ) {
		if ( name === 'modules' ) {
			if ( !( 'moduleImport' in options.transforms ) ) transforms.moduleImport = options.transforms.modules;
			if ( !( 'moduleExport' in options.transforms ) ) transforms.moduleExport = options.transforms.modules;
			return;
		}

		if ( !( name in transforms ) ) throw new Error( ("Unknown transform '" + name + "'") );
		transforms[ name ] = options.transforms[ name ];
	});

	return new Program( source, ast, transforms, options ).export( options );
}

exports.target = target;
exports.transform = transform;
exports.VERSION = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=buble.deps.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../buffer/index.js */ 12).Buffer))

/***/ }),
/* 12 */
/*!***************************************!*\
  !*** ../node_modules/buffer/index.js ***!
  \***************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ 13)
var ieee754 = __webpack_require__(/*! ieee754 */ 14)
var isArray = __webpack_require__(/*! isarray */ 15)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3)))

/***/ }),
/* 13 */
/*!******************************************!*\
  !*** ../node_modules/base64-js/index.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 14 */
/*!****************************************!*\
  !*** ../node_modules/ieee754/index.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 15 */
/*!****************************************!*\
  !*** ../node_modules/isarray/index.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 16 */
/*!**********************************!*\
  !*** ./parser/parser_program.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! exports used: parse_program */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse_program = parse_program;

var _ast = __webpack_require__(/*! ./../ast/ast */ 1);

var _match = __webpack_require__(/*! ./match */ 2);

function parse_program(stream, meta) {
  // Get rid of the samedents in the begginings
  while (stream.peek().type == 'samedent') {
    stream.consume();
  }function parse_multiline_expression() {
    return parse_multiline_seq();
  }
  function parse_multiline_seq() {
    var first = parse_multiline_obj();

    var rest = [];
    while (stream.peek() && stream.peek().type == 'samedent') {
      stream.consume();
      rest.push(parse_multiline_obj());
    }

    if (rest.length > 0) {
      return (0, _ast.create_seq)([first].concat(rest));
    }

    return first;
  }
  function parse_multiline_obj() {
    var parsing_obj = stream.lookahead(1) && stream.lookahead(1).type == 'operator' && stream.lookahead(1).value == ':';

    if (parsing_obj) {
      var parse_obj_param = function parse_obj_param() {
        if (stream.peek().type == 'identifier') {
          var name = stream.consume().value;
          if (stream.peek().type == 'operator' && stream.peek().value == ':') {
            stream.consume();
            var value = parse_macro();
            return {
              name: name,
              value: value
            };
          }
          throw new Error('Colon operator was expected');
        }

        throw new Error('An identifier was expected');
      };

      var first = parse_obj_param();

      var rest = [];
      while (stream.peek() && stream.peek().type == 'samedent') {
        stream.consume();
        rest.push(parse_obj_param());
      }
      var params = [first].concat(rest);
      var keys = params.map(function (p) {
        return p.name;
      });
      var values = params.map(function (p) {
        return p.value;
      });
      return (0, _ast.create_obj)(keys, values);
    } else return parse_macro();
  }
  function parse_macro() {
    if (stream.peek().type == 'identifier') {
      var name = stream.peek().value;
      var is_macro = meta.syntax.some(function (m) {
        return m.name == name;
      });
      if (is_macro) {
        // TODO: Make more secure by evaluating in an isolated context
        var macro = meta.syntax.filter(function (m) {
          return m.name == name;
        })[0];
        var parse = eval(macro.parser);
        var result = parse();
        result.type = 'macro';
        result.generator = macro.generator;
        return result;
      }

      return parse_juxt();
    }

    return parse_juxt();
  }
  function parse_juxt() {
    var left = parse_seq();

    if (stream.peek() && stream.peek().type != 'samedent') {
      var right = parse_seq();

      return (0, _ast.create_apply)(left, right);
    }

    return left;
  }
  function parse_seq() {
    var first = parse_obj();

    var rest = [];
    while (stream.peek() && stream.peek().type == 'comma') {
      stream.consume();
      rest.push(parse_obj());
    }

    if (rest.length > 0) {
      return (0, _ast.create_seq)([first].concat(rest));
    }

    return first;
  }
  function parse_obj() {
    var parsing_obj = stream.lookahead(1) && stream.lookahead(1).type == 'operator' && stream.lookahead(1).value == ':';

    if (parsing_obj) {
      var parse_obj_param = function parse_obj_param() {
        if (stream.peek().type == 'identifier') {
          var name = stream.consume().value;
          if (stream.peek().type == 'operator' && stream.peek().value == ':') {
            stream.consume();
            var value = parse_op();
            return {
              name: name,
              value: value
            };
          }
          throw new Error('Colon operator was expected');
        }

        throw new Error('An identifier was expected');
      };

      var first = parse_obj_param();

      var rest = [];
      while (stream.peek() && stream.peek().type == 'comma') {
        stream.consume();
        rest.push(parse_obj_param());
      }
      var params = [first].concat(rest);
      var keys = params.map(function (p) {
        return p.name;
      });
      var values = params.map(function (p) {
        return p.value;
      });
      return (0, _ast.create_obj)(keys, values);
    } else return parse_op();
  }
  function parse_op() {
    var first = parse_apply();

    var values = [];
    var operators = [];
    while (stream.peek() && stream.peek().type == 'operator') {
      var operator = stream.consume().value;
      operators.push(operator);
      values.push(parse_apply());
    }

    if (values.length > 0) {
      return (0, _ast.create_op)([first].concat(values), operators);
    }

    return first;
  }
  function parse_apply() {
    var left = parse_value();

    if (stream.peek() && stream.peek().type == 'paren_open') {
      stream.consume();
      var right = parse_multiline_expression();
      // Consume the paren_close
      stream.consume();
      return (0, _ast.create_apply)(left, right);
    }

    return left;
  }
  function parse_value() {
    if (stream.peek().type == 'paren_open') {
      stream.consume();
      var expr = parse_multiline_expression();
      // Consume the paren_close
      stream.consume();
      return expr;
    }

    if (stream.peek().type == 'identifier') {
      return (0, _ast.create_identifier)(stream.consume().value);
    }

    if (stream.peek().type == 'string' || stream.peek().type == 'number') {
      return (0, _ast.create_literal)(stream.consume().value);
    }

    throw new Error('Internal parser error parsing ' + JSON.stringify(stream.peek()));
  }

  return parse_multiline_expression();
}

/***/ }),
/* 17 */
/*!******************************************!*\
  !*** ../node_modules/treeify/treeify.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! exports used: asTree */
/***/ (function(module, exports, __webpack_require__) {

//     treeify.js
//     Luke Plaster <notatestuser@gmail.com>
//     https://github.com/notatestuser/treeify.js

// do the universal module definition dance
(function (root, factory) {

  if (true) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.treeify = factory();
  }

}(this, function() {

  function makePrefix(key, last) {
    var str = (last ? '└' : '├');
    if (key) {
      str += '─ ';
    } else {
      str += '──┐';
    }
    return str;
  }

  function filterKeys(obj, hideFunctions) {
    var keys = [];
    for (var branch in obj) {
      // always exclude anything in the object's prototype
      if (!obj.hasOwnProperty(branch)) {
        continue;
      }
      // ... and hide any keys mapped to functions if we've been told to
      if (hideFunctions && ((typeof obj[branch])==="function")) {
        continue;
      }
      keys.push(branch);
    }
    return keys;
  }

  function growBranch(key, root, last, lastStates, showValues, hideFunctions, callback) {
    var line = '', index = 0, lastKey, circular, lastStatesCopy = lastStates.slice(0);

    if (lastStatesCopy.push([ root, last ]) && lastStates.length > 0) {
      // based on the "was last element" states of whatever we're nested within,
      // we need to append either blankness or a branch to our line
      lastStates.forEach(function(lastState, idx) {
        if (idx > 0) {
          line += (lastState[1] ? ' ' : '│') + '  ';
        }
        if ( ! circular && lastState[0] === root) {
          circular = true;
        }
      });

      // the prefix varies based on whether the key contains something to show and
      // whether we're dealing with the last element in this collection
      line += makePrefix(key, last) + key;

      // append values and the circular reference indicator
      showValues && typeof root !== 'object' && (line += ': ' + root);
      circular && (line += ' (circular ref.)');

      callback(line);
    }

    // can we descend into the next item?
    if ( ! circular && typeof root === 'object') {
      var keys = filterKeys(root, hideFunctions);
      keys.forEach(function(branch){
        // the last key is always printed with a different prefix, so we'll need to know if we have it
        lastKey = ++index === keys.length;

        // hold your breath for recursive action
        growBranch(branch, root[branch], lastKey, lastStatesCopy, showValues, hideFunctions, callback);
      });
    }
  };

  // --------------------

  var Treeify = {};

  // Treeify.asLines
  // --------------------
  // Outputs the tree line-by-line, calling the lineCallback when each one is available.

  Treeify.asLines = function(obj, showValues, hideFunctions, lineCallback) {
    /* hideFunctions and lineCallback are curried, which means we don't break apps using the older form */
    var hideFunctionsArg = typeof hideFunctions !== 'function' ? hideFunctions : false;
    growBranch('.', obj, false, [], showValues, hideFunctionsArg, lineCallback || hideFunctions);
  };

  // Treeify.asTree
  // --------------------
  // Outputs the entire tree, returning it as a string with line breaks.

  Treeify.asTree = function(obj, showValues, hideFunctions) {
    var tree = '';
    growBranch('.', obj, false, [], showValues, hideFunctions, function(line) {
      tree += line + '\n';
    });
    return tree;
  };

  // --------------------

  return Treeify;

}));


/***/ }),
/* 18 */
/*!**********************!*\
  !*** ./testcode.txt ***!
  \**********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "meta Module where\r\n    syntax let\r\n        parse '() => { stream.consume(); let ident = parse_value(); stream.consume(); return { ident: ident, expr: parse_juxt() } }'\r\n        generate '() => true'\r\nlet player = x: 10, y: 20, name: 'Skyne'\r\nrun silent: 'yes', good: 'no'"

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map