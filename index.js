const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const databaseUrl =
  process.env.MONGODB_URI ||
  "mongodb://admin:admin@ds261521.mlab.com:61521/heroku_pgs4d7cl";
let db;
MongoClient.connect(
  databaseUrl,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("storeProducts");
    app.listen(process.env.PORT || 3000, (req, res) => {
      console.log("server works");
    });
  }
);

app.get("/", (req, res) => {
  res.redirect("/all-products");
});
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, "
  );
  res.header({
    "Content-type": "application/json"
  });
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/all-products", (req, res) => {
  db.collection("products")
    .find()
    .toArray((err, result) => {
      if (err) console.log("cannot get products", err);
      res.json(result);
    });
});
app.get("/productId", (req, res) => {
  let id = req.query._id;
  db.collection("products")
    .find({ _id: ObjectId(id) })
    .toArray((err, result) => {
      res.json(result[0]);
    });
});
app.post("/addProduct", (req, res) => {
  console.log(req.body);
  db.collection("products").save(req.body, (err, result) => {
    if (err) console.error(err);
    res.send(result);
  });
});
app.put("/buyProducts", (req, res) => {
  let id = req.body._id;
  db.collection("products").findOneAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: {
        buy: "true"
      }
    },
    (err, result) => {
      if (!req.body._id) return res.send(err);
      res.send(result);
    }
  );
});
app.get("/cardProducts", (req, result) => {
  db.collection("products")
    .find({ buy: "true" })
    .toArray((err, res) => {
      result.json(res);
    });
});
