const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const path = require('path');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const cors = require('cors');

const API_PORT = process.env.PORT || 3001;
const API_PORT_TO_LISTEN = parseInt(API_PORT) + 10;

const app = express();

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://test:test@shop-uuyvd.mongodb.net/shop?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { 
    useNewUrlParser: true,
    dbName: 'shop'
  }
);

let connection = mongoose.connection;

// checks if connection with the database is successful
connection.on("error", console.error.bind(console, "MongoDB connection error sdfsdf:"));
connection.once("open", () => {
  console.log("connected to the database")
  connection.db.collection('products',function(err, collection){
      collection.find({}).toArray(function(err, data){
          console.log(data); // it will print your collection data
      })
  });
});


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

mongoose.model('Products', 
               new Schema({ productId: String, description: String }), 
               'products'); 

  


// this is our get method
// this method fetches all available data in our database
router.route("/getData", (req, res) => {
  console.log('at get data');
  Products.find({}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.route("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT_TO_LISTEN, () => console.log(`LISTENING ON PORT ${API_PORT_TO_LISTEN}`));