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

function calItemsPrice(cartItemPromotion) {
    let itemsReceipt = [];
    for(const item of cartItemPromotion) {
        const itemReceipt = calItemPrice(item);
        itemsReceipt.push(itemReceipt);
    }
    let save = calcuSave(itemsReceipt);
    let price = calcuPrice(itemsReceipt);

    return {
        save: save,
        price: price,
        receipt: itemsReceipt
    };
}

function calItemPrice(cartItem) {
    let save = 0;
    let price = 0;
    if(cartItem.count > 2 && cartItem.promotion === 'BUY_TWO_GET_ONE_FREE') {
        price = (cartItem.count - 1) * cartItem.price;
        save = cartItem.price;
    } else {
        price = cartItem.count * cartItem.price;
        save = 0;
    }
    return {
        name: cartItem.name, 
        unit: cartItem.unit,
        price: cartItem.price,
        count: cartItem.count,
        save: save,
        price: price
    };
}

function calcuSave(itemsReceipt) {
    let save = 0;
    for(const receipt of itemsReceipt) {
        save += receipt.save;
    }
    return save;

}

function calcuPrice(itemsReceipt) {
    let price = 0;
    for(const receipt of itemsReceipt) {
        price += receipt.price;
    }
    return price;
}
module.exports = {analysisBarcodes, countBarcodes, getCartItems, getCartItemsPromotion, calItemsPrice};