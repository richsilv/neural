var matrix = require('./matrix')

function Neuron (params) {
  if (!(this instanceof Neuron)) return new Neuron(params)

  var bias = params.bias || 0
  var transfer = params.transfer || logSigmoid
  var inputs = params.inputs || []
  var weights = params.weights || matrix.zeros(inputs.length)
  var outputNeurons = []
  var expectedOutputVal = 0
  var activationCache = null
  var inputSumCache = null
  var delta = 0

  this.setInputs = function (newInputs) {
    if (newInputs.length !== inputs.length) weights = matrix.zeros(newInputs.length)
    this.invalidate()
    inputs = newInputs
  }

  this.getInputCount = function () {
    return inputs.length
  }

  this.updateWeights = function (newWeights) {
    this.invalidate()
    weights = newWeights
  }

  this.getWeight = function (ind) {
    return weights[ind]
  }

  this.updateBias = function (bias) {
    bias = bias
  }

  this.getTransfer = function () {
    return transfer
  }

  this.getDelta = function () {
    return delta
  }

  this.isOutput = function () {
    return expectedOutputVal !== null
  }

  this.updateOutputNeurons = function (neurons) {
    expectedOutputVal = null
    outputNeurons = neurons
  }

  this.addInput = function (input) {
    inputs.push(input)
    weights.push(0)
    this.invalidate()
  }

  this.calc = function () {
    if (activationCache !== null) return activationCache
    // console.log('Input Matrix', inputMatrix)
    // console.log('weight', weights)
    // console.log('bias', bias)
    // console.log('Invoke Matrix', invokeMatrix(inputMatrix))
    inputSumCache = matrix.mult(matrix.invoke(inputs), matrix.transpose(weights), true) + bias
    activationCache = transfer(inputSumCache)
    return activationCache
  }

  this.invalidate = function () {
    activationCache = null
  }

  this.calcDelta = function () {
    if (this.isOutput()) return this.calcOutputDelta()
    delta = outputNeurons.reduce((total, neuron, ind) => {
      return total + (neuron.getDelta() * neuron.getWeight(ind))
    }, 0) * transfer.derivative(inputSumCache, activationCache)
    return delta
  }

  this.calcOutputDelta = function () {
    delta = -(expectedOutputVal - activationCache) * transfer.derivative(inputSumCache, activationCache)
    return delta
  }

  this.calcWeightPartial = function (ind) {
    return activationCache * outputNeurons[ind].getDelta()
  }

  this.calcBiasPartial = function (ind) {
    return outputNeurons[ind].getDelta()
  }

  this.getOutputWeightPartials = function () {
    return outputNeurons.map(neuron => activationCache * neuron.getDelta())
  }

  this.getOutputBiasPartials = function () {
    return outputNeurons.map(neuron => neuron.getDelta())
  }

  this.randomizeWeights = function (max, min) {
    return weights.map((weight, ind) => {
      var newWeight = randNum(max, min)
      weights[ind] = newWeight
    })
  }

  return this
}

function Layer (params) {
  var neurons = []
  var isOutput = true
  var isInput = false

  if (!(this instanceof Layer)) return new Layer(params)
  if (params.neurons instanceof Array) {
    neurons = params.neurons
  } else if (typeof params.neurons === 'number') {
    neurons = Array(params.neurons).fill(new Neuron(params))
  }
  if (params.isInput) isInput = true

  this.isOutput = function () {
    return isOutput
  }

  this.isInput = function () {
    return isInput
  }

  this.plug = function (layer) {
    layer.setInputs(neurons)
    isOutput = false
    neurons.forEach(neuron => {
      neuron.updateOutputNeurons(layer.getNeurons())
    })
    return layer
  }

  this.getNeurons = function () {
    return neurons
  }

  this.setInputs = function (inputs) {
    if (!(inputs instanceof Array)) throw new Error('Input must be an array')
    if (inputs.some(input => !(input instanceof Array))) {
      inputs = Array(neurons.length).fill(0).map(() => {
        return inputs.slice(0)
      })
    }
    inputs.forEach((inputArray, ind) => {
      neurons[ind].setInputs(inputArray)
    })
    return true
  }

  this.updateBias = function (bias) {
    neurons.forEach(neuron => {
      neuron.updateBias(bias)
    })
  }

  this.calc = function () {
    return neurons.map(neuron => neuron.calc())
  }

  this.invalidate = function () {
    return neurons.map(neuron => neuron.invalidate())
  }

  this.calcDeltas = function () {
    return neurons.map(neuron => {
      return neuron.calcDelta()
    })
  }

  this.getOutputWeightPartials = function () {
    return neurons.map(neuron => neuron.getOutputWeightPartials())
  }

  this.getOutputBiasPartials = function () {
    return neurons.map(neuron => neuron.getOutputBiasPartials())
  }

  this.randomizeWeights = function () {
    neurons.forEach(neuron => neuron.randomizeWeights())
  }

  return this
}

