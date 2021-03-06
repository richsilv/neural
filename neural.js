var matrix = require('./matrix')
var neuronId = 0

/**
 * A neural network toolkit for Node.js and the browser.
 * @module neural
 */

/**
 * The store of transfer functions which can be used in Neurons to convert input sums to activation values.  By default, the following are available:
 * @namespace
 * @prop {function} logSigmoid see {@link https://en.wikipedia.org/wiki/Logistic_function}
 * @prop {function} rectifier see {@link https://en.wikipedia.org/wiki/Rectifier_(neural_networks)}
 * @prop {function} linear useful for output layers for training data which could take any value.  Note that neural networks cannot rely solely on linear transfer functions otherwise hidden layers will be effectively redundant.
 */
var transferFunctions = {}

/**
 * Creates a new Neuron
 * @constructor
 * @param {Object} params
 * @param {function} [params.transfer='logSigmoid'] The neuron's transfer function.
 * @param {Array<number>=} [params.inputs] An array of inputs to the neuron, which can be numbers, functions returning a number or Neurons
 * @param {Array<number>=} [params.weights] The input weights with which to initialise the Neuron.  Defaults to zeros.
 */
function Neuron (params) {
  if (!(this instanceof Neuron)) return new Neuron(params)
  var transfer = params.transfer || transferFunctions.logSigmoid
  var inputs = params.inputs || []
  var weights = params.weights || matrix.zeros(inputs.length)
  var outputNeurons = []
  var expectedOutputVal = 0
  var activationCache = null
  var inputSumCache = null
  var delta = 0
  var id = (neuronId += 1)

  /**
   * Resets the inputs to a neuron.  Any existing inputs are removed.
   * @param  {Array<number|function|Neuron>} newInputs Array of inputs to the Neuron, which can be numbers, functions returning a number or Neurons.
   */
  this.setInputs = function (newInputs) {
    if (newInputs.length !== inputs.length) weights = matrix.zeros(newInputs.length)
    this.invalidate()
    inputs = newInputs
  }

  /**
   * Returns the Neurons inputs.
   * @return {Array}  The Neurons inputs, which could be numbers, functions returning a number or Neurons.
   */
  this.getInputs = function () {
    return inputs
  }

  /**
   * Returns the number of inputs feeding this neuron.
   * @return {number}  count of inputs, which could be numbers, functions returning a number of Neurons.
   */
  this.getInputCount = function () {
    return inputs.length
  }

  /**
   * Updates the Neuron's weights.
   * @param  {number[]} newWeights An array of numbers, which must be of the same length as the Neuron's array of inputs.
   */
  this.setWeights = function (newWeights) {
    this.invalidate()
    weights = newWeights.slice(0)
  }

  /**
   * Returns the Neuron's weights.
   * @return {Array}  The neuron's weights (numbers).
   */
  this.getWeights = function () {
    return weights.slice(0)
  }

  /**
   * Returns the Neuron's id.
   * @return {number}  The Neuron's id, which is unique at the module level.
   */
  this.getId = function () {
    return id
  }

  /**
   * Get the Neuron's transfer function
   * @return {fn}  The transfer function
   */
  this.getTransfer = function () {
    return transfer
  }

  /**
   * Sets the Neuron's transfer function
   * @param  {function} The replacement transfer function (see section on transfer functions for details of acceptable formats).
   */
  this.setTransfer = function (fn) {
    transfer = fn
  }

  /**
   * Gets the Neuron's current activation value.  Note that this does NOT recalculate the value if input values or weights have changed.
   * @return {number}  The most recently-calculated activation value.
   */
  this.getActivation = function () {
    return activationCache
  }

  /**
   * Gets the Neuron's current input sum.  This is the weighted sum of inputs, prior to having been passed through the transfer function. Note that this does NOT recalculate the value if input values or weights have changed.
   * @return {number}  The most recently-calculated input sum.
   */
  this.getInputSum = function () {
    return inputSumCache
  }

  /**
   * Gets the Neuron's current delta.
   * @return {number}  The Neuron's delta.
   */
  this.getDelta = function () {
    return delta
  }

  /**
   * Indicates whether the Neuron is in the output layer of a Network
   * @return {boolean}
   */
  this.isOutput = function () {
    return expectedOutputVal !== null
  }

  /**
   * Sets the expected activation value (from training data) of the Neuron
   * @param  {number}  Expected output value
   */
  this.setExpected = function (val) {
    expectedOutputVal = val
  }

  this._updateOutputNeurons = function (neurons) {
    expectedOutputVal = null
    outputNeurons = neurons
  }

  /**
   * Plugs in a new input to the Neuron, which is initialised with a respective weight of 0.
   * @param  {(number|function|Neuron)} The new input.
   */
  this.addInput = function (input) {
    inputs.push(input)
    weights.push(0)
    this.invalidate()
  }

  /**
   * Recalculates the activation value, recalculating all the input nodes in turn as required.
   * @return {number}  The recalculated activation value.
   */
  this.calc = function () {
    if (activationCache !== null) return activationCache
    inputSumCache = matrix.mult(matrix.invoke(inputs), matrix.transpose(weights), true)
    activationCache = transfer(inputSumCache)

    return activationCache
  }

  /**
   * The difference between the most recently calculated activation value and the last expected value to be supplied.
   * @return {number}  Difference between activation and expected values.
   */
  this.error = function () {
    return activationCache - expectedOutputVal
  }

  /**
   * Marks the Neuron as in need of recalculation by clearing the activation value cache.
   */
  this.invalidate = function () {
    activationCache = null
  }

  /**
   * Recalculates the Neuron's delta.
   * @return {number}  The new delta.
   */
  this.calcDelta = function () {
    if (this.isOutput()) return this._calcDeltaOutputLayer()
    delta = outputNeurons.reduce((total, neuron) => {
      var index = neuron.getInputs().findIndex(input => input.getId && input.getId() === id)
      return total + (neuron.getDelta() * neuron.getWeights()[index])
    }, 0) * transfer.derivative(inputSumCache, activationCache)
    check(delta, 'Delta non-output layer')
    return delta
  }

  this._calcDeltaOutputLayer = function () {
    delta = -(expectedOutputVal - activationCache) * transfer.derivative(inputSumCache, activationCache)
    check.call(this, expectedOutputVal, 'expectedOutputVal')
    check.call(this, activationCache, 'activationCache')
    check.call(this, inputSumCache, 'inputSumCache')
    return delta
  }

  /**
   * Returns the partial derivative of the Neuron's error with respect to its output weights.
   * @return {Array}     The output weight partials.
   */
   this.getOutputWeightPartials = function () {
    return outputNeurons.map(neuron => activationCache * neuron.getDelta())
  }

  /**
   * Returns the partial derivatives of the input Neurons errors with respect to this Neuron's input weights.
   * @return {Array}  The input weight partials.
   */
  this.getInputWeightPartials = function () {
    return inputs.map(input => (input instanceof Neuron) ? input.getActivation() * delta : delta)
  }

  /**
   * Randomizes the Neuron's input weights.
   * @param  {number} [max=0.000001] Maximum possible weight.
   * @param  {number} [min=0] Minimum possible weights.
   */
  this.randomizeWeights = function (max, min) {
    return weights.map((weight, ind) => {
      var newWeight = randNum(max || 0.000001, min)
      weights[ind] = newWeight
    })
  }

  return this
}

