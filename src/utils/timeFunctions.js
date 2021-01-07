export function nowUnix () {
    return +(new Date().getTime() / 1000).toFixed(0)
}

export function getUnixDate (date) {
    return +(new Date(date).getTime() / 1000).toFixed(0)
}
