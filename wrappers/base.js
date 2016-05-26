'use strict'
var wrappr = require('./wrappr')
var assert = require('assert')
var match = require('match-json')
var _ = require('underscore')

class RecordTape {
	constructor(Model, functionName){
		this._operations = []
		this._tracking = false

		this.Model = Model
		this.functionName = functionName

		// Wraps function
		var self = this
		var Model = self.Model
		var fn = wrappr(
			Model.prototype[self.functionName],
			function(context){
				context.data.before = this.toJSON()
			},
			function(result, context){
				context.data.after = this.toJSON()
				context.data.result = result

				if(context.tracking){
					self._operations.push(context.data)
				}
			},
			function(){
				return {
					tracking:self._tracking,
					data:{}
				}
			}
		)

		Model.prototype[self.functionName] = fn
	}

	track(){
		this._tracking = true
	}

	stopTracking(){
		this._tracking = false
	}

	run(){
		var self = this
		var operations = this._operations.slice(0)

		this._operations = []
		this.track()

		operations.forEach(function(operation){
			var m = new self.Model()
			m.attributes = _.clone(operation.before)
			var result = m[self.functionName]()

			if(
				!match( m.toJSON(), operation.after ) ||
				!match( result, operation.result )
			){
				throw new Error('Operation didnt got the expected results')
			}
		})
	}

	getLog(){
		return this._operations.slice(0)
	}

	loadLog(log){
		this._operations = log.slice(0)
	}
}

module.exports = RecordTape