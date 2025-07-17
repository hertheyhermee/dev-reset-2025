export const UserList = [
    {
        id: 1,
        name: "John",
        username: "john",
        age: 20,
        nationality: "CANADA",
        friends: [
            {
                id: 2,
                name: "Pedro",
                username: "PedroTech",
                age: 20,
                nationality: "BRAZIL"
            },
            {
                id: 5,
                name: "Kelly",
                username: "kelly2019",
                age: 5,
                nationality: "CHILE"
            }
        ]
    },
    {
        id: 2,
        name: "Pedro",
        username: "PedroTech",
        age: 20,
        nationality: "BRAZIL"
    },
    {
        id: 3,
        name: "Sarah",
        username: "Cameron",
        age: 25,
        nationality: "INDIA",
        friends: [
            {
                id: 1,
                name: "John",
                username: "john",
                age: 20,
                nationality: "CANADA",
            },
        ]
    },
    {
        id: 4,
        name: "Rafe",
        username: "rafe123",
        age: 60,
        nationality: "GERMANY"
    },
    {
        id: 5,
        name: "Kelly",
        username: "kelly2019",
        age: 5,
        nationality: "CHILE"
    }
]

export const MovieList = [
    {
        id: 1,
        name: "Avengers Endgame",
        yearOfPublication: 2019,
        isInTheatres: true
    },
    {
        id: 1,
        name: "Avengers Endgame",
        yearOfPublication: 2019,
        isInTheatres: true
    },
    {
        id: 2,
        name: "Interstellar",
        yearOfPublication: 2007,
        isInTheatres: true
    },
    {
        id: 3,
        name: "Superbad",
        yearOfPublication: 2009,
        isInTheatres: true
    },
    {
        id: 4,
        name: "Pedro the tech",
        yearOfPublication: 2035,
        isInTheatres: false
    },
]

export default { UserList, MovieList }