var neural = require('./neural')
var fs = require('fs')
// var sizeof = require('./sizeof')

var network = new neural.Network({ layers: [1, 5, 5, 1], alpha: 0.1, lambda: 0, transfer: neural.transferFunctions.rectifier })
network.outputLayer().setTransfer(neural.transferFunctions.linear)
// var rawTrainingData = [{inputs: [0, 2], outputs: [0.5, 1.1]}, {inputs: [1, 1], outputs: [0.2, 0.5]}, {inputs: [5, 0], outputs: [0.7, 1]}]
var rawTrainingData = makeTrainingDataSin(100)
// console.log('Sum-squared error', network.sumSqError(rawTrainingData[0]))
// console.log('Backpropagate', network.backPropagate())
// console.log('Ids', network.getIds())

// var weightsFile = 'weights.json'
var trainingData = new neural.TrainingData(rawTrainingData)
var trainer = neural.trainer(network, trainingData, {
  alpha: 0.1,
  lambda: 0.0001,
  progressiveAlpha: { creep: 1.01, reversal: 0.9, floor: 0.01 },
})
new Array(10000).fill(0).forEach(() => {
  var res = trainer.next().value
  console.log(`Epoch: ${res.epoch}, error: ${res.error}, alpha: ${res.alpha}`)
})

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

// var trainerArray = Array(1).fill(0).map(() => {
//   var network = new neural.Network({ layers: [2, 5, 5, 2], alpha: 0.1, lambda: 0, transfer: neural.transferFunctions.rectifier })
//   network.outputLayer().setTransfer(neural.transferFunctions.linear)
//   return new neural.Trainer(network, trainingData, {
//     randomize: true,
//     alpha: 0.5,
//     lambda: 0.01,
//     progressiveAlpha: {
//       creep: 1.01,
//       reversal: 0.9
//     },
//     threshold: 0.05
//   })
// })
// for (var i = 1; i < 10; i++) {
//   console.log(trainerArray[0].gen.next())
// }

// var results = neural.race(trainerArray, { 10: 5, 25: 3, 100: 2, 250: 1 }, { maxEpochs: 100 })

// console.log(results)

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
