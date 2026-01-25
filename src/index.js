require('dotenv').config()
const express = require('express')
const authRoutes = require('./Routes/login-route')
const productRoutes = require('./Routes/products-route')
const orderRoutes = require('./Routes/order-route')

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.listen(8080, () => console.log('Server running on port 8080'))