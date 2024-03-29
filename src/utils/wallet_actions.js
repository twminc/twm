export async function send_tokens(wallet, address, amount, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    console.log(`mixi ${mixi}`);
    console.log(`address ${address}`);
    console.log(`amount ${amount}`);
    let amount2 = amount * 10000000000;
    wallet.createTransaction({
        address: address,
        amount: amount2.toString(),
        tx_type: '1', //token transaction
        mixin: mixi
    }, callback);
}

export async function send_cash(wallet, address, amount, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    let amount2 = amount * 10000000000;
    wallet.createTransaction({
        address: address,
        amount: amount2.toString(),
        mixin: mixi
    }, callback);
}

export async function stake_tokens(wallet, amount, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    let amount2 = amount * 10000000000;
    wallet.createAdvancedTransaction({
        tx_type: '3', //stake token transaction
        address: wallet.address(),
        amount: amount2.toString(),
        mixin: mixi
    }, callback);
}

export async function create_offer(wallet, username, title, price, quantity, description, peg_used, price_peg_id, min_sfx_price, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    console.log(`peg used ${peg_used}`)
    console.log(`peg id ${price_peg_id}`)
    console.log(`min price id ${min_sfx_price}`)
    let price2;
    let minprice2 = 0;
    let pegid = '';
    if (peg_used != true) {
        price2 = price * 10000000000;
    } else {
        price2 = price * 10000000000;
        minprice2 = min_sfx_price * 10000000000;
        pegid = price_peg_id;
    }
    wallet.createAdvancedTransaction({
        tx_type: '8', //create offer transaction
        safex_username: username,
        safex_offer_title: title,
        safex_offer_price: price2.toString(),
        safex_offer_quantity: quantity,
        safex_offer_description: description,
        safex_offer_price_peg_id: pegid,
        safex_offer_price_peg_used: peg_used,
        safex_offer_min_sfx_price: minprice2.toString(),
        mixin: mixi
    }, callback);
}

export async function unstake_tokens(wallet, amount, block_height, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    let amount2 = amount * 10000000000;
    wallet.createAdvancedTransaction({
        tx_type: '4', //unstake tokens transaction
        address: wallet.address(),
        amount: amount2.toString(),
        safex_staked_token_height: block_height,
        mixin: mixi
    }, callback);
}

export async function purchase_offer(wallet, cost, offer_id, quantity, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    console.log(mixin);
    let amount2 = cost * 10000000000;
    console.log(wallet.address());
    console.log(cost);
    console.log(offer_id);
    console.log(quantity);
    console.log(mixi);
    wallet.createAdvancedTransaction({
        tx_type: '5', //purchase offer transaction
        address: wallet.address(),
        amount: amount2.toString(),
        safex_offer_id: offer_id,
        safex_purchase_quantity: quantity,
        mixin: mixi
    }, callback);
}

export async function edit_offer(wallet, offerid, username, offer_title, price, offer_quantity, offer_description, peg_used, price_peg_id, min_sfx_price, active, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    let price2;
    console.log(`peg used ${peg_used}`)
    console.log(`peg id ${price_peg_id}`)
    console.log(`min price id ${min_sfx_price}`)
    let minprice2 = 0;
    let pegid = '';
    if (peg_used != true) {
        price2 = price * 10000000000;
    } else {
        price2 = price * 10000000000;
        minprice2 = min_sfx_price * 10000000000;
        pegid = price_peg_id;
    }
    wallet.createAdvancedTransaction({
        tx_type: '9', //edit offer transaction
        safex_offer_id: offerid,
        safex_username: username,
        safex_offer_title: offer_title,
        safex_offer_price: price2.toString(),
        safex_offer_quantity: offer_quantity,
        safex_offer_description: offer_description,
        safex_offer_active: active,
        safex_offer_price_peg_id: pegid,
        safex_offer_price_peg_used: peg_used,
        safex_offer_min_sfx_price: minprice2.toString(),
        mixin: mixi
    }, callback);
}

export async function edit_account(wallet, username, data, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    wallet.createAdvancedTransaction({
        tx_type: '7', //edit account transaction
        safex_username: username,
        safex_data: data,
        mixin: mixi
    }, callback);
}

export async function create_account(wallet, username, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    wallet.createAdvancedTransaction({
        tx_type: '6', //create account transaction
        safex_username: username,
        mixin: mixi
    }, callback);
}

export async function create_price_oracle(wallet, title, creator, description, currency, rate, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    wallet.createAdvancedTransaction({
        tx_type: '11', //create price oracle transaction
        address: wallet.address(),
        amount: 0,
        safex_price_peg_title: title,
        safex_price_peg_creator: creator,
        safex_price_peg_description: description,
        safex_price_peg_currency: currency,
        safex_price_peg_rate: rate,
        mixin: mixi
    }, callback);
}

export async function update_price_oracle(wallet, title, creator, description, currency, rate, mixin, callback) {
    let mixi = mixin >= 0 ? mixin : 6;
    wallet.createAdvancedTransaction({
        tx_type: '12', //update price oracle transaction
        address: wallet.address(),
        amount: 0,
        safex_price_peg_title: title,
        safex_price_peg_creator: creator,
        safex_price_peg_description: description,
        safex_price_peg_currency: currency,
        safex_price_peg_rate: rate,
        mixin: mixi
    }, callback);
}
