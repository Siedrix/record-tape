const RecordTape = require('../lib/record-tape')
const util = require('util')
const fs = require('fs')
const os = require('os')

const FileWriter = function(options){
	options = options || {}

	if(!options.path){
		throw new Error('File Writer requires a path')
	}

	this.on('operation', function(op){
		fs.appendFile(options.path, JSON.stringify(op) + os.EOL, function(err){
			if(err){
				throw new Error('File Writer couldn\'t append opperation')
			}
		})
	})
}

util.inherits(FileWriter, RecordTape.Writer)

module.exports = FileWriter