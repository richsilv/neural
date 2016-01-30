var matrix = require('./matrix')
var neuronId = 0
var transferFunctions = {}

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

  this.setInputs = function (newInputs) {
    if (newInputs.length !== inputs.length) weights = matrix.zeros(newInputs.length)
    this.invalidate()
    inputs = newInputs
  }

  this.getInputs = function () {
    return inputs
  }

  this.getInputCount = function () {
    return inputs.length
  }

  this.updateWeights = function (newWeights) {
    this.invalidate()
    weights = newWeights.slice(0)
  }

  this.getWeights = function () {
    return weights.slice(0)
  }

  this.getId = function () {
    return id
  }

  this.getTransfer = function () {
    return transfer
  }

  this.setTransfer = function (fn) {
    transfer = fn
  }

  this.getActivation = function () {
    return activationCache
  }

  this.getInputSum = function () {
    return inputSumCache
  }

  this.getDelta = function () {
    return delta
  }

  this.isOutput = function () {
    return expectedOutputVal !== null
  }

  this.setExpected = function (val) {
    expectedOutputVal = val
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
    // console.log('Inputs', inputs.length)
    // console.log('weight', weights)
    // console.log('Invoke Matrix', matrix.invoke(inputs))
    inputSumCache = matrix.mult(matrix.invoke(inputs), matrix.transpose(weights), true)
    activationCache = transfer(inputSumCache)
    // console.log('Recalc', activationCache)
    // console.log('****************')
    return activationCache
  }

  this.error = function () {
    return activationCache - expectedOutputVal
  }

  this.invalidate = function () {
    activationCache = null
  }

  this.calcDelta = function () {
    if (this.isOutput()) return this.calcDeltaOutputLayer()
    delta = outputNeurons.reduce((total, neuron) => {
      var index = neuron.getInputs().findIndex(input => input.getId && input.getId() === id)
      return total + (neuron.getDelta() * neuron.getWeights()[index])
    }, 0) * transfer.derivative(inputSumCache, activationCache)
    return delta
  }

  this.calcDeltaOutputLayer = function () {
    // console.log(expectedOutputVal, activationCache, inputSumCache, transfer.derivative(inputSumCache, activationCache))
    delta = -(expectedOutputVal - activationCache) * transfer.derivative(inputSumCache, activationCache)
    return delta
  }

  this.calcWeightPartial = function (ind) {
    return activationCache * outputNeurons[ind].getDelta()
  }

  this.getOutputWeightPartials = function () {
    return outputNeurons.map(neuron => activationCache * neuron.getDelta())
  }

  this.getInputWeightPartials = function () {
    return inputs.map(input => (input instanceof Neuron) ? input.getActivation() * delta : delta)
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

  this.isOutput = function () {
    return isOutput
  }

  this.setStatus = function (statuses) {
    if (typeof statuses.input === 'boolean') isInput = statuses.isInput
    if (typeof statuses.output === 'boolean') isOutput = statuses.isOutput
  }

  this.plug = function (outputLayer) {
    // Add an extra input for bias
    outputLayer.setStatus({ input: false })
    outputLayer.setInputs(neurons.concat(1))
    isOutput = false
    neurons.forEach(neuron => {
      neuron.updateOutputNeurons(outputLayer.getNeurons())
    })
    return outputLayer
  }

  this.getNeurons = function () {
    return neurons
  }

  this.setInputs = function (inputs, isInputLayer) {
    if (!(inputs instanceof Array)) throw new Error('Inputs must be an array')
    if (isInputLayer) {
      if (inputs.length !== neurons.length) throw new Error(`Number of inputs (${inputs.length}) differs from number of neurons in input layer (${neurons.length})`)
      isInput = true
      neurons.forEach((neuron, ind) => {
        neuron.setInputs([inputs[ind]])
        neuron.updateWeights([1])
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
    return true
  }

  this.setOutputs = function (outputs) {
    if (!(outputs instanceof Array)) throw new Error('Outputs must be an array')
    if (outputs.length !== neurons.length) throw new Error(`Number of outputs (${outputs.length}) differs from number of neurons in layer (${neurons.length})`)
    neurons.forEach((neuron, ind) => neuron.setExpected(outputs[ind]))
    return true
  }

  this.setTransfer = function (fn) {
    return neurons.forEach(neuron => neuron.setTransfer(fn))
  }

  this.calc = function () {
    return neurons.map(neuron => neuron.calc())
  }

  this.invalidate = function () {
    return neurons.map(neuron => neuron.invalidate())
  }

  this.calcDeltas = function () {
    return neurons.map(neuron => neuron.calcDelta())
  }

  this.getWeights = function () {
    return neurons.map(neuron => neuron.getWeights())
  }

  this.setWeights = function (weights) {
    return neurons.map((neuron, neuronInd) => neuron.updateWeights(weights[neuronInd]))
  }

  this.getActivations = function () {
    return neurons.map(neuron => neuron.getActivation())
  }

  this.getInputSums = function () {
    return neurons.map(neuron => neuron.getInputSum())
  }

  this.getIds = function () {
    return neurons.map(neuron => neuron.getId())
  }

  this.getOutputWeightPartials = function () {
    return neurons.map(neuron => neuron.getOutputWeightPartials())
  }

  this.getInputWeightPartials = function () {
    return neurons.map(neuron => neuron.getInputWeightPartials())
  }

  this.randomizeWeights = function (e) {
    if (isInput) return
    neurons.forEach(neuron => neuron.randomizeWeights(-e, e))
  }

  return this
}

function Network (params) {
  if (!(this instanceof Network)) return new Network(params)
  var layers = []
  var alpha = (typeof params.alpha === 'number') ? params.alpha : 0.1
  var lambda = (typeof params.lambda === 'number') ? params.lambda : 0.1
  var onCalc = params.onCalc || function () {}
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
    return this.inputLayer().setInputs(inputs, true)
  }

  this.setExpected = function (outputs) {
    return this.outputLayer().setOutputs(outputs)
  }

  this.getAlpha = function () {
    return alpha
  }

  this.setAlpha = function (newAlpha) {
    return alpha = newAlpha
  }

  this.calc = function (trialInputs) {
    if (trialInputs) {
      this.invalidate()
      this.setInputs(trialInputs)
    }
    var calc = this.outputLayer().calc()
    onCalc.call(this, calc)
    return calc
  }

  this.getActivations = function () {
    return layers.map(layer => layer.getActivations())
  }

  this.getInputSums = function () {
    return layers.map(layer => layer.getInputSums())
  }

  this.invalidate = function () {
    return layers.map(layer => layer.invalidate())
  }

  this.randomizeWeights = function (e) {
    layers.forEach(layer => layer.randomizeWeights(e))
  }

  this.forwardPropagate = function (iter) {
    this.invalidate()
    this.setInputs(iter.inputs)
    this.setExpected(iter.outputs)
    this.calc()
  }

  this.sumSqError = function () {
    return 0.5 * this.outputLayer().getNeurons().reduce((sum, neuron) => {
      return sum + Math.pow(neuron.error(), 2)
    }, 0)
  }

  this.backPropagate = function () {
    this.invalidate()
    this.calc()
    var layerCount = this.layerCount()
    return layers.map((ignore, ind) => {
      var layer = layers[layerCount - ind - 1]
      return layer.calcDeltas()
    })
  }

  this.train = function (trainingData, epochs, opts) {
    var minError
    var bestWeights
    var errorCache = []
    opts = opts || {}
    if (opts.randomize) this.randomizeWeights(0.1)
    alpha = opts.alpha || alpha
    lambda = opts.lamdba || lambda
    onCalc = opts.onCalc || onCalc
    Array(epochs).fill(0).forEach((ignore, ind) => {
      var data = trainingData.dataGenerator()
      var trial = data.next()
      var error = 0
      var inputWeightPartials
      var newWeights = this.getWeights()
      var weightMap = newWeights.map(layer => {
        return layer.map(neuron => {
          return matrix.zeros(neuron.length)
        })
      })
      while (!trial.done) {
        // Prime network and calculate partials
        this.forwardPropagate(trial.value)
        error += this.sumSqError()
        this.backPropagate()
        inputWeightPartials = this.getInputWeightPartials()
        // console.log(this.getActivations())
        inputWeightPartials.forEach((layer, layerInd) => {
          if (layerInd === 0) return
          layer.forEach((neuron, neuronInd) => {
            neuron.forEach((inputWeight, inputWeightInd) => {
              weightMap[layerInd][neuronInd][inputWeightInd] += inputWeight
            })
          })
        })
        trial = data.next()
      }
      weightMap.forEach((layer, layerInd) => {
        if (layerInd === 0) return
        layer.forEach((neuron, neuronInd) => {
          var layerWeights = newWeights[layerInd][neuronInd]
          layerWeights.forEach((inputWeight, inputWeightInd) => {
            layerWeights[inputWeightInd] -= alpha * ((weightMap[layerInd][neuronInd][inputWeightInd] / trial.value) + (lambda * layerWeights[inputWeightInd]))
          })
          layers[layerInd].getNeurons()[neuronInd].updateWeights(layerWeights)
        })
      })
      if (typeof minError === 'undefined') minError = error
      if (error < minError) {
        minError = error
        bestWeights = this.getWeights()
      }
      alpha = updateAlpha(alpha, error, errorCache)
      console.log(`Epoch ${ind}: mean error is ${Math.pow(error / trial.value, 0.5)}, alpha is ${alpha}`)
    })
    this.setWeights(bestWeights)
    return { minError, alpha }

    function updateAlpha (alpha, error, errorCache) {
      if (errorCache.length < 5) {
        errorCache.push(error)
        return alpha
      }
      var lastError = errorCache.slice(-1)[0]
      var droppedError = errorCache.shift()
      errorCache.push(error)
      // var averageError = errorCache.reduce((sum, err) => sum + err, 0) / errorCache.length
      if (lastError <= error) return alpha * 0.9
      // var improvementRatio = (droppedError   lastError) / (errorCache.length * averageError)
      // console.log(`improvement ratio: ${improvementRatio}`)
      return alpha * 1.01
    }

  }

  this.getIds = function () {
    return layers.map(layer => layer.getIds())
  }
  this.getOutputWeightPartials = function () {
    return layers.map(layer => layer.getOutputWeightPartials())
  }
  this.getInputWeightPartials = function () {
    return layers.map(layer => layer.getInputWeightPartials())
  }
  this.getWeights = function () {
    return layers.map(layer => layer.getWeights())
  }
  this.setWeights = function (weights) {
    layers.map((layer, layerInd) => layer.setWeights(weights[layerInd].slice(0)))
  }

  console.log(`Made neural network, alpha = ${alpha}, lambda = ${lambda}`)
  return this
}

function TrainingData (data) {
  if (!(this instanceof TrainingData)) return new TrainingData(data)
  var dataLength = data.length

  function *dataGen () {
    yield* data
    return dataLength
  }

  this.dataGenerator = function () {
    return dataGen()
  }

  this.dataLength = function () {
    return dataLength
  }

  return this
}

function* Trainer (network, trainingData, opts) {
  opts = opts || {}
  var alpha = opts.alpha || network.alpha || 0.5
  var lambda = opts.lamdba || network.lambda || 0.01
  var dataLength = trainingData.dataLength()
  var minError
  var bestWeights
  var errorCache = []
  var epoch = 0
  var complete = false

  while (!complete) {
    complete = yield runEpoch()
  }

  function runEpoch () {
    epoch += 1
    var dataGen = trainingData.dataGenerator()
    var weightMap = makeWeightMap()
    var error = 0

    for (var trial of dataGen) {
      error += feedForwardAndCalcError(trial)
      network.backPropagate()
      weightMap = updateWeightMap(weightMap)
    }

    var weightedError = Math.pow(error / dataLength, 0.5)
    updateNetworkWeights(weightMap)
    return {
      epoch: epoch,
      error: weightedError
    }
  }

  function makeWeightMap () {
    var weights = network.getWeights()
    return weights.map(layer => {
      return layer.map(neuron => {
        return matrix.zeros(neuron.length)
      })
    })
  }

  function feedForwardAndCalcError (trial) {
    network.forwardPropagate(trial)
    return network.sumSqError()
  }

  function updateWeightMap (weightMap) {
    var inputWeightPartials = network.getInputWeightPartials()
    return networkSum(weightMap, inputWeightPartials, [0])
  }

  function updateNetworkWeights (weightMap) {
    var layers = network.getLayers()
    layers.forEach((layer, layerInd) => {
      if (layerInd === 0) return
      layer.getNeurons().forEach((neuron, neuronInd) => {
        var neuronWeights = neuron.getWeights()
        var weightMapThisNeuron = weightMap[layerInd][neuronInd]
        neuronWeights = neuronWeights.map((neuronWeight, neuronWeightInd) => {
          return neuronWeight - (alpha * ((weightMapThisNeuron[neuronWeightInd] / dataLength) + (lambda * neuronWeight)))
        })
        neuron.updateWeights(neuronWeights)
      })
    })
  }
}

function TrainerOld (network, trainingData, opts) {
  if (!(this instanceof TrainerOld)) return new TrainerOld(network, trainingData, opts)

  var minError
  var errorCache = []
  var bestWeights
  var dataLength = trainingData.dataLength()
  opts = opts || {}
  if (opts.randomize) network.randomizeWeights(0.1)
  if (opts.weights) network.setWeights(opts.weights)
  var alpha = opts.alpha || network.alpha || 0.5
  var lambda = opts.lamdba || network.lambda || 0.01
  if (opts.progressiveAlpha) {
    var creep = opts.progressiveAlpha.creep || 1.01
    var reversal = opts.progressiveAlpha.reversal || 0.9
  }
  var alphaFloor = opts.alphaFloor || 0.00000001
  var epoch = 0

  function* trainerGen() {
    var data
    var error = 0
    var inputWeightPartials
    var newWeights
    var weightMap
    var currentData
    var layers = network.getLayers()
    while (alpha > alphaFloor && (!opts.threshold || !minError || minError > opts.threshold) && (!opts.maxEpochs || epoch <= opts.maxEpochs)) {
      inputWeightPartials = null
      newWeights = network.getWeights()
      weightMap = newWeights.map(layer => {
        return layer.map(neuron => {
          return matrix.zeros(neuron.length)
        })
      })
      if (currentData) {
        network.setWeights(currentData.weights)
        alpha = currentData.alpha
      }

      data = trainingData.dataGenerator()
      error = 0
      var trial
      for (trial of data) {
        error += primeAndCalcNetwork(network, trial, weightMap)
      }

      weightMap.forEach((layer, layerInd) => {
        if (layerInd === 0) return
        layer.forEach((neuron, neuronInd) => {
          var layerWeights = newWeights[layerInd][neuronInd]
          layerWeights.forEach((inputWeight, inputWeightInd) => {
            layerWeights[inputWeightInd] -= alpha * ((weightMap[layerInd][neuronInd][inputWeightInd] / dataLength) + (lambda * layerWeights[inputWeightInd]))
          })
          layers[layerInd].getNeurons()[neuronInd].updateWeights(layerWeights)
        })
      })
      if (typeof minError === 'undefined') minError = error
      if (error < minError) {
        minError = error
        bestWeights = network.getWeights()
      }

      if (opts.verbose) console.log(`Epoch ${epoch}: mean error is ${Math.pow(error / dataLength, 0.5)}, alpha is ${alpha}`)
      currentData = {
        network,
        epoch,
        minError: Math.pow(minError / dataLength, 0.5),
        bestWeights,
        error: Math.pow(error / dataLength, 0.5),
        weights: newWeights.map(layer => layer.slice(0)),
        alpha
      }
      yield currentData

      if (creep || reversal) alpha = updateAlpha(alpha, error, errorCache)
      epoch += 1
    }

    function primeAndCalcNetwork (network, trial, weightMap) {
      network.forwardPropagate(trial)
      var error = network.sumSqError()
      network.backPropagate()
      var inputWeightPartials = network.getInputWeightPartials()
      inputWeightPartials.forEach((layer, layerInd) => {
        if (layerInd === 0) return
        layer.forEach((neuron, neuronInd) => {
          neuron.forEach((inputWeight, inputWeightInd) => {
            weightMap[layerInd][neuronInd][inputWeightInd] += inputWeight
          })
        })
      })
      return error
    }

    return {
      network,
      epoch,
      minError: Math.pow(minError / dataLength, 0.5),
      bestWeights,
      alpha
    }
  }

  this.gen = trainerGen()

  return this

  function updateAlpha (alpha, error, errorCache) {
    if (errorCache.length < 5) {
      errorCache.push(error)
      return alpha
    }
    var lastError = errorCache.slice(-1)[0]
    var droppedError = errorCache.shift()
    errorCache.push(error)
    // var averageError = errorCache.reduce((sum, err) => sum + err, 0) / errorCache.length
    if (lastError <= error) return alpha * 0.9
    // var improvementRatio = (droppedError   lastError) / (errorCache.length * averageError)
    // console.log(`improvement ratio: ${improvementRatio}`)
    return alpha * 1.01
  }
}

// function updateAlpha (alpha, error, errorCache) {
//   if (errorCache.length < 5) {
//     errorCache.push(error)
//     return alpha
//   }
//   var lastError = errorCache.slice(-1)[0]
//   var droppedError = errorCache.shift()
//   errorCache.push(error)
//   // var averageError = errorCache.reduce((sum, err) => sum + err, 0) / errorCache.length
//   if (lastError <= error) return alpha * 0.9
//   // var improvementRatio = (droppedError - lastError) / (errorCache.length * averageError)
//   // console.log(`improvement ratio: ${improvementRatio}`)
//   return alpha * 1.01
// }

function race(trainerArrayInput, rules, opts) {
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

module.exports = {
  Neuron,
  Layer,
  Network,
  TrainingData,
  Trainer,
  race,
  transferFunctions
}
