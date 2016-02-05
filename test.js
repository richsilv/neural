var neural = require('./neural')

var network = new neural.Network({ layers: [1, 5, 5, 1], alpha: 0.1, lambda: 0, transfer: neural.transferFunctions.rectifier })
network.outputLayer().setTransfer(neural.transferFunctions.linear)
var rawTrainingData = makeTrainingDataSin(100)

var trainingData = new neural.TrainingData(rawTrainingData)
var trainer = neural.trainer(network, trainingData, {
  alpha: 0.1,
  lambda: 0.0001,
  progressiveAlpha: { creep: 1.01, reversal: 0.9, floor: 0.01 },
  verbose: true
})
new Array(100).fill(0).forEach(() => {
  var res = trainer.next().value
  console.log(`Epoch: ${res.epoch}, error: ${res.error}, alpha: ${res.alpha}`)
})

module.exports = {
  neural,
  network,
  trainingData,
  makeTrainingData
}

function makeTrainingDataSin (n) {
  return Array(n).fill(0).map((ignore, ind) => {
    var input = 5 - (10 * ind / n)
    return {
      inputs: [input],
      outputs: [Math.sin(input)]
    }
  })
}

function makeTrainingData (n) {
  return Array(n).fill(0).reduce((memo, ignore, indA) => {
    var results = Array(n).fill(0).map((ignore, indB) => {
      return {
        inputs: [indA, indB],
        outputs: [indA + indB, indA - indB]
      }
    })
    return memo.concat(results)
  }, [])
}

function makeTrainingData2 (n) {
  return Array(n).fill(0).reduce((memo, ignore, indA) => {
    indA -= (n / 2)
    var results = Array(n).fill(0).map((ignore, indB) => {
      indB -= (n / 2)
      return {
        inputs: [indA, indB],
        outputs: [(indA > 0) * 1, (indB < 0) * 1]
      }
    })
    return memo.concat(results)
  }, [])
}
