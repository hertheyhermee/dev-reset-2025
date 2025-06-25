// 🧠 Task 2: Combine Set + Map + Array
// 🧩 Scenario: Building a Product Tagging System
// You're building a product catalog. Each product has tags.

// Example Data:

const products = [
  { id: 1, name: 'Laptop', tags: ['electronics', 'computers', 'tech'] },
  { id: 2, name: 'Mouse', tags: ['electronics', 'accessories', 'tech'] },
  { id: 3, name: 'Book', tags: ['education', 'paper'] },
];
// 🎯 Goal:
// Build a function getProductsByTag(products) that returns:

const getProductsByTag = (products) => {
  const tagMap = new Map();

  products.forEach(product => {
    product.tags.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [product.name]);
      } else {
        tagMap.get(tag).push(product.name);
      }
    });
  });

  // If you want a plain object instead of a Map:
  // return Object.fromEntries(tagMap);

  return Object.fromEntries(tagMap); // Convert Map to object for easier use
};

console.log(getProductsByTag(products));

// {
//   electronics: ['Laptop', 'Mouse'],
//   computers: ['Laptop'],
//   tech: ['Laptop', 'Mouse'],
//   accessories: ['Mouse'],
//   education: ['Book'],
//   paper: ['Book']
// }
// ✅ Requirements:
// Loop through each product

// Loop through each tag inside the product

// Group product names by tag