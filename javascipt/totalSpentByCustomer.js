// You receive an array of orders from an API. Each order has:

// orderId

// customerName

// items: an array of products purchased (each with name and price)

// You want to transform this into a new format that groups data by customerName and lists their total amount spent.

const orders = [
    {
      orderId: 1,
      customerName: 'Alice',
      items: [
        { name: 'Book', price: 2000 },
        { name: 'Pen', price: 500 }
      ]
    },
    {
      orderId: 2,
      customerName: 'Bob',
      items: [
        { name: 'Laptop', price: 50000 }
      ]
    },
    {
      orderId: 3,
      customerName: 'Alice',
      items: [
        { name: 'Bag', price: 7000 }
      ]
    }
  ];

// Expected Output
//   {
//     Alice: 9500,   // 2000 + 500 + 7000
//     Bob: 50000
//   }
  

  
  function totalSpentByCustomer(orders) {
    // your code here
    return orders.reduce((acc, order) => {
        const { customerName, items } = order;
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
        acc[customerName] = (acc[customerName] || 0) + totalPrice
        return acc
    }, {})
  }
  
  console.log(totalSpentByCustomer(orders));
  