/**
 * Creates a new Network Layer
 * @constructor
 * @param {Object} params
 * @param {(number|Neuron[])} [params.neurons]  The Neurons in the layer. If an integer is passed, that number of Neurons will be constructed for this Layer.
 */
function Layer (params) {
  var neurons = []
  var isOutput = true
  var isInput = true

  if (!(this instanceof Layer)) return new Layer(params)
  if (params.neurons instanceof Array) {
    neurons = params.neurons
  }
  if (typeof params.neurons === 'number') {
    neurons = Array(params.neurons).fill(0).map(() => {
      return new Neuron(params)
    })
  }

  /**
   * Returns whether this an output layer.  Note that all layers are output layers by default, until they have their neurons plugged into another layer.
   * @return {boolean}
   */
  this.isOutput = function () {
    return isOutput
  }

  /**
   * Overrides the layer's status.
   * @param  {Object} statuses
   * @param  {boolean} statuses.input Whether the layer should be marked as an input layer.
   * @param  {boolean} statuses.output Whether the layer should be marked as an output layer.
   */
  this.setStatus = function (statuses) {
    if (typeof statuses.input === 'boolean') isInput = statuses.isInput
    if (typeof statuses.output === 'boolean') isOutput = statuses.isOutput
  }

  /**
   * Plugs this Layer into another Layer such that the Neurons in this Layer become input Neurons for the supplied Layer.
   * @param  {Layer} outputLayer The Layer which will have its Neurons take the Neurons in this Layer as inputs.
   * @return {Layer}             The supplied output Layer for chaining purposes.
   */
  this.plug = function (outputLayer) {
    // Add an extra input for bias
    outputLayer.setStatus({ input: false })
    outputLayer.setInputs(neurons.concat(1))
    isOutput = false
    neurons.forEach(neuron => {
      neuron._updateOutputNeurons(outputLayer.getNeurons())
    })
    return outputLayer
  }

  /**
   * Returns the Neurons which make up this layer.
   * @return {Array}
   */
  this.getNeurons = function () {
    return neurons
  }

  /**
   * Sets the inputs for all the Neurons in this Layer.
   * @param  {Array<number|function|Neuron>} inputs       An array of inputs, which could be numbers, functions returning a number or Neurons.
   * @param  {boolean} isInputLayer Indicates whether this is intended to be the input layer in a Network.  If set to true, rather than each of the supplied inputs being wired into each of the Neurons in this Layer, they will be mapped one-to-one, with no bias (i.e. passed straight through to the next layer).
   */
  this.setInputs = function (inputs, isInputLayer) {
    if (!(inputs instanceof Array)) throw new Error('Inputs must be an array')
    if (isInputLayer) {
      if (inputs.length !== neurons.length) throw new Error(`Number of inputs (${inputs.length}) differs from number of neurons in input layer (${neurons.length})`)
      isInput = true
      neurons.forEach((neuron, ind) => {
        neuron.setInputs([inputs[ind]])
        neuron.setWeights([1])
      })
      this.getNeurons().forEach(neuron => neuron.setTransfer(transferFunctions.linear))
    } else {
      if (inputs.some(input => !(input instanceof Array))) {
        inputs = Array(neurons.length).fill(0).map(() => {
          return inputs.slice(0)
        })
      }
      inputs.forEach((inputArray, ind) => {
        neurons[ind].setInputs(inputArray)
      })
    }
  }

  /**
   * Sets the expected values for the activation values of the Neurons in this Layer.
   * @param  {number[]} An array of output values (numbers), equal in length to the number of Neurons in this Layer.
   */
  this.setExpected = function (outputs) {
    if (!(outputs instanceof Array)) throw new Error('Outputs must be an array')
    if (outputs.length !== neurons.length) throw new Error(`Number of outputs (${outputs.length}) differs from number of neurons in layer (${neurons.length})`)
    neurons.forEach((neuron, ind) => neuron.setExpected(outputs[ind]))
  }

  /**
   * Sets the transfer function for every Neuron in this Layer
   * @param  {function} fn The replacement transfer function (see section on transfer functions for details of acceptable formats).
   */
  this.setTransfer = function (fn) {
    return neurons.forEach(neuron => neuron.setTransfer(fn))
  }

  /**
   * Recalculates the activation values for all of the Neurons in this Layer, recalculating their input Neuron values in sequence as required.
   * @return {Array}  The recalculated activation values.
   */
  this.calc = function () {
    return neurons.map(neuron => neuron.calc())
  }

  /**
   * Invalidates the activation cache for all the Neurons in this Layer.
   */
  this.invalidate = function () {
    neurons.map(neuron => neuron.invalidate())
  }

  /**
   * Recalculates the deltas for all Neurons in this Layer.
   * @return {Array}  The deltas for the Neurons in this Layer.
   */
  this.calcDeltas = function () {
    return neurons.map(neuron => neuron.calcDelta())
  }

  /**
   * Gets the weights for each Neuron in this Layer.
   * @return {Array<Array<number>>}  The weights for each Neuron in this Layer.
   */
  this.getWeights = function () {
    return neurons.map(neuron => neuron.getWeights())
  }

  /**
   * Update the input weights for the Neurons in this Layer.
   * @param  {Array<Array<number>>} weights The new weights for each Neuron in this Layer.
   */
  this.setWeights = function (weights) {
    neurons.forEach((neuron, neuronInd) => neuron.setWeights(weights[neuronInd]))
  }

  /**
   * Returns the activation values for the Neurons in this Layer.
   * @return {Array} The activation values.
   */
  this.getActivations = function () {
    return neurons.map(neuron => neuron.getActivation())
  }

  /**
   * Returns the input sums for the Neurons in this Layer (the weighted sums of inputs for each Neuron before they've been passed through the transfer function).
   * @return {Array} The input sums.
   */
  this.getInputSums = function () {
    return neurons.map(neuron => neuron.getInputSum())
  }

  /**
   * Returns the ids for the Neurons in this Layer.
   * @return {Array}  An array of ids.
   */
  this.getIds = function () {
    return neurons.map(neuron => neuron.getId())
  }

  /**
   * Returns the output weight partials for the Neurons in this Layer.
   * @see {@link Neuron#getOutputWeightPartials}
   * @return {Array<Array<number>>}  Array of output weight partials for each Neuron.
   */
  this.getOutputWeightPartials = function () {
    return neurons.map(neuron => neuron.getOutputWeightPartials())
  }

  /**
   * Returns the input weight partials for the Neurons in this Layer.
   * @see {@link Neuron#getInputWeightPartials}
   * @return {Array<Array<number>>}  Array of input weight partials for each Neuron.
   */
  this.getInputWeightPartials = function () {
    return neurons.map(neuron => neuron.getInputWeightPartials())
  }

  /**
   * Randomizes the weights for all of the Neurons in this Layer.
   * @param  {number} e The randomized weights will be in the range [-e, e].
   */
  this.randomizeWeights = function (e) {
    if (isInput) return
    neurons.forEach(neuron => neuron.randomizeWeights(-e, e))
  }

  return this
}

