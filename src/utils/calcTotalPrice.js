export default function calcTotalPrice (arrayOfItems) {
    return arrayOfItems ? arrayOfItems.reduce((total, currentItem) => {
        total += currentItem.quantity * currentItem.price
        return total
    }, 0) : 0
}
