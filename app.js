const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config({path: __dirname + '/.env'});
// console.log(process.env['DATABASE_NAME']);

if(process.env['DATABASE_NAME']){
    console.log("using .env")
} else {
    require('dotenv').config({path: __dirname + '/.env.save'});
    console.log("using .env.save");
    console.log(process.env['DATABASE_NAME']);
}

const APIRouter = require('./routes/api/routes');

let app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect(
    // `mongodb://${process.env['DATABASE_USERNAME']}:${process.env['DATABASE_PASSWORD']}localhost:27017/${process.env['DATABASE_NAME']}`,
    `mongodb://localhost:27017/${process.env['DATABASE_NAME']}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(connected =>{
    console.log("DB Connected.");
}).catch(error =>{
    console.log("Error on connecting with DB.");
})

app.use("/api", APIRouter);

app.use("/", (req, res, next) =>{
    res
    .status(200)
    .json({
        message: "Welcome."
    })
})


module.exports = app;