/**
 * Creates a new Network
 * @constructor
 * @param {Object} params
 * @param {number[]} [params.layers] An array of layer sizes, indicating the number of Neurons in each Layer (and implicitly, the number of Layers).
 */
function Network (params) {
  if (!(this instanceof Network)) return new Network(params)
  var layers = []
  this.id = randomId()

  if (!(params.layers instanceof Array)) throw new Error('You must supply a "layers" parameter which is an array')
  params.layers.forEach(layer => {
    if (layer instanceof Layer) {
      layers.push(layer)
    } else if (typeof layer === 'number') {
      var layerParams = Object.assign({}, params, { neurons: layer })
      layers.push(new Layer(layerParams))
    } else {
      throw new Error('Unrecognised layer entry')
    }
  })

  layers.reduce((lastLayer, thisLayer) => {
    if (lastLayer) lastLayer.plug(thisLayer)
    return thisLayer
  }, null)

  /**
   * Returns the number of layers in the network.
   * @return {number}
   */
  this.layerCount = function () {
    return layers.length
  }

  /**
   * Returns the Layer instances which make up the network (from input to output).
   * @return {Array}  Array of Layers.
   */
  this.getLayers = function () {
    return layers
  }

  /**
   * Returns the Network's input Layer.
   * @return {Layer}
   */
  this.inputLayer = function () {
    return layers[0]
  }

  /**
   * Returns the Network's output Layer.
   * @return {Layer}
   */
  this.outputLayer = function () {
    return layers[layers.length - 1]
  }

  /**
   * Sets the inputs for the Network's input Layer.
   * @see {@link Layer#setInputs} for more details.
   * @param  {Array<number|function|Neuron>} inputs An array of inputs, which must be of the same length as the number of Neurons in the input Layer.  Note that whilst these could be Neurons, in an input Layer they would more normally be numbers or functions.
   */
  this.setInputs = function (inputs) {
    this.inputLayer().setInputs(inputs, true)
  }

  /**
   * Sets the expected outputs for the Network's output Layer.
   * @see {@link Layer#setOutputs} for more details.
   * @param  {number[]} outputs An array of expected values for the output Layer.  This must be the same length as the number of Neurons in the output Layer.
   */
  this.setExpected = function (outputs) {
    this.outputLayer().setExpected(outputs)
  }

  /**
   * Calculates the output values for the Network based on the current inputs using forward propagation. Note that if Neuron activation values have been calculated since the previous invalidation, these will be used rather than recalculation occurring.
   * @return {Array}             The output layer activation values resulting from the current network inputs.
   */
  this.calc = function () {
    return this.outputLayer().calc()
  }

  /**
   * Gets all activation values for all Neurons in all Layers in the Network.
   * @return {Array<Array<number>>} Activation values.
   */
  this.getActivations = function () {
    return layers.map(layer => layer.getActivations())
  }

  /**
   * Gets all input sums for all Neurons in all Layers in the Network.
   * @see {@link Neuron#getInputSum} for more details.
   * @return {Array<Array<number>>} Input sums.
   */
  this.getInputSums = function () {
    return layers.map(layer => layer.getInputSums())
  }

  /**
   * Marks the activation cache for every Neuron in the Network as invalid.
   */
  this.invalidate = function () {
    layers.forEach(layer => layer.invalidate())
  }

  /**
   * Randomizes the input weights for all the Neurons in the Network.
   * @see {@link Layer#randomizeWeights} for more details.
   * @param  {number} e Resulting weights will be in the interval [-e, e].
   */
  this.randomizeWeights = function (e) {
    layers.forEach(layer => layer.randomizeWeights(e))
  }

  /**
   * Peforms a full forward propagation of the Network using the supplied input values.  Also optionally sets the expected output values for error calculation and training.
   * @param  {Object} trial
   * @param  {number[]} [trial.inputs] An array of input values to feed into the Network's input Layer.  This must be the same length as the number of Neurons in the input Layer.
   * @param  {number[]} [trial.outputs=] An array of output values to mark as the output Layer's expected activation values.  This must be the same length as the number of Neurons in the output Layer.
   * @return {number[]}      The actual output values resulting from the supplied inputs with the current network weights.
   */
  this.forwardPropagate = function (trial) {
    this.invalidate()
    this.setInputs(trial.inputs)
    this.setExpected(trial.outputs)
    return this.calc()
  }

  /**
   * Returns the sum-squared error resulting from comparing the calculated Network outputs with the expected outputs, using the current inputs and weights.
   * @return {number}
   */
  this.sumSqError = function () {
    return 0.5 * this.outputLayer().getNeurons().reduce((sum, neuron) => {
      return sum + Math.pow(neuron.error(), 2)
    }, 0)
  }

  /**
   * Applies the back-propagation algorithm to recalculate the deltas for each Neuron in the Network, working from the output Layer to the input Layer.
   * @return {Array<Array<number>>}  The deltas for the Neurons in each of the output Layers.
   */
  this.backPropagate = function () {
    this.invalidate()
    this.calc()
    var layerCount = this.layerCount()
    return layers.map((ignore, ind) => {
      var layer = layers[layerCount - ind - 1]
      return layer.calcDeltas()
    })
  }

  /**
   * Returns the ids for all the Neurons in the Network.
   * @return {Array<Array<number>>}
   */
  this.getIds = function () {
    return layers.map(layer => layer.getIds())
  }

  /**
   * Gets the output weight partials for each Neuron in the Network
   * @see {@link Neuron#getInputWeightPartials}
   * @return {Array<Array<Array<number>>>}  Input weight partials for each Neuron.
   */
  this.getOutputWeightPartials = function () {
    return layers.map(layer => layer.getOutputWeightPartials())
  }

  /**
   * Gets the output weight partials for each Neuron in the Network
   * @see {@link Neuron#getOutputWeightPartials}
   * @return {Array<Array<Array<number>>>}  Output weight partials for each Neuron.
   */
  this.getInputWeightPartials = function () {
    return layers.map(layer => layer.getInputWeightPartials())
  }

  /**
   * Gets the input weights for each Neuron in the network.
   * @return {Array<Array<Array<number>>>}  Input weights by input, Neuron and Layer.
   */
  this.getWeights = function () {
    return layers.map(layer => layer.getWeights())
  }

  /**
   * Sets the weights for the entire network in one go.  Useful for rebuilding a trained network.
   * @param  {Array<Array<Array<number>>>} The inner-most Arrays refer to the input weights for each Neuron.  These should be arranged in Arrays corresponding to each Neuron in a Layer.  Finally, the weights for each Layer should make up the outer-most Array.
   */
  this.setWeights = function (weights) {
    layers.map((layer, layerInd) => layer.setWeights(weights[layerInd].slice(0)))
  }

  return this
}

