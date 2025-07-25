import { UserList, MovieList } from "../FakeData.js";
import _ from "lodash";

const resolvers = {
  Query: {
    users: () => {
      return UserList;
    },
    user: (parent, args) => {
      const id = args.id;
      const user = _.find(UserList, { id: Number(id) });
      return user;
    },
    movies: () => {
      return MovieList;
    },
    movie: (parent, args) => {
      const name = args.name;
      const movie = _.find(MovieList, { name });
      return movie;
    },
  },
  User: {
    favoriteMovies: () => {
      return _.filter(
        MovieList,
        (movie) =>
          movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
      );
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      const user = args.input;
      const lastId = UserList[UserList.length - 1].id;

      const newUser = { ...user, id: lastId + 1 };
      UserList.push(newUser);
      return newUser;
    },

    updateUsername: (parent, args) => {
      const { id, newUsername } = args.input;
      let updatedUser;
      UserList.forEach((user) => {
        if (user.id === Number(id)) {
          user.username = newUsername;
          updatedUser = user;
        }
      });
      return updatedUser;
    },

    deleteUser: (parent, args) => {
        const id = args.id
        _.remove(UserList, (user) => user.id === Number(id))
        return null;
    }
  },
};

export default resolvers;
