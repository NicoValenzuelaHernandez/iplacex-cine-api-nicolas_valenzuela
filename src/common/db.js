import { MongoClient, ServerApiVersion } from "mongodb";

const uri = 'mongodb+srv://nvalenzuelah:GnGDPIqMwWcWXi5O@eva-u3-express.mwq0u.mongodb.net/?retryWrites=true&w=majority&appName=eva-u3-express';

const client = new MongoClient(uri, {
    serverApi: {
        version : ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export default client