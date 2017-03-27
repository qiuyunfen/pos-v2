describe('pos', function() {

    let analysisBarcode = require('../../lib/pos/pos');

    it('should return object 1 when barcodes no count', function() {
        let aBarcodes = analysisBarcode(['ITEM000001']);
        expect(aBarcodes).toEqual([
            {barcode: 'ITEM000001', count: 1}
        ]);
    })

    it('should return object 1 when barcodes has count', function() {
        let aBarcodes = analysisBarcode(['ITEM000001-3']);
        expect(aBarcodes).toEqual([
            {barcode: 'ITEM000001', count: 3}
        ])
    })
});