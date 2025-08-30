// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency = 'usd', description = 'Donation to Celluloid by Design' } = JSON.parse(event.body);

    // Validate amount (minimum $0.50 for Stripe)
    if (!amount || amount < 50) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Amount must be at least $0.50' })
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Donation',
              description: description,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/donate?success=true`,
      cancel_url: `${process.env.URL}/donate?canceled=true`,
      metadata: {
        type: 'donation',
        description: description
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id })
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};