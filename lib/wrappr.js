// From: Wrapping JavaScript Functions
// http://blakeembrey.com/articles/2014/01/wrapping-javascript-functions/
var wrap = function (fn, over, under, contextFn) {
	return function() {
		var context = contextFn()

		over.apply(this, [context].concat(arguments) )
		var result = fn.apply(this, arguments)
		under.apply(this, [result, context].concat(arguments) )

		return result
	}
}

module.exports = wrap