/**
 * Creates a new TrainingData object, which can be used to make generators which iterate over the supplied set of examples.  This is very useful for repeated training on a single set of data.
 * @constructor
 * @param {object[]} data An array of trial objects pertaining to individual training examples.
 * @param {number[]} [trial.inputs] An array of inputs for this trial.  This must be the same length as the number of Neurons in the input layer of the Network that it will be used to train.
 * @param {number[]} [trial.outputs] An array of expected outputs for this trial.  This must be the same length as the number of Neurons in the output layer of the Network that it will be used to train.
 */
function TrainingData (data) {
  if (!(this instanceof TrainingData)) return new TrainingData(data)
  var dataLength = data.length

  function *dataGen () {
    yield* data
    return dataLength
  }

  /**
   * Returns a generator which iterators over the dataset which was used to construct the TrainingData object.
   * @return {generator}
   */
  this.dataGenerator = function () {
    return dataGen()
  }

  /**
   * Gives the number of individual trials in the associated data set.
   * @return {number}
   */
  this.dataLength = function () {
    return dataLength
  }

  return this
}


/**
* @memberof neural
 * Returns a generator which trains the given Network with one epoch of the supplied training data (i.e. one update for each example in the training set) when `next` is invoked.
 * Calling `next` will return an object with the current epoch, average sum-squared error of the last epoch, the best achieved error, the associated best network weights and the current learning rate (alpha).
 * @param  {Network} network      The neural network to train.
 * @param  {TrainingData} trainingData A TrainingData object to use to train the network.
 * @param  {Object} params
 * @param  {number} [params.alpha=0.5] The initial learning rate.
 * @param  {number} [params.lambda=0.01] The damping factor (which pulls weights back towards 0 to avoid them escalating).
 * @param  {number} [params.progressiveAlpha=] Allows the learning rate to increase gradually when calculated errors are declining, and pull back if they increase.
 * @param  {number} [params.progressiveAlpha.creep=1.01] The proportional increase in alpha (learning rate) after every epoch which results in an improved net error.
 * @param  {number} [params.progressiveAlpha.reversal=0.75] The pull-back in alpha (learning rate) after any epoch which results in an increased net error.
 * @param  {number} [params.progressiveAlpha.floor=0] The lowest level the learning rate will be permitted to reach, even if errors continue to increase. Can help to avoid problems with local minima.
 * @param  {boolean} [params.verbose=false] Also yield the calculated (actual) outputs for the last training epoch, for visualisation of training progress.
 * @return {generator}
 */
