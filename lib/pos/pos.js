function analysisBarcodes(tests) {
    return tests.map(barcode => {
        let Itembarcode = barcode.split('-');
        let count = Itembarcode.length > 1 ? parseFloat(Itembarcode[1]) : 1;
        return {barcode: Itembarcode[0], count: count}
    });
}

module.exports = analysisBarcodes;