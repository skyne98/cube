import { lex } from './lexer/lexer'
import { parse } from './parser/parser'
import * as treeify from 'treeify'

code = require './testcode.txt'
console.log treeify.asTree (parse code), true