function* trainer (network, trainingData, params) {
  params = params || {}
  var alpha = params.alpha || network.alpha || 0.5
  var alphaUpdater = alphaUpdaterGen(alpha)
  var lambda = params.lamdba || network.lambda || 0.01
  var dataLength = trainingData.dataLength()
  var progressiveAlpha = params.progressiveAlpha ? {
    creep: params.progressiveAlpha.creep || 1.01,
    reversal: params.progressiveAlpha.reversal || 0.75,
    floor: params.progressiveAlpha.floor || 0
  } : false
  var verbose = params.verbose
  var minError
  var bestWeights
  var epoch = 0
  var complete = false

  network.randomizeWeights(0.00000001)
  while (!complete) {
    complete = yield runEpoch()
  }

  function runEpoch () {
    epoch += 1
    var dataGen = trainingData.dataGenerator()
    var error = 0
    var outputs = []

    for (var trial of dataGen) {
      error += feedForwardAndCalcError(trial)
      network.backPropagate()
      if (verbose) {
        outputs.push(network.outputLayer().getActivations())
      }
      updateNetworkWeights(network.getInputWeightPartials())
    }

    var weightedError = Math.pow(error / dataLength, 0.5)
    if (progressiveAlpha) alpha = alphaUpdater.next(weightedError).value
    if (!minError || weightedError < minError) {
      minError = weightedError
      bestWeights = network.getWeights()
    }
    var result = {
      epoch: epoch,
      error: weightedError,
      minError: minError,
      bestWeights: bestWeights,
      alpha: alpha
    }
    if (verbose) result.outputs = outputs
    return result
  }

  function feedForwardAndCalcError (trial) {
    network.forwardPropagate(trial)
    return network.sumSqError()
  }

  function updateNetworkWeights (weightMap) {
    var layers = network.getLayers()
    layers.forEach((layer, layerInd) => {
      if (layerInd === 0) return
      layer.getNeurons().forEach((neuron, neuronInd) => {
        var neuronWeights = neuron.getWeights()
        var weightMapThisNeuron = weightMap[layerInd][neuronInd]
        neuronWeights = neuronWeights.map((neuronWeight, neuronWeightInd) => {
          return neuronWeight - (alpha * (weightMapThisNeuron[neuronWeightInd] + (lambda * neuronWeight / dataLength)))
        })
        neuron.setWeights(neuronWeights)
      })
    })
  }

  function* alphaUpdaterGen (alpha) {
    alpha = alpha || 0.5
    var error
    var lastError
    while (true)  {
      if (error && lastError) {
        if (error <= lastError) alpha *= progressiveAlpha.creep
        else alpha *= progressiveAlpha.reversal
      }
      if (progressiveAlpha.floor && alpha < progressiveAlpha.floor) alpha = progressiveAlpha.floor
      lastError = error
      error = yield alpha
    }
  }
}

