const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/auth')

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

// Starting a server
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})