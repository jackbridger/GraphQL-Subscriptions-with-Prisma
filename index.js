
import { GraphQLServer, PubSub } from "graphql-yoga"
// PubSub, is based on an event emitter. Provides us with publish and asyncIterator functions
import { Prisma } from "prisma-binding";
const pubsub = new PubSub();
// constant used to connect publish with asyncIterator
const TODOS_CHANGED = "TODOS_CHANGED"
// Generate a random id for our ToDos

const prisma = new Prisma({
    typeDefs: "./prisma-to-do/generated/prisma.graphql",
    endpoint: "https://eu1.prisma.sh/jack-bridger-418b15/demo/dev"
    // endpoint: "http://localhost:4466/"
})


// The schema for our graphQL operations and our custom types
const typeDefs = `
type Query {
    toDos: [ToDo]!
}
type Mutation {
    createToDo(title: String): ToDo!
}
type Subscription {
    ToDoChanged: ToDo!

}
type ToDo {
    id: ID!
    title: String!
}

`


// How we handle graphQL operations from the front end
const resolvers = {
    Query: {
        // Return all To Dos
        toDos: async (parent, args, { prisma }, info) => {
            const allToDos = await prisma.query.toDoes({}, info)
            return allToDos

        }
    },
    Mutation: {
        createToDo: async (parent, { title }, { prisma, pubsub }, info) => {

            const newToDo = await prisma.mutation.createToDo({
                data: {
                    title
                }
            })
            console.log(newToDo)
            pubsub.publish(TODOS_CHANGED, { ToDoChanged: newToDo });
            return newToDo
        }
    },
    Subscription: {
        // Note: "Subscriptions resolvers are not a function, 
        // but an object with subscribe method, that returns AsyncIterable." 
        ToDoChanged: {
            subscribe(_, __, { pubsub }) {
                // Listen for TODOS_CHANGED changed and then forward the provided
                // ToDoChanged payload to clients who have subscribed to ToDoChanged
                return pubsub.asyncIterator(TODOS_CHANGED);

            }
        }
        // ToDoChanged: {
        //     subscribe: newToDoSubscribe,
        //     resolve: payload => {
        //         console.log("payload is... !", payload)
        //         console.log("payload is... !")
        //         const parsed = JSON.parse(JSON.stringify(payload))
        //         console.log("parsed", parsed.ToDoChanged)
        // return {
        //     id: "12312312312",
        //     title: "test"
        // }
        //     }
        // },


    }
}
// Creating neew GQL server running on port 4000, we pass in our schema, resolvers and our 
// pub sub and database so that our resolvers can access them. 

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub, prisma } })

server.start(console.log("gql node server running on local host 4000"))