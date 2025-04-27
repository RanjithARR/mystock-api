let axios = require('axios');
let express = require('express');
let mongoDb = require('mongodb');
const finApiKey = "d06hfnhr01qg26s8067gd06hfnhr01qg26s80680";

let app = express();
let stocks;
app.use(express.json());

//for momgodb connections
let url = 'mongodb://localhost:27017'; 
let dbName = "product_db";//name of the database to connect

let MongoClient = mongoDb.MongoClient;//help to connect to db
let db; //variable to hold database object

MongoClient.connect(url)
.then((client) => {
    db = client.db(dbName); //connect to database using client object
    console.log('Connected to database');
})
.catch((err) => {
    console.log(err);
});

//find stock detals using symbol
//http://localhost:8080/findStocks/:symbol
//http://localhost:8080/findstocks/MMM
app.get('/findStocks/:symbol', async (req, res) => {
    let symbol = req.params.symbol;
    let stockdetails = stocks.find((stocks) => stocks.symbol == symbol);
    if(stockdetails == undefined){
        res.status(404).send("Stock not found");

    }else{
        res.send(stockdetails);
    }
});

//http://localhost:8080/findstocks(Directly fetch from thirdy party api)
app.get('/findStocks', async (req, res) => {
    let response = await axios.get(`http://finnhub.io/api/v1/search?q=apple&exchange=US&token=${finApiKey}`);
    stocks = response.data.result;
    //console.log("stocks lenght" ,   stocks.length); //stock data fetched from server);
    res.send(stocks);
})
    //let response = await axios.get(`http://localhost:3001/Stocks/${symbol}`);
   

    //http://localhost:8080/myPortfolio(using mongodb-fetch from local db)
app.get("/myPortfolio",async (req, res) => {
    try{
        let result = await db.collection("stocks").find({}).toArray();
        res.json({"msg": result});
    }
    catch(err){
        console.log(err);
        res.json({"msg":err});
    }
})

//add stocks to mongodb-Do it through post man
app.post("/addStocks",async (req, res) => {
    try{
        let result = await db.collection("stocks").insertOne(req.body);
        res.json({"msg": "Stock added successfully"});
        console.log(result);
    }
    catch(err){
        console.log(err);
        res.json({"msg":err});
    }
})

   // http://localhost:3001/Stocks
   //http://finnhub.io/api/v1/search?q=apple&exchange=US&token=d06hfnhr01qg26s8067gd06hfnhr01qg26s80680
   //http://localhost:8080/Stocks
app.listen(8080, async () => {
    console.log('Server is running on port 8080');
    
    let response = await axios.get(`http://finnhub.io/api/v1/search?q=apple&exchange=US&token=${finApiKey}`);
    stocks = response.data.result;
    console.log("stocks lenght" ,   stocks.length); //stock data fetched from server);

});