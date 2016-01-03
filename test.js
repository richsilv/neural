var Neural = require('./neural')
var Matrix = require('./matrix')

var network = new Neural.Network({ layers: [3, 3, 2] })
var rawTrainingData = makeTrainingData(3)
network.calc()
console.log('Sum-squared error', network.sumSqError(rawTrainingData[2]))
console.log('Backpropagate', network.backpropagate())

var trainingData = new Neural.TrainingData(rawTrainingData)

module.exports = {
  Neural,
  network,
  makeTrainingData
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
