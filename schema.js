import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import Models from './models';

const Tag = new GraphQLObjectType({
  name: 'Tag',
  description: 'this is tag',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(tag) {
          return tag.id;
        },
      },
      name: {
        type: GraphQLString,
        resolve(tag) {
          return tag.name;
        }
      },
      entries: {
        type: new GraphQLList(Entry),
        args: {
          limit: {
            type: GraphQLInt,
            defaultValue: 10,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve(tag, {limit, offset}) {
          return tag.getEntries({limit, offset});
        },
      }
    }
  }
});

const Entry = new GraphQLObjectType({
  name: 'Entry',
  description: 'entry owned by author',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve(entry) {
          return entry.id;
        },
      },
      title: {
        type: GraphQLString,
        resolve (entry) {
          return entry.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve (entry) {
          return entry.content;
        }
      },
      category: {
        type: GraphQLString,
        resolve (entry) {
          return entry.category;
        }
      },
      tags: {
        type: new GraphQLList(Tag),
        args: {
          limit: {
            type: GraphQLInt,
            defaultValue: 10,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve(entry, {limit, offset}) {
          return entry.getTags({limit, offset});
        },
      },
      author: {
        type: Author,
        args: {
          limit: {
            type: GraphQLInt,
            defaultValue: 10,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve (entry, {limit, offset}) {
          return entry.getAuthor({limit, offset});
        }
      },
      summary: {
        type: GraphQLString,
        resolve(entry) {
          return entry.summary;
        },
      },
    };
  }
});

const Author = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents a Author',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (author) {
          return author.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve (author) {
          return author.name;
        }
      },
      email: {
        type: GraphQLString,
        resolve (author) {
          return author.email;
        }
      },
      entries: {
        type: new GraphQLList(Entry), // 返値はList[Entry]
        args: {
          limit: {
            type: GraphQLInt,
            defaultValue: 10,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve(author, {limit, offset}) {
          return author.getEntries({limit, offset});
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      author: {
        type: Author,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
        },
        resolve(root, args) {
          return Models.author.findOne({ where: args });
        }
      },
      entry: {
        type: Entry,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve(_, args) {
          return Models.entry.findOne({ where: args });
        }
      },
      tag: {
        type: Tag,
        args: {
          id: {
            type: GraphQLInt,
          },
          name: {
            type: GraphQLString,
          },
        },
        resolve(_, args) {
          return Models.tag.findOne({ where: args });
        }
      },
      authors: {
        type: new GraphQLList(Author),
        args: {
          id: {
            type: GraphQLInt
          },
          email: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return Models.author.findAll({ where: args });
        }
      },
      entries: {
        type: new GraphQLList(Entry),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          },
          limit: {
            type: GraphQLInt,
            defaultValue: 10,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve (root, {limit, offset, ...args} ) {
          return Models.entry.findAll({
            where: args,
            limit,
            offset,
          });
        },
      },
      tags: {
        type: new GraphQLList(Tag),
        args: {
          limit: {
            type: GraphQLInt,
            defaultValue: 10,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve(_, {limit, offset}) {
          return Models.tag.findAll({
            limit,
            offset,
          });
        },
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'WikiMutations',
  description: 'Functions to set stuff',
  fields: () => ({
    createAuthor: {
      type: Author,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve (source, { name, email }) {
        return Models.author.create({
          name,
          email,
//          email.toLowerCase(),
        });
      },
    },
    /*
    addPerson: {
      type: Person,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString)
        },
        email: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve (source, args) {
        return Models.person.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email.toLowerCase()
        });
      }
    }
    */
  }),
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
