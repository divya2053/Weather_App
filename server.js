const express = require("express")
const path = require("path")
const app = express()
const axios = require('axios');
const e = require("express");


app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"))

const PORT = process.env.PORT || 8000

const API = '0286f249232cbe905f70c0f993d2a8c1';
app.post('/getweather',async (req,res)=>{
    var data = 'Could Not fetch data at the time. Please try again after some time'
    let response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${req.body.lat}&lon=${req.body.long}&cnt=${7}&units=metric&appid=`+API);
    if(response.data)
        res.status(200).send(JSON.stringify(response.data));
    else
        res.status(500).send(JSON.stringify(data))
})

app.post('/getweatherbycity',async (req,res)=>{
    console.log(req.body);
    var data = 'Could Not fetch data at the time. Please try again after some time'
    let response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${req.body.location}&cnt=${7}&units=metric&appid=` + API);
    if (response.data)
        res.status(200).send(JSON.stringify(response.data));
    else
        res.status(500).send(JSON.stringify(data))
})


app.listen(PORT,()=>{
    console.log(`Server Started at Port ${PORT}`)
})