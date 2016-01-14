var Neural = require('./neural')
var fs = require('fs')

var network = new Neural.Network({ layers: [2, 5, 8, 5, 2], alpha: 0.1, lambda: 0, transfer: Neural.transferFunctions.rectifier })
network.outputLayer().setTransfer(Neural.transferFunctions.linear)
// var rawTrainingData = [{inputs: [0, 2], outputs: [0.5]}, {inputs: [1, 1], outputs: [0.2]}, {inputs: [5, 0], outputs: [0.7]}]
var rawTrainingData = makeTrainingData(10)
network.randomizeWeights(1)
network.invalidate()
network.calc()
// console.log('Sum-squared error', network.sumSqError(rawTrainingData[0]))
// console.log('Backpropagate', network.backpropagate())
// console.log('Ids', network.getIds())

var weightsFile = 'weights.json'
var trainingData = new Neural.TrainingData(rawTrainingData)
// var dataRaw
// try {
//   dataRaw = fs.readFileSync(weightsFile)
// } catch (e) {}
// if (dataRaw) {
//   var data = JSON.parse(dataRaw)
//   network.setWeights(data.weights)
//   network.setAlpha(data.alpha)
// }

// var stats = network.train(trainingData, 1000, { lambda: 0.0001, dynamicAlpha: true })
// console.log('Min error', Math.pow(stats.minError / rawTrainingData.length, 0.5))
// console.log('Final alpha', stats.alpha)
// fs.writeFile(weightsFile, JSON.stringify({ weights: network.getWeights(), alpha: network.getAlpha() }), err => {
//   if (err) return console.error('Could not write weights', err.reason || err.error)
//   console.log(`Wrote weights to ${weightsFile}`)
// })

var trainer = new Neural.Trainer(network, trainingData, {
  randomize: true,
  alpha: 0.5,
  lambda: 0.01,
  progressiveAlpha: {
    creep: 1.01,
    reversal: 0.9
  }
})
console.log(trainer.gen.next())

module.exports = {
  Neural,
  network,
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
