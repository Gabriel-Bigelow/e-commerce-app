const supabase = require('./database.js');



//gets the total of each set of items and returns the total price of each set of items
const getCartProducts = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const userId = req.user.id;

    const { data, error, status } = await supabase.rpc('get_cart_products', { userid: userId });

    if (error) return res.status(status).send(error);

    if (data.length > 0) {    
        res.locals.cartProducts = data;
        next();
    } else {
        return res.status(status).send({cartProducts: 'Cart is empty.'});
    }

};

//gets the total number of items in the cart and the total price of the cart
const getCartTotal = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const userId = req.user.id;

    const { data, error, status } = await supabase.rpc('get_cart_total', {userid: userId });
    
    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        res.locals.cartTotal = data[0];
        res.status(status).send(res.locals);
    } else {
        return res.status(status).send('Cart is empty.');
    }
};

//removes a product from the cart
const removeProductFromCart = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const { productId } = req.params;
    const userId = req.user.id;

    const { data, error, status } = await supabase.rpc('remove_product_from_cart', { userid: userId, productid: productId });

    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        res.status(status).send(data[0]);
    } else {
        res.status(404).send('Product not found in cart.')
    }
}

// Checks to make sure all products in the cart are in sufficient stock to create an order.
const checkCartProductsStock = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const userId = req.user.id;

    const { data, error, status } = await supabase.rpc('check_cart_products_stock', { userid: userId});

    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        data.every(product => product.quantity <= product.stock)
        if (data.every(product => product.quantity <= product.stock)) {
            return next();
        }
    } else {
        res.status(403).send('There are no items in the cart.');
    }
}

// Creates an order entry attached to the current user and transfers the items from the associated entries on the cart_products table to the associated order on the order_products table
const checkoutCart = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const userId = req.user.id;

    const { data, error, status } = await supabase.rpc('checkout_cart', { userid: userId });

    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        res.locals.newOrder = data;
        next();
    } else {
        res.status(403).send('Cart is empty.');
    }
};

// updates the stock of each product in the products table after successful checkout
const updateStock = async (req, res, next) => {
    const { newOrder } = res.locals;

    newOrder.forEach(async product => await supabase.rpc('checkout_update_stock', { productid: parseInt(product.product_id), quantity: parseInt(product.quantity)}));

    res.status(201).send(newOrder);
};


module.exports = {
    getCartProducts,
    getCartTotal,
    removeProductFromCart,
    checkCartProductsStock,
    checkoutCart,
    updateStock
};