function analysisBarcodes(tests) {
    let barcodes = [];
    for(let barcode of tests) {
        let Itembarcode = barcode.split('-');
        let count = Itembarcode.length > 1 ? parseFloat(Itembarcode[1]) : 1;
        barcodes.push({
            barcode: Itembarcode[0],
            count: count
        });
    }
    return barcodes;
}

module.exports = analysisBarcodes;