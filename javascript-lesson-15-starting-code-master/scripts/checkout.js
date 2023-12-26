import {renderOrderSummary} from './checkout/ordersummary.js';
import { renderPaymentSummary } from './checkout/paymentsummer.js';
import {checkoutHeader} from './checkout/checkoutHeader.js';

checkoutHeader();
renderPaymentSummary();
renderOrderSummary();
