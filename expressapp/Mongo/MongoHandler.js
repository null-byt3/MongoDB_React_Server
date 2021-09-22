import { MongoClient, ObjectId } from 'mongodb';

class MongoHandler {
  DB;
  MongoClient;
  costsCollection;
  usersCollection;
  userChangesCollection;
  console
  return
  entries;

  constructor() {
    if (MongoHandler._instance) {
      return MongoHandler._instance
    }
    console.log('Creating MongoDB Instance');
    MongoHandler._instance = this;
  }

  async init() {
    console.log('Attempting to connect..');
    const requiredCollections = ["costs", "users", "userchanges"];
    try {
      this.MongoClient = new MongoClient(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@${process.env.mongoCluster}/test?retryWrites=true&w=majority`);
      await this.MongoClient.connect();
      console.log('Connection Successful');
      this.DB = this.MongoClient.db('AsyncCourse')
      console.log('AsyncCourse DB Loaded');
      const collectionsList = await this.DB.listCollections().toArray()
      const collectionNames = collectionsList.map(collectionObj => collectionObj.name);
      for (const collection of requiredCollections) {
        if (collectionNames.includes(collection)) {
          console.log(`Found existing collection: ${collection}`);
        } else {
          console.log(`Collection ${collection} not found. Creating...`)
          try {
            await this.DB.createCollection(collection)
            console.log(`Collection ${collection} successfully created`);
          } catch (error) {
            console.log(`Error: Unable to create collection ${collection}`);
          }
        }
      }
      this.costsCollection = this.DB.collection("costs");
      this.usersCollection = this.DB.collection("users");
      this.userChangesCollection = this.DB.collection("userchanges");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getClient() {
    return this.MongoClient;
  }

  async fetchUser(username) {
    return await this.usersCollection.findOne({ username });
  }

  async updateUser(username, data) {
    const findBy = { username };
    const dataToUpdate = { $set: data };
    this.usersCollection.updateOne(findBy, dataToUpdate, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(`Updated user record of ${username} with:`);
      console.log(data);
    });
  }

  async createUser(userData) {
    const { username } = userData;
    const userExists = await this.fetchUser(username);
    if (userExists) {
      return {
        success: false,
        error: 'Username already exists'
      }
    }
    await this.usersCollection.insertOne(userData)
    console.log(`DB | New user ${username} created successfully`);
    return {
      success: true,
    }
  }

  async insertToCosts(entry) {
    const objectId = await this.costsCollection.insertOne(entry);
    console.log(`DB | ${entry.category} entry for ${entry.username} inserted successfully`)
    return objectId;
  }

  async getFromCosts(username) {
    const entries = await this.costsCollection.find({ username }).toArray();
    console.log(`DB | Fetched all expenses of ${username}`)
    return entries;
  }

  async getFromCostsByCategory(username, category) {
    const entries = await this.costsCollection.find({ username, category }).toArray();
    console.log(`DB | Fetched expenses of ${username} with filter 'Category: ${category}'`)
    return entries;
  }


  async getFromCostsByTimeRange(username, startDay, endDay) {
    const entries = await this.costsCollection.find({
      username,
      timestamp: {
        $gte: startDay.toISOString(),
        $lt: endDay.toISOString(),
      }
    }).toArray();
    console.log(`DB | Fetched all ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(endDay)} expenses of ${username}`)
    return entries;
  }


  async removeFromCosts(id, username) {
    const _id = new ObjectId(id);
    const collectionFound = await this.costsCollection.find({ username, _id }).toArray();
    if (collectionFound) {
      const { acknowledged, deletedCount } = await this.costsCollection.deleteOne({ username, _id });
      if (acknowledged && deletedCount) {
        console.log(`DB | Removed expense of ${username}`)
        return { success: true };
      }
      return { success: false, error: 'Unable to delete entry' }
    }
    return { success: false, error: 'Unable to find entry' }
  }
}

export default MongoHandler;
