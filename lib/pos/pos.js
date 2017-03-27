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
    let sum = 0;
    if(cartItem.count > 2 && cartItem.promotion === 'BUY_TWO_GET_ONE_FREE') {
        sum = (cartItem.count - 1) * cartItem.price;
        save = cartItem.price;
    } else {
        sum = cartItem.count * cartItem.price;
        save = 0;
    }
    return {
        name: cartItem.name, 
        unit: cartItem.unit,
        price: cartItem.price,
        count: cartItem.count,
        save: save,
        sum: sum
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
        price += receipt.sum; 
    }
    return price;
}

function printStr(receipt) {
    const dateDigitToString = num => (num < 10 ? `0${num}` : num);
    const currentDate = new Date(),
      year = dateDigitToString(currentDate.getFullYear()),
      month = dateDigitToString(currentDate.getMonth() + 1),
      date = dateDigitToString(currentDate.getDate()),
      hour = dateDigitToString(currentDate.getHours()),
      minute = dateDigitToString(currentDate.getMinutes()),
      second = dateDigitToString(currentDate.getSeconds()),
      formattedDateString = `${year}年${month}月${date}日 ${hour}:${minute}:${second}`;
    

    spyOn(console, 'log');

    let receiptStr = '***<没钱赚商店>收据***\n';
    receiptStr += '打印时间：'+ formattedDateString +'\n';
    receiptStr += '----------------------\n';
    for(const item of receipt.receipt) {
        receiptStr += '名称：' + item.name + '，';
        receiptStr += '数量：' + item.count + item.unit + '，';
        receiptStr += '单价：' + item.price.toFixed(2) + '(元)，';
        receiptStr += '小计：' + item.sum.toFixed(2) + '(元)\n';
    }
    receiptStr += '----------------------\n';
    receiptStr += '总计：'+ receipt.price.toFixed(2) + '(元)\n';
    receiptStr += '节省：'+ receipt.save.toFixed(2) + '(元)\n';
    receiptStr += '**********************';
    console.log(receiptStr);
}

function printReceipt(tags) {
    let barcodes = analysisBarcodes(tags);
    let cartBarcodes = countBarcodes(barcodes);
    let cartItems = getCartItems(cartBarcodes);
    let cartItemsPromotion = getCartItemsPromotion(cartItems);
    let receipt = calItemsPrice(cartItemsPromotion);
    printStr(receipt);
}
module.exports = {analysisBarcodes, countBarcodes, getCartItems, getCartItemsPromotion, calItemsPrice, calItemPrice, printReceipt};