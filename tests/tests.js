var test = require('tape')
var neural = require('../neural')

test('Neuron tests', function (t) {
  var neuron = new neural.Neuron({
    inputs: [
      function () { return new Date().getTime() },
      1
    ],
    weights: [ 1, 1 ]
  })
  neuron.setTransfer(neural.transferFunctions.linear)
  t.ok(neuron instanceof neural.Neuron, 'Can create a Neuron')
  t.equal(neuron.getInputCount(), 2, 'Neuron has the correct number of inputs')
  neuron.randomizeWeights(-1, 1)
  neuron.getWeights().forEach(weight => t.notEqual(weight, 0, 'Weights can be randomized'))
  neuron.invalidate()
  t.ok(neuron.calc(), 'Neuron activation can be calculated')
  var fn = neuron.getTransfer()
  var inputSum = neuron.getInputSum()
  t.equal(fn(inputSum), neuron.getActivation(), 'Input sum maps to activation')
  neuron.setInputs([1, 2])
  neuron.setWeights([1, 2])
  neuron.invalidate()
  neuron.calc()
  neuron.setExpected(5)
  t.equal(neuron.error(), 0, 'Neuron error calculation is correct')
  t.end()
})

test('Layer tests', function (t) {
  var layer = new neural.Layer({ neurons: 3 })
  t.ok(layer instanceof neural.Layer, 'Can create a Layer')
  t.equal(layer.getNeurons().length, 3, 'Layer has the correct number of neurons')
  t.ok(layer.isOutput(), 'Layer is output by default')
  t.end()
})

test('Network tests', function (t) {
  var network = new neural.Network({
    layers: [3, 4, 2]
  })
  t.ok(network instanceof neural.Network, 'Can create a Network')
  t.end()
})
