require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")

const userRoute = require("./Routes/userRoutes");
console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL).then(function connection() {
    console.log("Connected to HyperX");
}).catch(function connerr(err) {
    console.log(err);
});

app.use(express.json());

app.listen(process.env.API_PORT, function listenerr(err) {
    if (err) {
        console.log("CONNECTION ERROR :", err);
    }

})

app.use("/user/api", userRoute)
