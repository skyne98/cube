export streamify = (array) =>
    return {
        array: array
        consume: () ->
            @array.shift()
        lookahead: (items) ->
            @array[items]
        peek: () ->
            @lookahead 0
    }