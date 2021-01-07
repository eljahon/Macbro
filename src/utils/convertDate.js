export default function convertDate (str) {
    var date = new Date(str)

    var year = date.getFullYear()
    var month = (date.getMonth() + 1)
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return formateTime(year, month, day, hour, minute, second)
  }

  function formateTime (year, month, day, hour, minute, second) {
    return makeDoubleDigit(year) + '-' +
           makeDoubleDigit(month) + '-' +
           makeDoubleDigit(day) + ' ' +
           makeDoubleDigit(hour) + ':' +
           makeDoubleDigit(minute) + ':' +
           makeDoubleDigit(second)
  }

  function makeDoubleDigit (x) {
    return (x < 10) ? '0' + x : x
  }
