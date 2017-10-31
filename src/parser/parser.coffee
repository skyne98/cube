import { lex } from './../lexer/lexer'
import { streamify } from './../utils/stream'
import { parse_program } from './parser_program'
import Resolver from './../resolver/resolver'

export parse = (code, resolver) =>
    lexed = lex code
    stream = streamify lexed.filter (i) => i.type != 'whitespace'
    ast = parse_program stream, resolver

    return ast