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

module.exports = {analysisBarcodes, countBarcodes};