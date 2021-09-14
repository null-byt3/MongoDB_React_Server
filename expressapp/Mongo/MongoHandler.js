import { MongoClient, ObjectId } from 'mongodb';

class MongoHandler {
  DB;
  MongoClient;
  costsCollection;
  usersCollection;
  userChangesCollection;

  constructor() {
    if (MongoHandler._instance) {
      console.log('Using existing MongoDB instance');
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

      console.log('AsyncCourse DB Loaded');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


  getClient() {
    return this.MongoClient;
  }

  async fetchUser(userName) {
    return await this.usersCollection.findOne({ userName });
  }

  async updateUser(userName, data) {
    const findBy = { userName };
    const dataToUpdate = { $set: data };
    this.usersCollection.updateOne(findBy, dataToUpdate, (err, res) => {
      if (err) throw err;
      console.log(`Updated user record of ${userName} with:`);
      console.log(data);
    });
  }

  async insertToCosts(entry) {
    const objectId = await this.costsCollection.insertOne(entry);
    console.log(`DB | ${entry.type} entry for ${entry.username} inserted successfully`)
    return objectId;
  }

  async getFromCostsByUsername(username) {
    const entries = await this.costsCollection.find({ username }).toArray();
    return entries;
  }

  async removeFromCosts(id, username) {
    const _id = new ObjectId(id);
    const collectionFound = await this.costsCollection.find({ username, _id }).toArray();


    if (collectionFound) {
      const { acknowledged, deletedCount } = await this.costsCollection.deleteOne({ username, _id });
      if (acknowledged && deletedCount) {
        return { success: true };
      }
      return { success: false, error: 'Unable to delete entry' }
    }
    return { success: false, error: 'Unable to find entry' }
  }

  async closeConnection() {
    await this.MongoClient.close();
  }

  isConnectedToDB() {
    return !!( this.MongoClient && this.DB );
  }
}

export default MongoHandler;
// module.exports = MongoHandler;