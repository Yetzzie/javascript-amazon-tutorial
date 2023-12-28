import {cart} from "../../data/cart.js";

export function checkoutHeader() {
  let updateYourCheckout = 0;
  cart.forEach((arr)=>{
    updateYourCheckout += arr.quantity;
  });
  
  let checkoutHTML = `Checkout (<a class="return-to-home-link"
  href="amazon.html">${updateYourCheckout} items</a>)`;

  document.querySelector('.js-check-out').innerHTML = checkoutHTML;

}