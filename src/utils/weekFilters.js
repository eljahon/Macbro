import { nowUnix, getUnixDate } from './timeFunctions'

export const daysInMonth = (month, year) => {
    // returns number of days in a month
    const date = new Date()
    var d = new Date(year || date.getFullYear(), month || date.getMonth() + 1, 0)
    return d.getDate()
}
export function filterLastWeekOrders (arr) {
    return arr && arr.filter(item => {
      const weekInSeconds = 7 * 24 * 60 * 60
      const now = nowUnix()
      const createdTime = getUnixDate(item.created_at)
      return now - weekInSeconds < createdTime && item
    })
}
export function getChartLabels (arr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[new Date(arr[0].created_at).getMonth()] // Jan - Dec
    const lastMonth = months[new Date(arr[0].created_at).getMonth() - 1] // Jan - Dec
    const allDates = []
    const today = new Date().getDate() // 1-31
    const thisMonth = new Date().getMonth()
    for (let i = 0; i < 7; i++) {
        if (today - i <= 0) {
            const monthLength = daysInMonth(thisMonth - 1) // returns number of days in a month
            const day = monthLength - (i - today)
            allDates.push(`${day} ${lastMonth}`)
        } else {
            allDates.push(`${today - i} ${month}`)
        }
    }
    return allDates.reverse()
}
export function getDiffDate (today, firstDate) {
    const date1 = new Date(today)
    const date2 = new Date(firstDate)
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    console.log(diffDays + ' days')
    return diffDays
}
export function getInterval (arr) {
    const today = new Date()
    const firstDate = new Date(arr[arr.length - 1].created_at)
    return getDiffDate(today, firstDate)
}
export function getSumOfOrders (orders) {
    if (orders.length) {
        return orders.reduce((acc, order) => {
            if (order.items) {
                const sumOfOrder = order.items.reduce((acc, item) => {
                    acc += item.price * item.quantity
                    return acc
                }, 0)
                acc += sumOfOrder
                return acc
            } else {
                return 0
            }
        }, 0)
    } else {
        return 0
    }
}
export function calcSumOfOrder (orderItems) {
    // orderItems: []
    if (orderItems) {
        return orderItems.reduce((acc, item) => {
            acc += item.quantity * item.price
            return acc
        }, 0)
    } else {
        return 0
    }
}
export function getSumChartData (orders) {
    const labels = getChartLabels(orders)
    const byDay = {}
    console.log('byDay1', byDay)
    labels.forEach(label => {
        const day = Number(label.split(' ')[0])
        byDay[` ${day}`] = 0
    })
    orders && orders.forEach(order => {
        const itemDay = new Date(order.created_at).getDate() // 1-31
        byDay[` ${itemDay}`] ? byDay[` ${itemDay}`] += calcSumOfOrder(order.items) : byDay[` ${itemDay}`] = 1
    })
    console.log('byDay2', byDay)
    const res = Object.values(byDay).slice(-7)
    console.log('res', res)
    return res
}
export function getChartData (arr) {
    const labels = getChartLabels(arr)
    const byDay = {}
    console.log('byDay1', byDay)
    labels.forEach(label => {
        const day = Number(label.split(' ')[0])
        byDay[` ${day}`] = 0
    })
    arr && arr.forEach(item => {
        const itemDay = new Date(item.created_at).getDate() // 1-31
        byDay[` ${itemDay}`] ? byDay[` ${itemDay}`]++ : byDay[` ${itemDay}`] = 1
    })
    return Object.values(byDay)
}
export function getClientChartData (arr) {
    const labels = getChartLabels(arr)
    const byDay = {}
    console.log('byDay1', byDay)
    labels.forEach(label => {
        const day = Number(label.split(' ')[0])
        byDay[` ${day}`] = 0
    })
    arr && arr.forEach(item => {
        const itemDay = new Date(item.created_at).getDate() // 1-31
        byDay[` ${itemDay}`] ? byDay[` ${itemDay}`]++ : byDay[` ${itemDay}`] = 1
    })
    return Object.values(byDay)
}
