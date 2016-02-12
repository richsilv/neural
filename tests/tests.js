var test = require('tape')
var neural = require('../neural')

test('creation of atomic units', function(t) {
  t.plan(3)

  var neuron = new neural.Neuron({
    inputs: [
      function () { return new Date().getTime() },
      1
    ],
    weights: [
      0.5,
      0.5
    ]
  })

  t.ok(neuron instanceof neural.Neuron, 'Can create a Neuron')

  var layer = new neural.Layer({ neurons: 3 })
  t.ok(layer instanceof neural.Layer, 'Can create a Layer')

  var network = new neural.Network({
    layers: [3, 4, 2]
  })
  t.ok(network instanceof neural.Network, 'Can create a Network')
})
