import mongoose from 'mongoose';

// const MONGODB_URI = "mongodb+srv://balamuruganwebdeveloper:BALADEVELOPER@cluster0.4a5lbbc.mongodb.net/website?retryWrites=true&w=majority&appName=Cluster0"
const MONGODB_URI = "mongodb+srv://pentaxialtechnologies:Dev%402k26@staging.58bgooy.mongodb.net/staff-website?retryWrites=true&w=majority&appName=Staging";



 if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {

  var mongooseCache: MongooseCache | undefined;
}

const mongooseCache: MongooseCache = global.mongooseCache || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  mongooseCache.conn = await mongooseCache.promise;
  return mongooseCache.conn;
}

if (!global.mongooseCache) {
  global.mongooseCache = mongooseCache;
}

export default dbConnect;
