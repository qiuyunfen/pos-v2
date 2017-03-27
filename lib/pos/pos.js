const fixtures = require('./fixtures');

function analysisBarcodes(tests) {
    return tests.map(barcode => {
        let Itembarcode = barcode.split('-');
        let count = Itembarcode.length > 1 ? parseFloat(Itembarcode[1]) : 1;
        return {barcode: Itembarcode[0], count: count}
    });
}

function countBarcodes(barcodes) {
    let cartBarcodes = [];
    for(let barcode of barcodes) {
        let item = findItem(barcode, cartBarcodes);
        if(item !== null) {
            item.count += barcode.count;
        } else {
            cartBarcodes.push({barcode: barcode.barcode, count: barcode.count});
        }
    }
    return cartBarcodes;
}

function findItem(barcode, cartBarcodes) {
    for(let item of cartBarcodes) {
        if(barcode.barcode === item.barcode)return item;
    }
    return null;
}

function getCartItems(cartBarcodes) {
    let cartItems = [];
    const allItems = fixtures.loadAllItems();
    for(const item of allItems) {
        for(const t of cartBarcodes) {
            if(item.barcode === t.barcode) {
                cartItems.push({
                    barcode: item.barcode,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    count: t.count
                })
                break;
            }
        }
    }
    return cartItems;
}
module.exports = {analysisBarcodes, countBarcodes, getCartItems};