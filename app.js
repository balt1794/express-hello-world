// const stripe = require('stripe')('sk_test_51Iq7GdLxbwyf0mcitBtRuEF0EmjYvnqnon3NrOF7UdSXo3wrOL8pLJzT75S61DTZ5OUTsf0658j5eKPm0iQsbVMw00d0uCmCiw');
//const stripe = require("stripe")(
  //"sk_test_51HUTZsK2HsGxm2mtGYzrtVTyYQIv8nSlK3B7etmB3HFYOvpcQbtXsuaOfXBKiFfVWGTztXZmsIuyce7ScC4BEYIY00Cd22oUw6"
//);

const stripe = require("stripe")(
  "sk_test_51Iq7GdLxbwyf0mcitBtRuEF0EmjYvnqnon3NrOF7UdSXo3wrOL8pLJzT75S61DTZ5OUTsf0658j5eKPm0iQsbVMw00d0uCmCiw"
);

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const express = require("express");
const app = express();

var serviceAccount = require("./new-db-hjd-firebase-adminsdk-m7rin-7dd2492566.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const port = process.env.PORT || 3001;

const bodyParser = require("body-parser");
var cors = require("cors");

// Put these statements before you define any routes.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const YOUR_DOMAIN = "http://localhost:3000";

app.get("/", async (req, res) => {
  res.send("Node Server Working");
});

app.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!", paymentIntent.id);

        const docRef = db.collection("jobs");
        const snapshot = await docRef
          .where("payment_intent", "==", paymentIntent.id)
          .get();

        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        snapshot.forEach((doc) => {
          db.collection("jobs").doc(doc.id).update({
            status: "PUBLISHED",
          });
        });

        // const job = await snapshot.get();

        // if (!job.exists) {
        //   console.log("No such document!");
        // } else {
        //   console.log("Document data:", job.data());
        // }
        break;
      case "payment_method.created":
        console.log("PaymentMethod was created!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: "price_1LQfPyLxbwyf0mciNRte3IIE",
        //price: "price_1LzFhbK2HsGxm2mtFNaYB64d",
        price: "price_1LQfPyLxbwyf0mciNRte3IIE",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/`,
    cancel_url: `${YOUR_DOMAIN}/form`,
  });

  console.log(session);
  res.status(200);
  res.send(session);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
