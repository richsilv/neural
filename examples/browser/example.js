var Chartist = require('chartist')
var neural = require('../../neural')

var rawTrainingData = makeTrainingDataSin(100)
var trainingData = new neural.TrainingData(rawTrainingData)
var trainingSeries = rawTrainingData.map(data => ({ x: data.inputs[0], y: data.outputs[0] }))
var network = makeNetwork()
var trainer = makeTrainer(network, trainingData)
var res = trainer.next()
var outputs = res.value.outputs.map(data => data[0])
var chartSeries = makeChartSeries(outputs)

var chart = new Chartist.Line('.ct-chart', { series: chartSeries }, {
  axisX: {
    type: Chartist.AutoScaleAxis
  },
  height: '500px'
})

setInterval(() => {
  var res = trainer.next()
  var outputs = res.value.outputs.map(data => data[0])
  var chartSeries = makeChartSeries(outputs)
  chart.update({ series: chartSeries })
}, 1)

function makeTrainingDataSin (n, offset) {
  offset = offset || 0
  return Array(n).fill(0).map((ignore, ind) => {
    var input = 10 - (20 * ind / n)
    return {
      inputs: [input],
      outputs: [Math.sin(input + offset)]
    }
  })
}

function makeNetwork () {
  var network = new neural.Network({ layers: [1, 3, 5, 3, 1], transfer: neural.transferFunctions.rectifier })
  network.outputLayer().setTransfer(neural.transferFunctions.linear)
  network.randomizeWeights(0.0001)
  return network
}

function makeTrainer (network, trainingData) {
  return neural.trainer(network, trainingData, {
    alpha: 0.1,
    lambda: 0.0001,
    progressiveAlpha: { creep: 1.01, reversal: 0.5 },
    verbose: true
  })
}

function makeChartSeries (outputs) {
  if (!outputs) return [ trainingSeries ]
  return [
    trainingSeries,
    trainingSeries.map((point, ind) => {
      return {
        x: point.x,
        y: outputs[ind]
      }
    })
  ]
}
