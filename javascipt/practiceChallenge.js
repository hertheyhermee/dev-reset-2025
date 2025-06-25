// orders (same as before)
const orders = [
    { id: 1, customer: 'Alice', total: 5000, status: 'delivered' },
    { id: 2, customer: 'Bob', total: 7000, status: 'pending' },
    { id: 3, customer: 'Alice', total: 3000, status: 'delivered' },
    { id: 4, customer: 'David', total: 2000, status: 'delivered' },
    { id: 5, customer: 'Bob', total: 1000, status: 'cancelled' },
    { id: 6, customer: 'Alice', total: 1500, status: 'pending' },
  ];

  const summary = (orders) => {
    const summaryData = orders.reduce((acc, order) => {
        const { status, total } = order

        if (status !== 'cancelled') 
            acc.totalRevenue += total
        if (status === 'delivered')
            acc.totalDeliveredOrders += 1
        return acc

    }, {totalRevenue: 0, totalDeliveredOrders: 0})

    const noncancelledOrders = orders.filter(order => order.status !== 'cancelled')
    const averageOrderValue = summaryData.totalRevenue / noncancelledOrders.length
    return {
      totalRevenue: summaryData.totalRevenue,
      totalDeliveredOrders: summaryData.totalDeliveredOrders,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
    }
  };

  
  // Create a summary object like this:
//   {
//     totalRevenue: 18500,
//     totalDeliveredOrders: 3,
//     averageOrderValue: 3083.33
//   }
  
console.log(summary(orders));
  