function mult (M, N) {
  M = matrify(M)
  N = matrify(N)
  var sizeM = size(M)
  var sizeN = size(N)
  var c = sizeN[1]
  var w = sizeN[0]
  var h = sizeM[1]
  if (c !== sizeM[0]) throw new Error(`Cannot multiply [${sizeM[0]} x ${h}] with [${w} x ${c}] matrices`)
  var result = zeros(w, h)
  var x, y, z
  for (x = 0; x < w; x += 1) {
    for (y = 0; y < h; y += 1) {
      for (z = 0; z < c; z += 1) {
        result[y][x] += (M[y][z] * N[z][x])
      }
    }
  }
  return flatten(result)
}

function add (M, N) {
  M = matrify(M)
  N = matrify(N)
  var sizeM = size(M)
  var sizeN = size(N)
  if (sizeM[0] !== sizeN[0] || sizeM[1] !== sizeN[0]) throw new Error(`Cannot add ${sizeM} and ${sizeN} matrices`)
  return M.map((row, y) => {
    return row.map((el, x) => {
      return el + N[y][x]
    })
  })
}

function subtract (M, N) {
  M = matrify(M)
  N = matrify(N)
  var sizeM = size(M)
  var sizeN = size(N)
  if (sizeM[0] !== sizeN[0] || sizeM[1] !== sizeN[0]) throw new Error(`Cannot subtract ${sizeN} from ${sizeM} matrices`)
  return M.map((row, y) => {
    return row.map((el, x) => {
      return el - N[y][x]
    })
  })
}

function scalar (M, s) {
  M = matrify(M)
  return M.map(row => {
    return row.map(el => {
      return el * s
    })
  })
}

function transpose (M) {
  M = matrify(M)
  var sizeM = size(M)
  var w = sizeM[1]
  var h = sizeM[0]
  var result = zeros(w, h)
  var x, y
  for (x = 0; x < w; x += 1) {
    for (y = 0; y < h; y += 1) {
      result[y][x] = M[x][y]
    }
  }
  return result
}

function zeros (x, y) {
  if (typeof y !== 'number') return Array(x).fill(0)
  var mat = Array(Math.max(y, 1)).fill(0)
  return mat.map(() => {
    return Array(x).fill(0)
  })
}

function matrify (M) {
  if (!(M instanceof Array)) return (typeof M === 'undefined') ? [[]] : [[M]]
  if (!M.length) return [M]
  if (M.some(row => !(row instanceof Array))) return [M]
  return M
}

function flatten (M) {
  if (M instanceof Array && M.length === 1) {
    if (M[0] instanceof Array && M[0].length === 1) return M[0][0]
    return M[0]
  }
  return M
}

function invoke (M) {
  M = matrify(M)
  return M.map(v => {
    return v.map(val => {
      if (val.calc) return val.calc()
      if (typeof val === 'function') return val.call()
      return val
    })
  })
}

function size (M) {
  if (!M) return [0, 0]
  if (!(M instanceof Array)) return [1, 1]
  if (!M[0].length) return [0, 0]
  if (!(M[0] instanceof Array)) return [M.length, 1]
  return [M[0].length, M.length]
}

module.exports = {
  size,
  mult,
  add,
  subtract,
  scalar,
  zeros,
  matrify,
  flatten,
  transpose,
  invoke
}
