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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************!*\
  !*** ./cube.coffee ***!
  \*********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lexer_lexer__ = __webpack_require__(/*! ./lexer/lexer */ 1);
var code;



code = __webpack_require__(/*! ./testcode.txt */ 5);

console.log(Object(__WEBPACK_IMPORTED_MODULE_0__lexer_lexer__["a" /* lex */])(code));


/***/ }),
/* 1 */
/*!****************************!*\
  !*** ./lexer/lexer.coffee ***!
  \****************************/
/*! exports provided: lex */
/*! exports used: lex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return lex; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lex__ = __webpack_require__(/*! lex */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_indent__ = __webpack_require__(/*! detect-indent */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_indent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_detect_indent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__ = __webpack_require__(/*! ./../utils/span.coffee */ 4);






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
        type: 'sameden'
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
      value: lexeme.splice(1, -1),
      span: Object(__WEBPACK_IMPORTED_MODULE_2__utils_span_coffee__["a" /* create_span */])(code, position, lexeme.length, row, column, row, column + lexeme.length)
    };
    column += lexeme.splice(1, -1).length;
    position += lexeme.splice(1, -1).length;
    return result;
  });
  lexer.addRule(/'[^'\\\r\n]*(?:\\.[^'\\\r\n]*)*'/, function(lexeme) {
    var result;
    result = {
      type: 'string',
      value: lexeme.splice(1, -1),
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
  lexer.addRule(/[\+\-\\\*\/|><:;\.]+/, function(lexeme) {
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
/* 2 */
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
/* 3 */
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
/* 4 */
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
/* 5 */
/*!**********************!*\
  !*** ./testcode.txt ***!
  \**********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "define\r\n    sub\r\n    sub\r\n        sub2\r\ndefine\r\n    sub"

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map