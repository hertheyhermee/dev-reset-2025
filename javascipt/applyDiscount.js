// Problem: Transform a list of product objects by applying a 10% discount to each product's price.
// Input: 
const products = [
    { name: 'Shirt', price: 5000 },
    { name: 'Shoe', price: 10000 },
    { name: 'Watch', price: 15000 }
  ];
  
  // Output:
  [
    { name: 'Shirt', price: 4500 },
    { name: 'Shoe', price: 9000 },
    { name: 'Watch', price: 13500 }
  ]
  
//   function applyDiscount(products) {
//     const discount = 0.1;

//     products.forEach(product => {
//         product.price = product.price - (product.price * discount);
//     });

//     return products
//   }
  
  // This version:
  
  // Leaves the original products array unchanged.
  
  // Creates a new object for each product using the spread operator (...).
  
  // Is often preferred in frontend apps, database migrations, etc.

  function applyDiscount(products, discounPercent) {
    const discount = discounPercent/100;
    return products.map(product => ({
      ...product,
      price: product.price - (product.price * discount),
    }));
  }

  console.log(applyDiscount(products, 20));
  