const stripeAPI = require("../stripe")

async function createCheckoutSession(req, res) {
  //const domainUrl = process.env.WEB_APP_URL
  const { line_items, customer_email } = req.body
  console.log(line_items)

  // check req body has line items and email
  if (!line_items || !customer_email) {
    return res
      .status(400)
      .json({ error: "missing required session parameters" })
  }

  let session

  try {
    session = await stripeAPI.checkout.sessions.create({
      //automatic_payment_methods: { enabled: true },
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email,
      success_url: `https://stripebackend-p6nz.onrender.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://stripebackend-p6nz.onrender.com/canceled`,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
    })
    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.log(error)
    res
      .status(400)
      .json({ error: "an error occured, unable to create session" })
  }
}

module.exports = createCheckoutSession
