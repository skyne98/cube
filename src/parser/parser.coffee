import { lex } from './../lexer/lexer'
import { streamify } from './../utils/stream'
import { identifer } from './../ast/ast'
import { parse_meta } from './parser_meta'
import { parse_program } from './parser_program'

export parse = (code) =>
    lexed = lex code
    stream = streamify lexed.filter (i) => i.type != 'whitespace'
    meta = parse_meta stream
    
    return parse_program stream, meta