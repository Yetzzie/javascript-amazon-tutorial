import {cart, removeFromCart, updateDeliveryOption, updateQuantity} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {delivery, getDeliveryOption, calculateDeliveryDate} from '../../data/deliverytime.js';
import { renderPaymentSummary } from './paymentsummer.js';
import { checkoutHeader } from './checkoutHeader.js';


export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

  const matchingProduct = getProduct(productId);
  const deliveryOptionId = cartItem.deliveryOption;
  const err = getDeliveryOption(deliveryOptionId);
  const dateStrings = calculateDeliveryDate(err);

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateStrings}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
              <!-- This code was copied from the solutions of exercises 14f - 14n. -->
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  // we create a function which update date in checkout
  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = '';

    delivery.forEach((err)=>{
      //this were the external library use which is dayjs
    const priceString = err.priceCent === 0 ? 'FREE' : `$${formatCurrency(err.priceCent)} -`;
    const isChecked = err.id === cartItem.deliveryOption;
    const dateStrings = calculateDeliveryDate(err);
      
      html +=`
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option="${err.id}">
          <input type="radio" ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  ${dateStrings}
                </div>
                <div class="delivery-option-price">
                  ${priceString} Shipping
                </div>
              </div>
            </div>
      `
    });
    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        renderOrderSummary();
        renderPaymentSummary();
        checkoutHeader();
      });
    });

    document.querySelectorAll('.js-delivery-option').forEach((arr)=>{
      arr.addEventListener('click',()=>{
        const {productId, deliveryOption} = arr.dataset;
        updateDeliveryOption(productId, deliveryOption);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });


    document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
      });
    });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);
        updateQuantity(productId, newQuantity);

        checkoutHeader();
        renderOrderSummary();
        renderPaymentSummary();

        // We can delete the code below (from the original solution)
        // because instead of using the DOM to update the page directly
        // we can use MVC and re-render everything. This will make sure
        // the page always matches the data.

        // const quantityLabel = document.querySelector(
        //   `.js-quantity-label-${productId}`
        // );
        // quantityLabel.innerHTML = newQuantity;

        // updateCartQuantity();
      });
    });
  }