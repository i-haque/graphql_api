const Client = require('./models/client');
const Project = require('./models/project');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

// client type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

// project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    clientID: { type: GraphQLID },
    client: {
      type: ClientType,
      resolve(parent) {
        return Client.findById(parent.clientID).exec();
      },
    },
  },
});

// Query
const Query = new GraphQLObjectType({
  name: 'QueryType',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return Client.find().exec();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id).exec();
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find().exec();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id).exec();
      },
    },
  },
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'MutationType',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Client.create({
          name: args.name,
          phone: args.phone,
          email: args.email,
        });
      },
    },
    deleteClient: {
      type: ClientType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id).exec();
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        clientID: { type: GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
      },
      resolve(parent, args) {
        return Project.create({
          name: args.name,
          description: args.description,
          clientID: args.clientID,
          status: args.status,
        });
      },
    },
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Project.findByIdAndDelete(args.id).exec();
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            name: args.name,
            description: args.description,
            status: args.status,
          },
          { new: true, runValidators: true }
        ).exec();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
