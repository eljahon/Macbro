export default function numberToPrice (number) {
    return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} сум`
}
