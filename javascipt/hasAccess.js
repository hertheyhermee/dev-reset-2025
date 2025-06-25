// Problem: Create a function that checks if a user has access to a page
// Rules:
// - If user is an admin, they always have access
// - If not an admin, they only have access if `canAccess` is true

// Input: { name: 'Jane', isAdmin: false, canAccess: true }
// Output: true

// Input: { name: 'Mike', isAdmin: false, canAccess: false }
// Output: false

// Input: { name: 'AdminUser', isAdmin: true, canAccess: false }
// Output: true

function hasAccess(user) {
    // your code here
    return user.isAdmin || user.canAccess ? true : false;
  }
  
  console.log(hasAccess({ name: 'Jane', isAdmin: false, canAccess: true }));  // true
  console.log(hasAccess({ name: 'Mike', isAdmin: false, canAccess: false })); // false
  console.log(hasAccess({ name: 'AdminUser', isAdmin: true, canAccess: false })); // true
  