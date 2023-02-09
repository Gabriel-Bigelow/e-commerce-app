const supabase = require('./database.js');



// Returns all orders
const getOrders = async (req, res, next) => {
    const { data, error, status } = await supabase.rpc('get_all_orders');

    if (error) {
        return res.status(status).send(error);
    }
    
    if (data.length > 0) {
        res.status(status).send(data);
    }
}

// Returns all orders by the user, and the products associated with those orders.
const getAllOrdersForUser = async (req, res, next) => {
    if (!req.user) return res.status(401).send('User not logged in.');

    const userId = req.user.id;
    const { data, error, status } = await supabase.rpc('get_user_orders', { userid: userId });

    if (error) {
        res.status(status).send(error);
    }

    if (data.length > 0) {
        res.status(status).send(data);
    } else {
        res.status(404).send('No orders found.');
    }
};

// Returns an order specified by orderId, and the products associated with that order.
const getOrderProductsById = async (req, res, next) => {
    const { orderId } = req.params;

    const { data, error, status } = await supabase.rpc('get_order_products', { orderid: orderId });

    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        res.locals.orderProducts = data;
        next();
    } else {
        return res.status(404).send('Order not found.');
    }
};

const getOrderTotalById = async (req, res, next) => {
    const { orderId } = req.params;

    const { data, error, status } = await supabase.rpc('get_order_total', { orderid: orderId });

    if (error) return res.status(status).send(error);

    if (data.length > 0) {
        res.locals.orderTotal = data[0];
        res.status(status).send(res.locals);
    } else {
        res.status(404).send('Order not found.');
    }
}

// May be useful for canceling an order, but this should probably end up being deleted.
const deleteOrderById = async (req, res, next) => {
    const { orderId } = req.body;

    await supabase.from('order_products')
    .delete()
    .eq('order_id', orderId);

    const { data, error, status } = await supabase.from('orders')
    .delete()
    .eq('id', orderId);

    if (error) res.status(status).send(error);

    if (data.length > 0) {
        res.status(status).send(data[0]);
    } else {
        res.status('404').send('Order not found.')
    }
}

module.exports = {
    getOrders,
    getAllOrdersForUser,
    getOrderProductsById,
    getOrderTotalById,
    deleteOrderById
}