var fs = require('fs')
var co = require('co')
var request = require('request-promise')
var match = require('match-json')

var basePath = 'http://localhost:3000'

var log = fs.readFileSync('./log.json', 'utf-8').split('\n')
.filter(function(logLine){
	return logLine
})
.map(function(logLine){
	return JSON.parse(logLine)
})



co(function *(){
	for (var i in log) {
		var logLine = log[i] 
		var path = basePath + logLine.preset.path
		// console.log("=> ", logLine )
		console.log("=> " + logLine.preset.method + " " + path)

		var body = yield request({
			method: logLine.preset.method,
			uri: path,
			json: true
		})

		console.log( match(body, logLine.outcome.body), body, logLine.outcome.body)
	}	
}).catch(function(err){
	console.log('=> Err:', err, err.stack)
})