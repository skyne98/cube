import { match_identifier, match_identifier_peek } from './match'
import * as buble from 'buble'

export parse_meta = (stream) =>
    try
        match_identifier_peek stream, 'meta' # not to lose the first token
        stream.consume()
        name = 'default'
        try
            match_identifier_peek stream, 'where'
            stream.consume()
        catch error
            name = stream.consume().value
            match_identifier stream, 'where'
        
        if stream.peek().type != 'indent' then return { implicit: false, name: name, lines: [] }
        # there is an indentation
        stream.consume()

        # function to parse meta line
        parse_meta_line = () =>
            parse_syntax = () => 
                stream.consume()
                if stream.peek().type != 'identifier' then throw new Error 'Name of the syntax was expected'
                syntax_name = stream.consume().value
                syntax = { type: 'syntax', name: syntax_name }
                if stream.peek().type == 'indent'
                    stream.consume()
                    while stream.peek().type != 'dedent'
                        if stream.peek().type == 'samedent' then stream.consume()
                        if stream.peek().type != 'identifier' then throw new Error '"parse" or "generate" identifiers were expected, but ' + stream.peek().type + ' were found'
                        type = stream.peek().value
                        switch type
                            when 'parse'
                                stream.consume()
                                code = stream.consume()
                                if code.type != 'string' then throw new Error 'Code in string format was expected'
                                code = (buble.transform code.value).code
                                syntax.parser = code
                            when 'generate'
                                stream.consume()
                                code = stream.consume()
                                if code.type != 'string' then throw new Error 'Code in string format was expected'
                                code = (buble.transform code.value).code
                                syntax.generator = code
                            else throw new Error '"parse" or "generate" identifiers were expected, but ' + type + ' were found'
                                    
                    stream.consume()
                    return syntax
                else
                    throw new Error 'Indentation was expected after the "syntax" declaration, but ' + JSON.stringify(stream.peek()) + ' was found'

            next = stream.peek()
            if next.type != 'identifier'
                throw new Error 'An identifier was expected'
            switch next.value
                when 'syntax'
                    return parse_syntax()
                else throw new Error '"syntax" or "import" lines where expected, but ' + next.value + ' was found.'

        lines = []
        lines.push parse_meta_line()
        while stream.peek().type == 'samedent'
            stream.consume()
            lines.push parse_meta_line()
        # Consume the dedent token
        stream.consume()

        syntax = []
        imports = []

        for line in lines
            switch line.type
                when 'syntax'
                    syntax.push line
                else imports.push line
                    
        return { implicit: false, name: name, syntax: syntax, imports: imports }

    catch error
        console.log '%o', error 
        return { implicit: true }