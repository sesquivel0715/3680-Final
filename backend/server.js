//server.js uses express to build a backeend server in node.js

const express = require('express');
const cors = require('cors');
const database = require('./db_connection');
const app = express();

const PORT = 3000;


//needed for frontend
app.use(cors());

app.use(express.json());

//importing routes 
const login = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const couponRoutes = require('./routes/coupons');

//tell express which routes to use 
app.use('/auth', login);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/coupons', couponRoutes);

//testing route
app.get('/', (req, res) => {
    res.json({ message: 'server is running!' });
});

//starting server 
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});







