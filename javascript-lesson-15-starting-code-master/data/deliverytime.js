import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const delivery = [{
  id: '1',
  deliveryDays: 7,
  priceCent: 0
},
{
  id: '2',
  deliveryDays: 3,
  priceCent: 499
},
{
  id: '3',
  deliveryDays: 1,
  priceCent: 999
}];

export function getDeliveryOption(err) {
  let deliveryOption;

    delivery.forEach((option) => {
      if(option.id === err) {
        deliveryOption = option;
      }
    });
    return deliveryOption;
}

export function calculateDeliveryDate(err) {
  const today = dayjs();
    const deliveryDate = today.add(err.deliveryDays, 'days');
    const dateStrings = deliveryDate.format('dddd, MMMM D');
    const weekendsChecker = deliveryDate.format('dddd') === 'Sunday' ? today.add(err.deliveryDays + 1, 'days').format('dddd, MMMM D'): deliveryDate.format('dddd') === 'Saturday' ? today.add(err.deliveryDays + 2, 'days').format('dddd, MMMM D') : today.add(err.deliveryDays, 'days').format('dddd, MMMM D');

    return weekendsChecker;
}