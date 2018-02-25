function getFunctionName (i) {
  try {
    let stack = new Error().stack
    stack = stack.replace(/^Error\n/, '')   // for chrome
    let line = stack.split('\n')[i].replace(/\s+at /, '')
    return line.replace(/[^\w.-].*/g, '')
  } catch (err) {
    return ''
  }
}

function formatMsg (args) {
  let fmt = args[0]
  let values = Array.prototype.slice.call(args, 1)
  const func = getFunctionName(3)

  function pad (num, digits) {
    return ('0000000' + num).slice(-digits)
  }

  function formatDate (date) {
    let hour = pad(date.getHours(), 2)
    let minute = pad(date.getMinutes(), 2)
    let second = pad(date.getSeconds(), 2)
    let ms = pad(date.getMilliseconds(), 3)
    return `[${hour}:${minute}:${second}.${ms}] [${func}] `
  }

  return [formatDate(new Date()) + fmt].concat(values)
}

const log = {
  info: function () {
    console.log.apply(console, formatMsg(arguments))
  },
  error: function () {
    console.error.apply(console, formatMsg(arguments))
  }
}

module.exports = log
