import axios from 'axios';
import { showAlert } from './alert';

// const Stripe = require('stripe');
const stripe = Stripe(
  'pk_test_51Kb2VXLntuHNBcqX967cZaDX7TBuSjJwZ1nZVcuI9sogqrjbQYJCMCXm4v0WjISun32NsMKGIHyRTi6bed9sEHf3001j6goNj9'
);

// async function myAsyncFunction() {
//   const stripe = await loadStripe(process.env.STRIPE_PK);
// }

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
