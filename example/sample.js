// Record tape set up
const RecordTape = require('../lib/record-tape')
const FileWriter = require('../writers/file')

var log = RecordTape.createLog()
var consoleWriter = new RecordTape.Writer()
consoleWriter.on('operation', function(logLine){
	console.log('=>', logLine.preset.method, logLine.preset.path)
})
log.addWriter(consoleWriter)

var fileWriter = new FileWriter({path:'./log.json'})
log.addWriter(fileWriter)

var recordTapeMiddleware = function *(next){
	var preset = {
		path: this.path,
		method: this.method,
		headers: this.headers,
		server: 'lolz\nfoo\ncat'
	}

	yield next

	var result = {
		body: this.body
	}

	log.write(preset, result)
}

// Server set up
var app = require('koa')();
var router = require('koa-router')();

if(process.env.RECORD){
	router.use(recordTapeMiddleware)
}

router.get('/', function *(next) {
	this.body = {success:true}
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000)