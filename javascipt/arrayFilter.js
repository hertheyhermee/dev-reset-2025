// Problem: Given an array of names, return only those longer than 5 characters.
// function filterNames(names) {
//     let result = [];
//     for(conet i = 0; i < names.length; i++) {
//         if(names[i].length > 5) {
//             result.push(names[i]);
//         }
//     }
//     return result
//   }

const filterNames = (names) => names.filter(name => name.length > 5);
  
  console.log(filterNames(['Ade', 'Zainab', 'Chioma', 'Jo', 'Blessing'])); // ['Zainab', 'Chioma', 'Blessing']
  