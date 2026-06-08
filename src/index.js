import dotenv from "dotenv";

import app from "../app.js"
dotenv.config({
    path:"./.env"
})

import connectDB from "./db/connection.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is running in port ${process.env.PORT || 5000}`)
    })
})
.catch((err)=>{
    console.log(err)
})