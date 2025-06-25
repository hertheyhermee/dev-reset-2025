// Starting user list
let users = [
    { id: 1, name: 'Azeez', email: 'azeez@example.com' },
    { id: 2, name: 'Chioma', email: 'chioma@example.com' },
  ];
  
  // Write functions to:
  function createUser(users, newUser) {
    return [...users, newUser]
  }
  
  function updateUserEmail(users, id, newEmail) {
    // Update user by id with new email (no mutation)
    return users.map((user) => user.id === id ? { ...user, email: newEmail } : user)
  }
  
  function deleteUser(users, id) {
    // Remove user by id (no mutation)
    return users.filter(user => user.id !== id)
  }
  
  // Usage:
  users = createUser(users, { id: 3, name: 'Zainab', email: 'zainab@example.com' });
  users = updateUserEmail(users, 1, 'azeez@newmail.com');
  users = deleteUser(users, 2);
  
  console.log(users);
  // Final output should show Azeez (updated email) and Zainab, but no Chioma
  