function Network (params) {
  if (!(this instanceof Network)) return new Network(params)
  var layers = []

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

  var inputLayer = new Layer({ neurons: layers[0].getNeurons().length })
  var firstLayer = layers[0]
  layers.unshift(inputLayer)
  inputLayer.getNeurons().forEach((neuron, ind) => {
    var firstLayerNeuron = firstLayer.getNeurons()[ind]
    neuron.updateOutputNeurons([firstLayerNeuron])
    firstLayerNeuron.setInputs([neuron])
  })

  this.layerCount = function () {
    return layers.length
  }

  this.getLayers = function () {
    return layers
  }

  this.inputLayer = function () {
    return layers[0]
  }

  this.outputLayer = function () {
    return layers[layers.length - 1]
  }

  this.setInputs = function (inputs) {
    return this.inputLayer().setInputs(inputs)
  }

  this.calc = function () {
    return this.outputLayer().calc()
  }

  this.invalidate = function () {
    return layers.map(layer => layer.invalidate())
  }

  this.randomizeWeights = function () {
    layers.forEach(layer => layer.randomizeWeights())
  }

  this.sumSqError = function (iter) {
    this.setInputs(iter.inputs)
    var outputs = this.outputLayer().calc()
    return 0.5 * outputs.reduce((sum, output, ind) => {
      return sum + Math.pow(output - iter.outputs[ind], 2)
    })
  }

  this.backpropagate = function () {
    this.invalidate()
    this.calc()
    var layerCount = this.layerCount()
    return layers.map((ignore, ind) => {
      var layer = layers[layerCount - ind - 1]
      return layer.calcDeltas()
    })
  }

  this.train = function (trainingData, epochs) {
    var errorMap = layers.map(layer => {
      layer.getNeurons().map(neuron => {
        return matrix.zeros(neuron.getInputCount())
      })
    })
    Array(epochs).fill(0).forEach(() => {
      var data = trainingData.dataGenerator()
      var trial = data.next()
      while (!trial.done) {
        // Prime network and calculate partials
        layers.forEach((layer, layerInd) => {
          layer.getNeurons().forEach((neuron, neuronInd) => {

          })
        })
        trial = data.next()
      }
    })
  }

  this.showLayerWeights = function () {
    return layers.map(layer => layer.getOutputWeightPartials())
  }

  return this
}

function TrainingData (data) {
  if (!(this instanceof TrainingData)) return new TrainingData(data)
  var dataLength = data.length
  var i

  function *dataGen () {
    for (i = 0; i < dataLength; i += 1) {
      yield data[i]
    }
    return dataLength
  }

  this.dataGenerator = function () {
    return dataGen()
  }

  return this
}

function randNum (max, min) {
  max = max || 1
  min = min || 0
  return (Math.random() * (max - min)) + min
}

function logSigmoid (x) {
  return (1 / (1 + Math.exp(-x)))
}
logSigmoid.derivative = function (inputSum, activation) {
  return activation * (1 - activation)
}

module.exports = {
  Neuron,
  Layer,
  Network,
  TrainingData
}