function batch (trainer, freq) {
  var timer = new Date()
  var next = function (inp) {
    return new Promise(resolve => {
      var newTime = new Date()
      if ((newTime - timer) > freq) {
        setTimeout(() => {
          timer = newTime
          resolve(trainer.next(inp))
        }, 0)
      } else {
        resolve(trainer.next(inp))
      }
    })
  }

  return { next }
}

function race (trainerArrayInput, rules, opts) {
  opts = opts || {}
  var epoch = 0
  var trainerArray = trainerArrayInput.slice(0)
  var lastResults = []
  var errorThreshold = opts.errorThreshold || 0
  var maxEpochs = opts.maxEpochs || null
  var currMinError
  while ((!currMinError || currMinError > errorThreshold) && (!maxEpochs || epoch <= maxEpochs)) {
    lastResults = trainerArray.map((trainer, ind) => {
      return (lastResults[ind] && lastResults[ind].done) ? lastResults[ind] : trainer.gen.next()
    })
    currMinError = calcCurrMinError(lastResults)
    if (rules[epoch]) {
      console.log(`Trimming to ${rules[epoch]} trainers`)
      trainerArray = trim(trainerArray, lastResults, rules[epoch])
    }
    console.log(`Epoch ${epoch} - current global min error is ${currMinError}`)
    epoch = epoch + 1
  }

  return trainerArray

  function trim (trainerArray, lastResults, num) {
    var indices = lastResults.slice(0).sort(results => -results.value.minError).map(results => lastResults.findIndex(theseResults => results.value.error === theseResults.value.error)).slice(0, num)
    return indices.map(ind => trainerArray[ind])
  }

  function calcCurrMinError (lastResults) {
    return lastResults.reduce((min, results) => (min === null || results.value.error < min) ? results.value.error : min, null)
  }
}

