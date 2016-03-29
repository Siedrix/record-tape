# Record-tape

*Still in weekend project mode*

The idea of this project is to record operations on a model and then be able to replay them to check if changes have broke something.

### First generate a operation log
```
var TestModel = Backbone.Model.extend(TestModelConf)
var test = new TestModel()
var recordTape = new RecordTape(TestModel, 'fetch')

recordTape.track()
test.fetch()			
test.fetch()

var operationDump = recordTape.getLog()
// Save operations log somewhere
```

### Then replay the operations log
```
// Load operation log from somewhere
var TestModel = Backbone.Model.extend(TestModelConf)
var recordTape = new RecordTape(TestModel, 'fetch')

recordTape.loadLog(operationLog)
recordTape.run()
```