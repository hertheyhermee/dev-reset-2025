// You're building a backend route that decides:

// Who can delete a post

// And logs what action was attempted

// 🧩 Input:
const users = [
  { id: 1, name: "Admin", role: "admin" },
  { id: 2, name: "Editor", role: "editor" },
  { id: 3, name: "Viewer", role: "viewer" },
];

// Only admin and editor can delete posts.

// Return an object:

// {
//   name: 'Editor',
//   canDelete: true,
//   log: 'Editor attempted to delete a post'
// }

// 🔨 Task:
function checkDeletePermission(user) {
  // your code here

  return user.role === "admin" || user.role === "editor"
    ? {
        name: user.name,
        canDelete: true,
        log: `${user.name} attempted to delete a post`,
      }
    : {
        name: user.name,
        canDelete: false,
        log: `${user.name} attempted to delete a post`,
      };
}

// function checkDeletePermission(user) {
//     const canDelete = user.role === "admin" || user.role === "editor";
//     return {
//       name: user.name,
//       canDelete,
//       log: `${user.name} attempted to delete a post`,
//     };
//   }
  

console.log(checkDeletePermission({ id: 2, name: "Editor", role: "editor" }));
console.log(checkDeletePermission({ id: 3, name: "Viewer", role: "viewer" }));
