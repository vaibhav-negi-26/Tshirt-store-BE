const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 8000

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

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})