const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("sk_test_51LIe9RLReLCeEpqKOo2YCT6aAGdsJybaUIH8iSb6A3OTYJvitYjlbpHqhBEFOz0WC8uGFeKQ0vnzZIrazt3Knhcr00pZMXNDw6")
const uniqueKey = require('uuid').v4;
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
    res.send("GET IS WORKING");
});

app.post("/api/payment", (req, res) => {
    const {service, token} = req.body;
    console.log("SERVICE", service);
    console.log("PRICE", service.price); // changed here old code - console.log("PRICE", service.price);
    
    return stripe.customers.create({
        email: token.email,
        source: token.id    
    }).then(customer => {
        stripe.charges.create({
            amount: service.price * 100, //changed here old code - amount: service.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: service.name
        })
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
});

// listen
app.listen(3001, () => console.log("LISTENING AT PORT 3001"));