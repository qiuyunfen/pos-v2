function analysisBarcodes(tests) {
    let barcodes = [];
    for(let barcode of tests) {
        barcodes.push({
            barcode: barcode,
            count: 1
        });
    }
    return barcodes;
    //return [{barcode: tests[0], count: 1}];
}

module.exports = analysisBarcodes;