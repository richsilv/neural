<a name="module_neural"></a>
## neural
A neural network toolkit for Node.js and the browser.


* [neural](#module_neural)
    * [~Neuron](#module_neural..Neuron)
        * [new Neuron(params)](#new_module_neural..Neuron_new)
        * [.setInputs(newInputs)](#module_neural..Neuron+setInputs)
        * [.getInputs()](#module_neural..Neuron+getInputs) ⇒ <code>Array</code>
        * [.getInputCount()](#module_neural..Neuron+getInputCount) ⇒ <code>number</code>
        * [.setWeights(newWeights)](#module_neural..Neuron+setWeights)
        * [.getWeights()](#module_neural..Neuron+getWeights) ⇒ <code>Array</code>
        * [.getId()](#module_neural..Neuron+getId) ⇒ <code>number</code>
        * [.getTransfer()](#module_neural..Neuron+getTransfer) ⇒ <code>fn</code>
        * [.setTransfer(The)](#module_neural..Neuron+setTransfer)
        * [.getActivation()](#module_neural..Neuron+getActivation) ⇒ <code>number</code>
        * [.getInputSum()](#module_neural..Neuron+getInputSum) ⇒ <code>number</code>
        * [.getDelta()](#module_neural..Neuron+getDelta) ⇒ <code>number</code>
        * [.isOutput()](#module_neural..Neuron+isOutput) ⇒ <code>boolean</code>
        * [.setExpected(Expected)](#module_neural..Neuron+setExpected)
        * [.addInput(The)](#module_neural..Neuron+addInput)
        * [.calc()](#module_neural..Neuron+calc) ⇒ <code>number</code>
        * [.error()](#module_neural..Neuron+error) ⇒ <code>number</code>
        * [.invalidate()](#module_neural..Neuron+invalidate)
        * [.calcDelta()](#module_neural..Neuron+calcDelta) ⇒ <code>number</code>
        * [.getOutputWeightPartials()](#module_neural..Neuron+getOutputWeightPartials) ⇒ <code>Array</code>
        * [.getInputWeightPartials()](#module_neural..Neuron+getInputWeightPartials) ⇒ <code>Array</code>
        * [.randomizeWeights([max], [min])](#module_neural..Neuron+randomizeWeights)
    * [~Layer](#module_neural..Layer)
        * [new Layer(params)](#new_module_neural..Layer_new)
        * [.isOutput()](#module_neural..Layer+isOutput) ⇒ <code>boolean</code>
        * [.setStatus(statuses)](#module_neural..Layer+setStatus)
        * [.plug(outputLayer)](#module_neural..Layer+plug) ⇒ <code>Layer</code>
        * [.getNeurons()](#module_neural..Layer+getNeurons) ⇒ <code>Array</code>
        * [.setInputs(inputs, isInputLayer)](#module_neural..Layer+setInputs)
        * [.setExpected(An)](#module_neural..Layer+setExpected)
        * [.setTransfer(fn)](#module_neural..Layer+setTransfer)
        * [.calc()](#module_neural..Layer+calc) ⇒ <code>Array</code>
        * [.invalidate()](#module_neural..Layer+invalidate)
        * [.calcDeltas()](#module_neural..Layer+calcDeltas) ⇒ <code>Array</code>
        * [.getWeights()](#module_neural..Layer+getWeights) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.setWeights(weights)](#module_neural..Layer+setWeights)
        * [.getActivations()](#module_neural..Layer+getActivations) ⇒ <code>Array</code>
        * [.getInputSums()](#module_neural..Layer+getInputSums) ⇒ <code>Array</code>
        * [.getIds()](#module_neural..Layer+getIds) ⇒ <code>Array</code>
        * [.getOutputWeightPartials()](#module_neural..Layer+getOutputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.getInputWeightPartials()](#module_neural..Layer+getInputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.randomizeWeights(e)](#module_neural..Layer+randomizeWeights)
    * [~Network](#module_neural..Network)
        * [new Network(params)](#new_module_neural..Network_new)
        * [.layerCount()](#module_neural..Network+layerCount) ⇒ <code>number</code>
        * [.getLayers()](#module_neural..Network+getLayers) ⇒ <code>Array</code>
        * [.inputLayer()](#module_neural..Network+inputLayer) ⇒ <code>Layer</code>
        * [.outputLayer()](#module_neural..Network+outputLayer) ⇒ <code>Layer</code>
        * [.setInputs(inputs)](#module_neural..Network+setInputs)
        * [.setExpected(outputs)](#module_neural..Network+setExpected)
        * [.calc()](#module_neural..Network+calc) ⇒ <code>Array</code>
        * [.getActivations()](#module_neural..Network+getActivations) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.getInputSums()](#module_neural..Network+getInputSums) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.invalidate()](#module_neural..Network+invalidate)
        * [.randomizeWeights(e)](#module_neural..Network+randomizeWeights)
        * [.forwardPropagate(trial)](#module_neural..Network+forwardPropagate) ⇒ <code>Array.&lt;number&gt;</code>
        * [.sumSqError()](#module_neural..Network+sumSqError) ⇒ <code>number</code>
        * [.backPropagate()](#module_neural..Network+backPropagate) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.getIds()](#module_neural..Network+getIds) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
        * [.getOutputWeightPartials()](#module_neural..Network+getOutputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
        * [.getInputWeightPartials()](#module_neural..Network+getInputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
        * [.getWeights()](#module_neural..Network+getWeights) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
        * [.setWeights(The)](#module_neural..Network+setWeights)
    * [~TrainingData](#module_neural..TrainingData)
        * [new TrainingData(data)](#new_module_neural..TrainingData_new)
        * [.dataGenerator()](#module_neural..TrainingData+dataGenerator) ⇒ <code>generator</code>
        * [.dataLength()](#module_neural..TrainingData+dataLength) ⇒ <code>number</code>
    * [~transferFunctions](#module_neural..transferFunctions) : <code>object</code>
    * [~addTransferFunction(key, fn, deriv)](#module_neural..addTransferFunction)
    * [~one-to-one](#module_neural..one-to-one) ⇒ <code>number</code>

<a name="module_neural..Neuron"></a>
### neural~Neuron
**Kind**: inner class of <code>[neural](#module_neural)</code>  

* [~Neuron](#module_neural..Neuron)
    * [new Neuron(params)](#new_module_neural..Neuron_new)
    * [.setInputs(newInputs)](#module_neural..Neuron+setInputs)
    * [.getInputs()](#module_neural..Neuron+getInputs) ⇒ <code>Array</code>
    * [.getInputCount()](#module_neural..Neuron+getInputCount) ⇒ <code>number</code>
    * [.setWeights(newWeights)](#module_neural..Neuron+setWeights)
    * [.getWeights()](#module_neural..Neuron+getWeights) ⇒ <code>Array</code>
    * [.getId()](#module_neural..Neuron+getId) ⇒ <code>number</code>
    * [.getTransfer()](#module_neural..Neuron+getTransfer) ⇒ <code>fn</code>
    * [.setTransfer(The)](#module_neural..Neuron+setTransfer)
    * [.getActivation()](#module_neural..Neuron+getActivation) ⇒ <code>number</code>
    * [.getInputSum()](#module_neural..Neuron+getInputSum) ⇒ <code>number</code>
    * [.getDelta()](#module_neural..Neuron+getDelta) ⇒ <code>number</code>
    * [.isOutput()](#module_neural..Neuron+isOutput) ⇒ <code>boolean</code>
    * [.setExpected(Expected)](#module_neural..Neuron+setExpected)
    * [.addInput(The)](#module_neural..Neuron+addInput)
    * [.calc()](#module_neural..Neuron+calc) ⇒ <code>number</code>
    * [.error()](#module_neural..Neuron+error) ⇒ <code>number</code>
    * [.invalidate()](#module_neural..Neuron+invalidate)
    * [.calcDelta()](#module_neural..Neuron+calcDelta) ⇒ <code>number</code>
    * [.getOutputWeightPartials()](#module_neural..Neuron+getOutputWeightPartials) ⇒ <code>Array</code>
    * [.getInputWeightPartials()](#module_neural..Neuron+getInputWeightPartials) ⇒ <code>Array</code>
    * [.randomizeWeights([max], [min])](#module_neural..Neuron+randomizeWeights)

<a name="new_module_neural..Neuron_new"></a>
#### new Neuron(params)
Creates a new Neuron


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  |  |
| [params.transfer] | <code>function</code> | <code>&#x27;logSigmoid&#x27;</code> | The neuron's transfer function. |
| [params.inputs] | <code>Array.&lt;number&gt;</code> |  | An array of inputs to the neuron, which can be numbers, functions returning a number or Neurons |
| [params.weights] | <code>Array.&lt;number&gt;</code> |  | The input weights with which to initialise the Neuron.  Defaults to zeros. |

<a name="module_neural..Neuron+setInputs"></a>
#### neuron.setInputs(newInputs)
Resets the inputs to a neuron.  Any existing inputs are removed.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newInputs | <code>Array.&lt;(number\|function()\|Neuron)&gt;</code> | Array of inputs to the Neuron, which can be numbers, functions returning a number or Neurons. |

<a name="module_neural..Neuron+getInputs"></a>
#### neuron.getInputs() ⇒ <code>Array</code>
Returns the Neurons inputs.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>Array</code> - The Neurons inputs, which could be numbers, functions returning a number or Neurons.  
<a name="module_neural..Neuron+getInputCount"></a>
#### neuron.getInputCount() ⇒ <code>number</code>
Returns the number of inputs feeding this neuron.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - count of inputs, which could be numbers, functions returning a number of Neurons.  
<a name="module_neural..Neuron+setWeights"></a>
#### neuron.setWeights(newWeights)
Updates the Neuron's weights.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newWeights | <code>Array.&lt;number&gt;</code> | An array of numbers, which must be of the same length as the Neuron's array of inputs. |

<a name="module_neural..Neuron+getWeights"></a>
#### neuron.getWeights() ⇒ <code>Array</code>
Returns the Neuron's weights.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>Array</code> - The neuron's weights (numbers).  
<a name="module_neural..Neuron+getId"></a>
#### neuron.getId() ⇒ <code>number</code>
Returns the Neuron's id.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - The Neuron's id, which is unique at the module level.  
<a name="module_neural..Neuron+getTransfer"></a>
#### neuron.getTransfer() ⇒ <code>fn</code>
Get the Neuron's transfer function

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>fn</code> - The transfer function  
<a name="module_neural..Neuron+setTransfer"></a>
#### neuron.setTransfer(The)
Sets the Neuron's transfer function

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>function</code> | replacement transfer function (see section on transfer functions for details of acceptable formats). |

<a name="module_neural..Neuron+getActivation"></a>
#### neuron.getActivation() ⇒ <code>number</code>
Gets the Neuron's current activation value.  Note that this does NOT recalculate the value if input values or weights have changed.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - The most recently-calculated activation value.  
<a name="module_neural..Neuron+getInputSum"></a>
#### neuron.getInputSum() ⇒ <code>number</code>
Gets the Neuron's current input sum.  This is the weighted sum of inputs, prior to having been passed through the transfer function. Note that this does NOT recalculate the value if input values or weights have changed.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - The most recently-calculated input sum.  
<a name="module_neural..Neuron+getDelta"></a>
#### neuron.getDelta() ⇒ <code>number</code>
Gets the Neuron's current delta.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - The Neuron's delta.  
<a name="module_neural..Neuron+isOutput"></a>
#### neuron.isOutput() ⇒ <code>boolean</code>
Indicates whether the Neuron is in the output layer of a Network

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
<a name="module_neural..Neuron+setExpected"></a>
#### neuron.setExpected(Expected)
Sets the expected activation value (from training data) of the Neuron

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Expected | <code>number</code> | output value |

<a name="module_neural..Neuron+addInput"></a>
#### neuron.addInput(The)
Plugs in a new input to the Neuron, which is initialised with a respective weight of 0.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>number</code> &#124; <code>function</code> &#124; <code>Neuron</code> | new input. |

<a name="module_neural..Neuron+calc"></a>
#### neuron.calc() ⇒ <code>number</code>
Recalculates the activation value, recalculating all the input nodes in turn as required.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - The recalculated activation value.  
<a name="module_neural..Neuron+error"></a>
#### neuron.error() ⇒ <code>number</code>
The difference between the most recently calculated activation value and the last expected value to be supplied.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - Difference between activation and expected values.  
<a name="module_neural..Neuron+invalidate"></a>
#### neuron.invalidate()
Marks the Neuron as in need of recalculation by clearing the activation value cache.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
<a name="module_neural..Neuron+calcDelta"></a>
#### neuron.calcDelta() ⇒ <code>number</code>
Recalculates the Neuron's delta.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>number</code> - The new delta.  
<a name="module_neural..Neuron+getOutputWeightPartials"></a>
#### neuron.getOutputWeightPartials() ⇒ <code>Array</code>
Returns the partial derivative of the Neuron's error with respect to its output weights.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>Array</code> - The output weight partials.  
<a name="module_neural..Neuron+getInputWeightPartials"></a>
#### neuron.getInputWeightPartials() ⇒ <code>Array</code>
Returns the partial derivatives of the input Neurons errors with respect to this Neuron's input weights.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  
**Returns**: <code>Array</code> - The input weight partials.  
<a name="module_neural..Neuron+randomizeWeights"></a>
#### neuron.randomizeWeights([max], [min])
Randomizes the Neuron's input weights.

**Kind**: instance method of <code>[Neuron](#module_neural..Neuron)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [max] | <code>number</code> | <code>0.000001</code> | Maximum possible weight. |
| [min] | <code>number</code> | <code>0</code> | Minimum possible weights. |

<a name="module_neural..Layer"></a>
### neural~Layer
**Kind**: inner class of <code>[neural](#module_neural)</code>  

* [~Layer](#module_neural..Layer)
    * [new Layer(params)](#new_module_neural..Layer_new)
    * [.isOutput()](#module_neural..Layer+isOutput) ⇒ <code>boolean</code>
    * [.setStatus(statuses)](#module_neural..Layer+setStatus)
    * [.plug(outputLayer)](#module_neural..Layer+plug) ⇒ <code>Layer</code>
    * [.getNeurons()](#module_neural..Layer+getNeurons) ⇒ <code>Array</code>
    * [.setInputs(inputs, isInputLayer)](#module_neural..Layer+setInputs)
    * [.setExpected(An)](#module_neural..Layer+setExpected)
    * [.setTransfer(fn)](#module_neural..Layer+setTransfer)
    * [.calc()](#module_neural..Layer+calc) ⇒ <code>Array</code>
    * [.invalidate()](#module_neural..Layer+invalidate)
    * [.calcDeltas()](#module_neural..Layer+calcDeltas) ⇒ <code>Array</code>
    * [.getWeights()](#module_neural..Layer+getWeights) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.setWeights(weights)](#module_neural..Layer+setWeights)
    * [.getActivations()](#module_neural..Layer+getActivations) ⇒ <code>Array</code>
    * [.getInputSums()](#module_neural..Layer+getInputSums) ⇒ <code>Array</code>
    * [.getIds()](#module_neural..Layer+getIds) ⇒ <code>Array</code>
    * [.getOutputWeightPartials()](#module_neural..Layer+getOutputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.getInputWeightPartials()](#module_neural..Layer+getInputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.randomizeWeights(e)](#module_neural..Layer+randomizeWeights)

<a name="new_module_neural..Layer_new"></a>
#### new Layer(params)
Creates a new Network Layer


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| [params.neurons] | <code>number</code> &#124; <code>Array.&lt;Neuron&gt;</code> | The Neurons in the layer. If an integer is passed, that number of Neurons will be constructed for this Layer. |

<a name="module_neural..Layer+isOutput"></a>
#### layer.isOutput() ⇒ <code>boolean</code>
Returns whether this an output layer.  Note that all layers are output layers by default, until they have their neurons plugged into another layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
<a name="module_neural..Layer+setStatus"></a>
#### layer.setStatus(statuses)
Overrides the layer's status.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| statuses | <code>Object</code> |  |
| statuses.input | <code>boolean</code> | Whether the layer should be marked as an input layer. |
| statuses.output | <code>boolean</code> | Whether the layer should be marked as an output layer. |

<a name="module_neural..Layer+plug"></a>
#### layer.plug(outputLayer) ⇒ <code>Layer</code>
Plugs this Layer into another Layer such that the Neurons in this Layer become input Neurons for the supplied Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Layer</code> - The supplied output Layer for chaining purposes.  

| Param | Type | Description |
| --- | --- | --- |
| outputLayer | <code>Layer</code> | The Layer which will have its Neurons take the Neurons in this Layer as inputs. |

<a name="module_neural..Layer+getNeurons"></a>
#### layer.getNeurons() ⇒ <code>Array</code>
Returns the Neurons which make up this layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
<a name="module_neural..Layer+setInputs"></a>
#### layer.setInputs(inputs, isInputLayer)
Sets the inputs for all the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| inputs | <code>Array.&lt;(number\|function()\|Neuron)&gt;</code> | An array of inputs, which could be numbers, functions returning a number or Neurons. |
| isInputLayer | <code>boolean</code> | Indicates whether this is intended to be the input layer in a Network.  If set to true, rather than each of the supplied inputs being wired into each of the Neurons in this Layer, they will be mapped one-to-one, with no bias (i.e. passed straight through to the next layer). |

<a name="module_neural..Layer+setExpected"></a>
#### layer.setExpected(An)
Sets the expected values for the activation values of the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| An | <code>Array.&lt;number&gt;</code> | array of output values (numbers), equal in length to the number of Neurons in this Layer. |

<a name="module_neural..Layer+setTransfer"></a>
#### layer.setTransfer(fn)
Sets the transfer function for every Neuron in this Layer

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The replacement transfer function (see section on transfer functions for details of acceptable formats). |

<a name="module_neural..Layer+calc"></a>
#### layer.calc() ⇒ <code>Array</code>
Recalculates the activation values for all of the Neurons in this Layer, recalculating their input Neuron values in sequence as required.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array</code> - The recalculated activation values.  
<a name="module_neural..Layer+invalidate"></a>
#### layer.invalidate()
Invalidates the activation cache for all the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
<a name="module_neural..Layer+calcDeltas"></a>
#### layer.calcDeltas() ⇒ <code>Array</code>
Recalculates the deltas for all Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array</code> - The deltas for the Neurons in this Layer.  
<a name="module_neural..Layer+getWeights"></a>
#### layer.getWeights() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Gets the weights for each Neuron in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - The weights for each Neuron in this Layer.  
<a name="module_neural..Layer+setWeights"></a>
#### layer.setWeights(weights)
Update the input weights for the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| weights | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | The new weights for each Neuron in this Layer. |

<a name="module_neural..Layer+getActivations"></a>
#### layer.getActivations() ⇒ <code>Array</code>
Returns the activation values for the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array</code> - The activation values.  
<a name="module_neural..Layer+getInputSums"></a>
#### layer.getInputSums() ⇒ <code>Array</code>
Returns the input sums for the Neurons in this Layer (the weighted sums of inputs for each Neuron before they've been passed through the transfer function).

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array</code> - The input sums.  
<a name="module_neural..Layer+getIds"></a>
#### layer.getIds() ⇒ <code>Array</code>
Returns the ids for the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array</code> - An array of ids.  
<a name="module_neural..Layer+getOutputWeightPartials"></a>
#### layer.getOutputWeightPartials() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Returns the output weight partials for the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - Array of output weight partials for each Neuron.  
**See**: [Neuron#getOutputWeightPartials](Neuron#getOutputWeightPartials)  
<a name="module_neural..Layer+getInputWeightPartials"></a>
#### layer.getInputWeightPartials() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Returns the input weight partials for the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - Array of input weight partials for each Neuron.  
**See**: [Neuron#getInputWeightPartials](Neuron#getInputWeightPartials)  
<a name="module_neural..Layer+randomizeWeights"></a>
#### layer.randomizeWeights(e)
Randomizes the weights for all of the Neurons in this Layer.

**Kind**: instance method of <code>[Layer](#module_neural..Layer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>number</code> | The randomized weights will be in the range [-e, e]. |

<a name="module_neural..Network"></a>
### neural~Network
**Kind**: inner class of <code>[neural](#module_neural)</code>  

* [~Network](#module_neural..Network)
    * [new Network(params)](#new_module_neural..Network_new)
    * [.layerCount()](#module_neural..Network+layerCount) ⇒ <code>number</code>
    * [.getLayers()](#module_neural..Network+getLayers) ⇒ <code>Array</code>
    * [.inputLayer()](#module_neural..Network+inputLayer) ⇒ <code>Layer</code>
    * [.outputLayer()](#module_neural..Network+outputLayer) ⇒ <code>Layer</code>
    * [.setInputs(inputs)](#module_neural..Network+setInputs)
    * [.setExpected(outputs)](#module_neural..Network+setExpected)
    * [.calc()](#module_neural..Network+calc) ⇒ <code>Array</code>
    * [.getActivations()](#module_neural..Network+getActivations) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.getInputSums()](#module_neural..Network+getInputSums) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.invalidate()](#module_neural..Network+invalidate)
    * [.randomizeWeights(e)](#module_neural..Network+randomizeWeights)
    * [.forwardPropagate(trial)](#module_neural..Network+forwardPropagate) ⇒ <code>Array.&lt;number&gt;</code>
    * [.sumSqError()](#module_neural..Network+sumSqError) ⇒ <code>number</code>
    * [.backPropagate()](#module_neural..Network+backPropagate) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.getIds()](#module_neural..Network+getIds) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
    * [.getOutputWeightPartials()](#module_neural..Network+getOutputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
    * [.getInputWeightPartials()](#module_neural..Network+getInputWeightPartials) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
    * [.getWeights()](#module_neural..Network+getWeights) ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
    * [.setWeights(The)](#module_neural..Network+setWeights)

<a name="new_module_neural..Network_new"></a>
#### new Network(params)
Creates a new Network


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| [params.layers] | <code>Array.&lt;number&gt;</code> | An array of layer sizes, indicating the number of Neurons in each Layer (and implicitly, the number of Layers). |

<a name="module_neural..Network+layerCount"></a>
#### network.layerCount() ⇒ <code>number</code>
Returns the number of layers in the network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
<a name="module_neural..Network+getLayers"></a>
#### network.getLayers() ⇒ <code>Array</code>
Returns the Layer instances which make up the network (from input to output).

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array</code> - Array of Layers.  
<a name="module_neural..Network+inputLayer"></a>
#### network.inputLayer() ⇒ <code>Layer</code>
Returns the Network's input Layer.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
<a name="module_neural..Network+outputLayer"></a>
#### network.outputLayer() ⇒ <code>Layer</code>
Returns the Network's output Layer.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
<a name="module_neural..Network+setInputs"></a>
#### network.setInputs(inputs)
Sets the inputs for the Network's input Layer.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**See**: [Layer#setInputs](Layer#setInputs) for more details.  

| Param | Type | Description |
| --- | --- | --- |
| inputs | <code>Array.&lt;(number\|function()\|Neuron)&gt;</code> | An array of inputs, which must be of the same length as the number of Neurons in the input Layer.  Note that whilst these could be Neurons, in an input Layer they would more normally be numbers or functions. |

<a name="module_neural..Network+setExpected"></a>
#### network.setExpected(outputs)
Sets the expected outputs for the Network's output Layer.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**See**: [Layer#setOutputs](Layer#setOutputs) for more details.  

| Param | Type | Description |
| --- | --- | --- |
| outputs | <code>Array.&lt;number&gt;</code> | An array of expected values for the output Layer.  This must be the same length as the number of Neurons in the output Layer. |

<a name="module_neural..Network+calc"></a>
#### network.calc() ⇒ <code>Array</code>
Calculates the output values for the Network based on the current inputs using forward propagation. Note that if Neuron activation values have been calculated since the previous invalidation, these will be used rather than recalculation occurring.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array</code> - The output layer activation values resulting from the current network inputs.  
<a name="module_neural..Network+getActivations"></a>
#### network.getActivations() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Gets all activation values for all Neurons in all Layers in the Network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - Activation values.  
<a name="module_neural..Network+getInputSums"></a>
#### network.getInputSums() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Gets all input sums for all Neurons in all Layers in the Network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - Input sums.  
**See**: [Neuron#getInputSum](Neuron#getInputSum) for more details.  
<a name="module_neural..Network+invalidate"></a>
#### network.invalidate()
Marks the activation cache for every Neuron in the Network as invalid.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
<a name="module_neural..Network+randomizeWeights"></a>
#### network.randomizeWeights(e)
Randomizes the input weights for all the Neurons in the Network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**See**: [Layer#randomizeWeights](Layer#randomizeWeights) for more details.  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>number</code> | Resulting weights will be in the interval [-e, e]. |

<a name="module_neural..Network+forwardPropagate"></a>
#### network.forwardPropagate(trial) ⇒ <code>Array.&lt;number&gt;</code>
Peforms a full forward propagation of the Network using the supplied input values.  Also optionally sets the expected output values for error calculation and training.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;number&gt;</code> - The actual output values resulting from the supplied inputs with the current network weights.  

| Param | Type | Description |
| --- | --- | --- |
| trial | <code>Object</code> |  |
| [trial.inputs] | <code>Array.&lt;number&gt;</code> | An array of input values to feed into the Network's input Layer.  This must be the same length as the number of Neurons in the input Layer. |
| [trial.outputs=] | <code>Array.&lt;number&gt;</code> | An array of output values to mark as the output Layer's expected activation values.  This must be the same length as the number of Neurons in the output Layer. |

<a name="module_neural..Network+sumSqError"></a>
#### network.sumSqError() ⇒ <code>number</code>
Returns the sum-squared error resulting from comparing the calculated Network outputs with the expected outputs, using the current inputs and weights.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
<a name="module_neural..Network+backPropagate"></a>
#### network.backPropagate() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Applies the back-propagation algorithm to recalculate the deltas for each Neuron in the Network, working from the output Layer to the input Layer.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - The deltas for the Neurons in each of the output Layers.  
<a name="module_neural..Network+getIds"></a>
#### network.getIds() ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
Returns the ids for all the Neurons in the Network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
<a name="module_neural..Network+getOutputWeightPartials"></a>
#### network.getOutputWeightPartials() ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
Gets the output weight partials for each Neuron in the Network

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code> - Input weight partials for each Neuron.  
**See**: [Neuron#getInputWeightPartials](Neuron#getInputWeightPartials)  
<a name="module_neural..Network+getInputWeightPartials"></a>
#### network.getInputWeightPartials() ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
Gets the output weight partials for each Neuron in the Network

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code> - Output weight partials for each Neuron.  
**See**: [Neuron#getOutputWeightPartials](Neuron#getOutputWeightPartials)  
<a name="module_neural..Network+getWeights"></a>
#### network.getWeights() ⇒ <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code>
Gets the input weights for each Neuron in the network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  
**Returns**: <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code> - Input weights by input, Neuron and Layer.  
<a name="module_neural..Network+setWeights"></a>
#### network.setWeights(The)
Sets the weights for the entire network in one go.  Useful for rebuilding a trained network.

**Kind**: instance method of <code>[Network](#module_neural..Network)</code>  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Array.&lt;Array.&lt;Array.&lt;number&gt;&gt;&gt;</code> | inner-most Arrays refer to the input weights for each Neuron.  These should be arranged in Arrays corresponding to each Neuron in a Layer.  Finally, the weights for each Layer should make up the outer-most Array. |

<a name="module_neural..TrainingData"></a>
### neural~TrainingData
**Kind**: inner class of <code>[neural](#module_neural)</code>  

* [~TrainingData](#module_neural..TrainingData)
    * [new TrainingData(data)](#new_module_neural..TrainingData_new)
    * [.dataGenerator()](#module_neural..TrainingData+dataGenerator) ⇒ <code>generator</code>
    * [.dataLength()](#module_neural..TrainingData+dataLength) ⇒ <code>number</code>

<a name="new_module_neural..TrainingData_new"></a>
#### new TrainingData(data)
Creates a new TrainingData object, which can be used to make generators which iterate over the supplied set of examples.  This is very useful for repeated training on a single set of data.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;object&gt;</code> | An array of trial objects pertaining to individual training examples. |
| [trial.inputs] | <code>Array.&lt;number&gt;</code> | An array of inputs for this trial.  This must be the same length as the number of Neurons in the input layer of the Network that it will be used to train. |
| [trial.outputs] | <code>Array.&lt;number&gt;</code> | An array of expected outputs for this trial.  This must be the same length as the number of Neurons in the output layer of the Network that it will be used to train. |

<a name="module_neural..TrainingData+dataGenerator"></a>
#### trainingData.dataGenerator() ⇒ <code>generator</code>
Returns a generator which iterators over the dataset which was used to construct the TrainingData object.

**Kind**: instance method of <code>[TrainingData](#module_neural..TrainingData)</code>  
<a name="module_neural..TrainingData+dataLength"></a>
#### trainingData.dataLength() ⇒ <code>number</code>
Gives the number of individual trials in the associated data set.

**Kind**: instance method of <code>[TrainingData](#module_neural..TrainingData)</code>  
<a name="module_neural..transferFunctions"></a>
### neural~transferFunctions : <code>object</code>
The store of transfer functions which can be used in Neurons to convert input sums to activation values.  By default, the following are available:

**Kind**: inner namespace of <code>[neural](#module_neural)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| logSigmoid | <code>function</code> | see [https://en.wikipedia.org/wiki/Logistic_function](https://en.wikipedia.org/wiki/Logistic_function) |
| rectifier | <code>function</code> | see [https://en.wikipedia.org/wiki/Rectifier_(neural_networks)](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) |
| linear | <code>function</code> | useful for output layers for training data which could take any value.  Note that neural networks cannot rely solely on linear transfer functions otherwise hidden layers will be effectively redundant. |

<a name="module_neural..addTransferFunction"></a>
### neural~addTransferFunction(key, fn, deriv)
Adds a function to the store of [transferFunctions](transferFunctions) which can be applied to Neurons to convert the input sum into an activation value.

**Kind**: inner method of <code>[neural](#module_neural)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | transfer Function name |
| fn | <code>one-to-one</code> | The transfer function itself, which should take a number and output a number.  It should be differentiable if it's to be used in network training. |
| deriv | <code>one-to-one</code> | The derivative of the transfer function, which is required for back-propagation.  It should take a number and output a number. |

<a name="module_neural..one-to-one"></a>
### neural~one-to-one ⇒ <code>number</code>
**Kind**: inner typedef of <code>[neural](#module_neural)</code>  
**Returns**: <code>number</code> - output Output value.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>number</code> | Input value. |

