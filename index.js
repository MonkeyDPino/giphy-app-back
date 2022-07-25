const express = require('express');
require('dotenv').config()
const cors = require('cors')
const DBConnection = require('./DBConnection')
const app = express();

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

app.use(express.json())
app.use(cors())
app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)


app.listen({port: process.env.PORT || 5000},async()=>{
    await DBConnection()
    console.log('listening on port 5000')
})