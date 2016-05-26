'use strict'
const EventEmitter = require('eventemitter3')
const util = require('util')

const Log = function (){
	this.logLines = []
	this.wrappers = []

	return this
}

util.inherits(Log, EventEmitter)

Log.prototype.addWrapper = function(wrapper) {
	var self = this

	wrapper.on('operation', function(e){
		console.log('=> operation', e)
		self.logLines.push(e)
	})
}

Log.prototype.addWriter = function(writer) {
	var self = this

	this.on('operation', function(e){
		writer.emit('operation', e)
	})
}

Log.prototype.toJSON = function() {
	return {
		logLines: this.logLines,
		wrappers: this.wrappers,
		writers: this.writers
	}
}

Log.prototype.write = function(preset, outcome) {
	var operation = {
		preset,
		outcome
	}

	this.logLines.push(operation)
	this.emit('operation', operation)
}


const Writer = function () {}
util.inherits(Writer, EventEmitter)

const Wrapper = function () {}
util.inherits(Wrapper, EventEmitter)

Wrapper.prototype.foo = function (){
	this.emit('operation', {success: true})
}

const RecordTape = {
	createLog(options){
		options = options || {}

		return new Log(options)
	}
}

RecordTape.Log = Log
RecordTape.Writer = Writer
RecordTape.Wrapper = Wrapper

RecordTape.wrappers = {}

RecordTape.wrappers.BackboneModel = require('../wrappers/backbone-model')

module.exports = RecordTape