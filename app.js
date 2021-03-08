const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express();
require('dotenv').config();

var Publishable_Key = process.env.Your_Publishable_Key;
var Secret_Key = process.env.Your_Secret_Key;

const stripe = require('stripe')(Secret_Key)

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('Home', {
        key: Publishable_Key
    })
})

app.post('/payment', function (req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Anil Yadav',
        address: {
            line1: 'Jamuwaon, Mission mond, Ballia',
            postal_code: '221718',
            city: 'Ballia',
            state: 'Utter Pradesh',
            country: 'India',
        }
    })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2500,
                description: 'Web Development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success")
        })
        .catch((err) => {
            res.send(err)
        });
})

app.listen(port, function (error) {
    if (error) throw error
    console.log("Server created Successfully")
})
