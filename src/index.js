require('dotenv').config()
const express = require('express')
const authRoutes = require('./Routes/login-route')
const productRoutes = require('./Routes/products-route')

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.listen(8080, () => console.log('Server running on port 8080'))