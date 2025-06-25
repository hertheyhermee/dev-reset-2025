// Problem: Given an array of user objects, return only those users who are active.
// Each user has: { name: string, isActive: boolean }

// Input:
const users = [
    { name: 'John', isActive: true },
    { name: 'Mary', isActive: false },
    { name: 'Ali', isActive: true }
  ];
  
  // Output: [ { name: 'John', isActive: true }, { name: 'Ali', isActive: true } ]
  
  function getActiveUsers(users) {
    // your code here
    return users.filter(user => user.isActive === true);
  }
  
  console.log(getActiveUsers(users));
  