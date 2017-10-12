export create_span = (code, position, length, start_row, start_column, end_row, end_column) =>
    return {
        snippet: code.slice(position, position + length)
        position: position
        length: length
        start_row: start_row
        start_column: start_column
        end_row: end_row
        end_column: end_column
    }