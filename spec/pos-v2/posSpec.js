describe('pos', function() {

    let Pos = require('../../lib/pos/pos');

    it('should return object 1 when barcodes no count', function() {
        let aBarcodes = Pos.analysisBarcodes(['ITEM000001']);
        expect(aBarcodes).toEqual([
            {barcode: 'ITEM000001', count: 1}
        ]);
    })

    it('should return object 1 when barcodes has count', function() {
        let aBarcodes = Pos.analysisBarcodes(['ITEM000001-3']);
        expect(aBarcodes).toEqual([
            {barcode: 'ITEM000001', count: 3}
        ])
    })

    it('shoule return object with count when barcodes no count', function() {
        let barcodes = Pos.countBarcodes([
            {barcode: 'ITEM000001', count: 1},
            {barcode: 'ITEM000001', count: 1}
        ]);
        expect(barcodes).toEqual([
            {barcode: 'ITEM000001', count: 2}
        ]);
    })

    it('should return object with count when barcodes has count', function() {
        let barcodes = Pos.countBarcodes([
            {barcode: 'ITEM000001', count: 3},
            {barcode: 'ITEM000001', count: 4}
        ]);
        expect(barcodes).toEqual([
            {barcode: 'ITEM000001', count: 7}
        ])
    })

    it('shoule return cartItem info', function() {
        let cartItems = Pos.getCartItems([
            {barcode: 'ITEM000001', count: 7}
        ]);
        expect(cartItems).toEqual([
            {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 7}
        ])
    });

    it('should return cartItemPromotion info', function() {
        let cartItemsPromtion = Pos.getCartItemsPromotion([
            {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 7}
        ])
        expect(cartItemsPromtion).toEqual([
            {name: '雪碧', unit: '瓶', price: 3.00, count: 7, promotion: 'BUY_TWO_GET_ONE_FREE'}
        ])
    })

    it('should return Receipt object', function() {
        let receipt = Pos.calItemsPrice([
            {name: '雪碧', unit: '瓶', price: 3.00, count: 7, promotion: 'BUY_TWO_GET_ONE_FREE'}
        ]);
        expect(receipt).toEqual({
            save: 3,
            price: 18,
            receipt: [{name: '雪碧', unit: '瓶', price: 3.00, count: 7, save: 3, price: 18}]
        })
    })
});