function randNum (max, min) {
  max = max || 1
  min = min || 0
  return (Math.random() * (max - min)) + min
}

/**
 * @callback one-to-one
 * @param {number} input Input value.
 * @returns {number} output Output value.
 */

/**
 * Adds a function to the store of {@link transferFunctions} which can be applied to Neurons to convert the input sum into an activation value.
 * @param  {string} key   transfer Function name
 * @param  {one-to-one} fn    The transfer function itself, which should take a number and output a number.  It should be differentiable if it's to be used in network training.
 * @param  {one-to-one} deriv The derivative of the transfer function, which is required for back-propagation.  It should take a number and output a number.
 */
function addTransferFunction (key, fn, deriv) {
  transferFunctions[key] = fn
  transferFunctions[key].derivative = deriv
}

addTransferFunction('logSigmoid', function logSigmoid (x) {
  return (1 / (1 + Math.exp(-x)))
}, function logSigmoidDeriv (inputSum, activation) {
  return activation * (1 - activation)
})

addTransferFunction('linear', function linear (x) {
  return x
}, function linearDeriv () {
  return 1
})

addTransferFunction('rectifier', function rectifier (x) {
  return Math.log(1 + Math.exp(x))
}, function rectifierDeriv (inputSum) {
  return (1 / (1 + Math.exp(-inputSum)))
})

function randomId () {
  return 'xxxxxxxxxxxx'.replace(/[x]/g, () => {
    var r = Math.random()*16|0
    return r.toString(16)
  })
}

function networkSum(X, Y, ignoreLayers) {
  return X.map((xLayer, layerInd) => {
    if (ignoreLayers && ignoreLayers.some(ind => ind === layerInd)) return xLayer
    return xLayer.map((xNeuron, neuronInd) => {
      return xNeuron.map((xWeight, weightInd) => {
        return xWeight + Y[layerInd][neuronInd][weightInd]
      })
    })
  })
}

function check (value, message) {
  if (isNaN(value)) {
    throw new Error(`Overflow: ${message}`)
  }
}

module.exports = {
  Neuron,
  Layer,
  Network,
  TrainingData,
  trainer,
  batch,
  race,
  transferFunctions,
  addTransferFunction
}
