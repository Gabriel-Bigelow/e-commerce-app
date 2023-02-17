const supabase = require('./database.js');



// add a product to the products table portion of the database and mark it as active and ready to be sold
const createProduct = async (req, res, next) => {
    const { name, price, stock } = req.body;

    const { data, error, status } = await supabase.from('products')
    .insert([ {name:name, price:price, stock:stock } ])
    .select('*');

    if (data) {
        res.status(status).send(data[0]);
    } else {
        res.status(status).send(error);
    }
};

// returns all rows from the products table
const getProducts = async (req, res, next) => {
    const { data, error } = await supabase.from('products')
    .select()
    .eq('active', true)
    .order('id');

    if (data.length > 0) {
        res.status(200).send(data);
    } else {
        res.status(500).send(error)
    }
};

// returns the row from the products table whose id matches productId
const getProductById = async (req, res, next) => {
    const { productId } = req.params;

    const { data, error } = await supabase.from('products')
    .select()
    .eq('id', productId);

    if (data.length > 0) {
        res.status(200).send(data[0]);
    } else {
        res.status(404).send('Product not found.');
    }
}

// if a stock is updated, updates the current row
// if name or price changes, a new item will be created and the changed values will replace the old values, otherwise all values are copied and a new id is given to the product. (Maintains database integrity
// by not making changes to past orders or cart items)
const updateProduct = async (req, res, next) => {
    const { productId, name, price, stock } = req.body;
    
    let response;
    
    const values = {
        name: name,
        price: price,
        stock: stock
    };

    if (values.price || values.name) {
        const oldProduct = await supabase.from('products')
        .update( {stock: 0, active: false})
        .eq('id', productId)
        .select('*');

        const newProduct = await supabase.from('products')
        .insert([{
           price: values.price ? values.price : await oldProduct.data[0].price,
           name: values.name ? values.name : await oldProduct.data[0].name,
           stock: values.stock ? values.stock : await oldProduct.data[0].stock
        }])
        .select('*');

        response = newProduct;
    } else {
        const updatedProduct = await supabase.from('products')
        .update(values)
        .eq('id', productId)
        .select('*');

        response = updatedProduct;
    }

    const { data, error, status } = response;
    
    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        return res.status(status).send(data[0]);
    } else {
        return res.status(404).send('Item not found.');
    }
}

// reactivate discontinued item
const activateProduct = async (req, res, next) => {
    const { productId } = req.body;

    const { data, status } = await supabase.from('products')
    .update({ active: true })
    .eq('id', productId)
    .select('*');
    
    if (data.length > 0) {
        res.status(status).send(data[0]);
    } else {
        res.status(404).send('Product not found.');
    }
}

// deactivate discontinued item
const deactivateProduct = async (req, res, next) => {
    const { productId } = req.body;

    const { data, status } = await supabase.from('products')
    .update({ active: false })
    .eq('id', productId)
    .select('*');

    if (data.length > 0) {
        res.status(status).send(data[0]);
    } else {
        res.status(404).send('Product not found.');
    }
}

//Add or update a product type in a user's using the productId and quantity property from the request, if the requested quantity is lower or equal to the amount of available stock
const addProductToCart = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    
    const userId = req.user.id;
    const { quantity } = req.body;
    const { productId } = req.params;
    const { product } = res.locals;

    if (!quantity) return res.status(400).send('Item quantity not specified.');

    const userCart = await supabase.from('carts')
    .select(`
        id,
        user_id,
        cart_products(product_id, quantity)
    `)
    .eq('user_id', userId);

    let updatedCart;

    if (quantity <= product.stock) {
        if (userCart.data[0].cart_products.some(product => product.product_id == productId)) {
            updatedCart = await supabase.from('cart_products')
            .update({quantity: quantity})
            .eq('product_id', productId)
            .eq('cart_id', userCart.data[0].user_id)
            .select('product_id, quantity');
        } else {
            updatedCart = await supabase.from('cart_products')
            .insert([{cart_id: userCart.data[0].id, product_id: productId, quantity: quantity}])
            .select('product_id, quantity');
        }
        return res.status(updatedCart.status).send(updatedCart.data[0]);
    } else {
        return res.status(403).send('There are not enough items in stock to add that many to your cart.')
    }    
}


// Checks to make sure a single product is in stock before adding it to a user's cart. This will prevent most errant orders where a user tries to buy more items than are available.
const checkSingleProductStock = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');
    const { productId } = req.params;

    const { data, error, status } = await supabase.from('products')
    .select()
    .eq('id', productId);

    if (data.length > 0) {
        res.locals.product = data[0];
        return next();
    } else {
        return res.status(404).send('Product not found.');
    }
};



module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    activateProduct,
    deactivateProduct,
    addProductToCart,
    checkSingleProductStock
}