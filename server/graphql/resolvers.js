// ./server/grahpql/resolvers.js

// import { PubSub } from 'apollo-server';
import config from '../../config';
import uuidv4 from 'uuid/v4';
import { RedisPubSub } from 'graphql-redis-subscriptions';
const Redis = require('ioredis');

const options = {
  host: config.redisHost,
  port: config.redisPort,
  retry_strategy: options => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  }
};

const pubsub = new RedisPubSub({
  connection: options
});
// Test in-memory database (you would use some real DB in production)
const messages = [];
const CHANNEL = `messageAdded`;

// Update 'database' on new messages (not just on mutations)
// This allows us to update db when messages come into Redis from elsewhere
pubsub.subscribe(CHANNEL, (payload) => {
  console.log(`New message received on channel ${CHANNEL}`);

  // extract message object from payload wrapper
  try {
    const message = payload[CHANNEL]; // object wrapped in channel name
    messages.push(message); // store in in-memory 'database' above
    console.log(`Added message to database`);
  } catch (error) {
    console.error(`Error trying to extract new message from payload`);
    console.error(error.message);
  }
})

// Resolver
const resolvers = {
  Query: {
    messages(root, {}, context) {
      return messages;
    }
  },
  Mutation: {
    addMessage: (root, { message }) => {
      console.log({message});
      const newMessage = { id: uuidv4(), content: message };
      pubsub.publish(CHANNEL, { messageAdded: newMessage });
      return messages;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(CHANNEL),
    },
  },
};

export default resolvers;