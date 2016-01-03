Neural = require('./neural')

makeTrainingData = function (n) {
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
