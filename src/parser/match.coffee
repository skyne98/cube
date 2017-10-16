export match_identifier = (stream, value) =>
	token = stream.consume()
	if token.type != 'identifier' || token.value != value
		throw new Error 'Was expecting an identifier with value "' + value + '", but found ' + JSON.stringify token
	return token 
export match_identifier_peek = (stream, value) =>
	token = stream.peek()
	if token.type != 'identifier' || token.value != value
		throw new Error 'Was expecting an identifier with value "' + value + '", but found ' + JSON.stringify token
	return token
