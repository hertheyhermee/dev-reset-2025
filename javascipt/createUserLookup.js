// 🧠 Task 1: Map() Mastery – Fast Lookups
// 🧩 Scenario: You run an app with thousands of users.
// You want to quickly get a user’s email by their username.


const users = [
  { username: 'azeez', email: 'azeez@example.com' },
  { username: 'chioma', email: 'chioma@example.com' },
  { username: 'zainab', email: 'zainab@example.com' },
];
// 🎯 Goal:
// Build a getUserEmail(username) function using a Map().

// ✅ Instructions:
// First, build a Map from the array.

// Then return the email if the username exists.

// Return 'User not found' if it doesn’t.

// 🔨 Try This:

function createUserLookup(users) {
  const userMap = new Map();
  // TODO: fill the map
  users.forEach(user => {
    userMap.set(user.username, user.email)
  })

  return {
    getUserEmail: (username) => {
      // TODO: use userMap
      if (userMap.has(username)) {
        return userMap.get(username);
      }
      return 'User not found';
    }
  };
}
// Then call:

const lookup = createUserLookup(users);
console.log(lookup.getUserEmail('chioma')); // 'chioma@example.com'
console.log(lookup.getUserEmail('john'));   // 'User not found'