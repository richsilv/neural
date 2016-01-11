var Neural = require('./neural')

var network = new Neural.Network({ layers: [1, 3, 3, 1], alpha: 0.1, lambda: 0 })
// var rawTrainingData = [{inputs: [0, 2], outputs: [0.5]}, {inputs: [1, 1], outputs: [0.2]}, {inputs: [5, 0], outputs: [0.7]}]
var rawTrainingData = makeTrainingDataSin(100)
network.randomizeWeights(1)
network.invalidate()
network.calc()
// console.log('Sum-squared error', network.sumSqError(rawTrainingData[0]))
// console.log('Backpropagate', network.backpropagate())
// console.log('Ids', network.getIds())

var trainingData = new Neural.TrainingData(rawTrainingData)
var stats = network.train(trainingData, 1000, { alpha: 1, lambda: 0.0001, dynamicAlpha: true })
console.log('Min error', stats.minError)
console.log('Final alpha', stats.alpha)

module.exports = {
  Neural,
  network,
  makeTrainingData
}

function makeTrainingDataSin (n) {
  return Array(n).fill(0).map((ignore, ind) => {
    var input = 1.5 * ind / n
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
