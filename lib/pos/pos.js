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

function getCartItemsPromotion(cartItems) {
    const promotions = fixtures.loadPromotions();
    return cartItems.map(item => {
        const promotionType = getPromotionType(item, promotions);
        return {name: item.name, unit: item.unit, price: item.price, count: item.count, promotion: promotionType}
    })
}

function getPromotionType(cartItem, promotions) {
    for(const promotion of promotions) {
        if(promotion.barcodes.indexOf(cartItem.barcode) !== -1){
            return promotion.type;
        }
    }
    return '';
}
module.exports = {analysisBarcodes, countBarcodes, getCartItems, getCartItemsPromotion};