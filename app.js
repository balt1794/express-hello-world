const stripe = require('stripe')('sk_test_51Iq7GdLxbwyf0mcitBtRuEF0EmjYvnqnon3NrOF7UdSXo3wrOL8pLJzT75S61DTZ5OUTsf0658j5eKPm0iQsbVMw00d0uCmCiw');
const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

const bodyParser = require('body-parser');
var cors = require('cors');

// Put these statements before you define any routes.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));


const YOUR_DOMAIN = 'http://localhost:3000';

app.get("/", async (req, res) => {
  res.send('Node Server Working')
})

const bodyParser = require('body-parser');

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const payload = request.body;

  console.log("Got payload: " + payload);

  response.status(200);
});


app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1LQfPyLxbwyf0mciNRte3IIE',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/`,
    cancel_url: `${YOUR_DOMAIN}/form`,
  });

  res.send(session);
  res.send('Nice')
  res.status(200);
});


  

  

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
