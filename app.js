const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// My routes
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')

//Port and Express app 
const app = express()
const PORT = process.env.PORT || 8000

// DB connection
mongoose.connect(process.env.DATABSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('DB CONNECTED')
}).catch((err) => {
    console.log('Something went wrong!');
    console.log(err);
})

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// My Routes
app.use('/api',authRouter)
app.use('/api',userRouter)
app.use('/api',categoryRouter)
app.use('/api',productRouter)
app.use('/api',orderRouter)

// Starting a server
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})