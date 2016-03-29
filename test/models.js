var assert = require('assert')
var Backbone = require('Backbone')
var RecordTape = require('../lib/record-tape')
var _ = require('underscore')

var TestModelConf = {
	initialize: function(){},
	fetch: function(){
		this.set('foo', true)
		return {success:true}
	}
}

var operationLog = [ 
	{ before: {},            after: { foo: true }, result: { success: true } },
	{ before: { foo: true }, after: { foo: true }, result: { success: true } }
]

var invalidOperationLog = [ 
	{ before: {},            after: { foo: false }, result: { success: false } },
	{ before: { foo: true }, after: { foo: true }, result: { success: true } }
]

describe('Model test', function(){
	describe('*Initialize', function(){
		it('Should wrap a function', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			assert.equal(TestModel.prototype.fetch, TestModelConf.fetch)

			var recordTape = new RecordTape(TestModel, 'fetch')

			assert.equal(recordTape.Model, TestModel)
			assert.equal(recordTape.functionName, 'fetch')
			assert.notEqual(TestModel.prototype.fetch, TestModelConf.fetch)
		})
	})

	describe('*Sync operations', function(){
		it('Should track results', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			var test = new TestModel()
			var recordTape = new RecordTape(TestModel, 'fetch')

			recordTape.track()
			test.fetch()
			
			assert.equal(recordTape._tracking, true)
			assert.equal(recordTape._operations.length, 1)
		})

		it('Should untrack results', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			var test = new TestModel()
			var recordTape = new RecordTape(TestModel, 'fetch')
			
			recordTape.track()
			recordTape.stopTracking()
			test.fetch()

			assert.equal(recordTape._tracking, false)
			assert.equal(recordTape._operations.length, 0)
		})

		it('Should get operations dump', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			var test = new TestModel()
			var recordTape = new RecordTape(TestModel, 'fetch')
			
			recordTape.track()
			test.fetch()			
			test.fetch()

			var operationDump = recordTape.getLog()
			assert.equal(operationDump.length, 2)

			var operation1 = operationDump[0]
			var operation2 = operationDump[1]

			assert.deepEqual(operation1.before, {})
			assert.deepEqual(operation1.after, {foo:true})
			assert.deepEqual(operation1.result, {success:true})

			assert.deepEqual(operation2.before, {foo: true})
			assert.deepEqual(operation2.after, {foo:true})
			assert.deepEqual(operation2.result, {success:true})
		})

		it('Should load a operations log', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			var recordTape = new RecordTape(TestModel, 'fetch')

			recordTape.loadLog(operationLog)
			var operationDump = recordTape.getLog()
			assert.equal(operationDump.length, 2)

			var operation1 = operationDump[0]
			var operation2 = operationDump[1]

			assert.deepEqual(operation1.before, {})
			assert.deepEqual(operation1.after, {foo:true})
			assert.deepEqual(operation1.result, {success:true})

			assert.deepEqual(operation2.before, {foo: true})
			assert.deepEqual(operation2.after, {foo:true})
			assert.deepEqual(operation2.result, {success:true})			
		})

		it('Should rerun a operations log', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			var recordTape = new RecordTape(TestModel, 'fetch')

			recordTape.loadLog(operationLog)			
			recordTape.run()

			var operationDump = recordTape.getLog()

			assert.equal(operationDump.length, operationLog.length)
			assert.deepEqual(operationDump[0], operationLog[0])
			assert.deepEqual(operationDump[1], operationLog[1])
		})

		it('Should rerun a operations with invalid log', function(){
			var TestModel = Backbone.Model.extend(TestModelConf)
			var recordTape = new RecordTape(TestModel, 'fetch')

			recordTape.loadLog(invalidOperationLog)
			assert.throws(function(){
				recordTape.run()
			}, Error)

		})		
	})

	describe('Async operations', function(){})
})