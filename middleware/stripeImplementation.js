import "dotenv/config";
// const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);
// import Stripe from "stripe";
import generalResponse from "../helpers/generalResponse.js";

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeImplementation = async (req, res) => {
    try {
        
        const products = req.body.buyingItemArray;
        // const productName = buyingItemArray[0]['product_name'];

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.product_name,
                    images: product.image_path.split(','),
                },
                unit_amount: Math.round(product.offer_price * 100) + 50 * 100,
            },
            quantity: product.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/completePaymentPage',
            cancel_url: 'http://localhost:3000/cancelPaymentPage'
        })
        return res.status(200).send(generalResponse("success", { id: session.id, url: session.url }));
    } catch (error) {
        console.log(error);
        res.status(400).json(generalResponse("something went wrong!"))
    }
}