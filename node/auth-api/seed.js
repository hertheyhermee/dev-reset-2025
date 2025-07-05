import db from "./db/db.js";

// 1. Seed products if not already seeded
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
if (productCount === 0) {
  const products = [
    ["Laptop", 1500],
    ["Phone", 800],
    ["Headphones", 200],
    ["Mouse", 50],
    ["Keyboard", 100]
  ];
  const insertProduct = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
  const insertMany = db.transaction((products) => {
    for (const product of products) insertProduct.run(...product);
  });
  insertMany(products);
  console.log("✅ Seeded products.");
} else {
  console.log("ℹ️ Products already seeded.");
}

// 2. Seed orders for existing users
const userRows = db.prepare("SELECT id FROM users").all();
const user_ids = userRows.map(row => row.id);

if (user_ids.length > 0) {
  const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
  if (orderCount === 0) {
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const now = new Date();
    const orders = [];
    for (let i = 0; i < 30; i++) {
      const user_id = random(user_ids);
      const product_id = Math.floor(Math.random() * 5) + 1; // 1-5
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3
      const daysAgo = Math.floor(Math.random() * 46); // 0-45
      const created_at = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 10);
      orders.push([user_id, product_id, quantity, created_at]);
    }
    const insertOrder = db.prepare("INSERT INTO orders (user_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)");
    const insertManyOrders = db.transaction((orders) => {
      for (const order of orders) insertOrder.run(...order);
    });
    insertManyOrders(orders);
    console.log(`✅ Seeded orders for ${user_ids.length} users.`);
  } else {
    console.log("ℹ️ Orders already seeded.");
  }
} else {
  console.log("⚠️ No users found in the DB. Please register at least one user via the API.");
} 