
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

    it('should return cartItemPromotion info when item has promotion info', function() {
        let cartItemsPromtion = Pos.getCartItemsPromotion([
            {barcode: 'ITEM000001', name: '雪碧', unit: '瓶', price: 3.00, count: 7}
        ])
        expect(cartItemsPromtion).toEqual([
            {name: '雪碧', unit: '瓶', price: 3.00, count: 7, promotion: 'BUY_TWO_GET_ONE_FREE'}
        ])
    })

    it('should return cartItem promotion info when item without promotion info', function() {
        let cartItemsPromtion = Pos.getCartItemsPromotion([
            {barcode: 'ITEM000002', name: '苹果', unit: '斤', price: 5.50, count: 7}
        ])
        expect(cartItemsPromtion).toEqual([
            {name: '苹果', unit: '斤', price: 5.50, count: 7, promotion: ''}
        ])
    })

    it('should return Receipt object when item has promotion', function() {
        let receipt = Pos.calItemsPrice([
            {name: '雪碧', unit: '瓶', price: 3.00, count: 7, promotion: 'BUY_TWO_GET_ONE_FREE'}
        ]);
        expect(receipt).toEqual({
            save: 3,
            price: 18,
            receipt: [{name: '雪碧', unit: '瓶', price: 3.00, count: 7, save: 3, sum: 18}]
        })
    })


    it('should return Receipt String', function() {
       const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        let dateDigitToString = num => (num < 10 ? `0${num}` : num);

        Pos.printReceipt(tags);

        const currentDate = new Date(),
        year = dateDigitToString(currentDate.getFullYear()),
        month = dateDigitToString(currentDate.getMonth() + 1),
        date = dateDigitToString(currentDate.getDate()),
        hour = dateDigitToString(currentDate.getHours()),
        minute = dateDigitToString(currentDate.getMinutes()),
        second = dateDigitToString(currentDate.getSeconds()),
        formattedDateString = `${year}年${month}月${date}日 ${hour}:${minute}:${second}`;

        const expectText = `***<没钱赚商店>收据***
打印时间：${formattedDateString}
----------------------
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
    });
});