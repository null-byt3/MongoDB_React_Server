import { MongoClient } from 'mongodb';

class MongoHandler {
  DB;
  MongoClient;

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
    try {
      this.MongoClient = new MongoClient(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@${process.env.mongoCluster}/test?retryWrites=true&w=majority`);
      await this.MongoClient.connect();
      console.log('Connection Successful');
      this.DB = this.MongoClient.db('AsyncCourse')
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
    return await this.DB.collection("users").findOne({ userName });
  }

  async updateUser(userName, data) {
    const findBy = { userName };
    const dataToUpdate = { $set: data };
    this.DB.collection("users").updateOne(findBy, dataToUpdate, (err, res) => {
      if (err) throw err;
      console.log(`Updated user record of ${userName} with:`);
      console.log(data);
    });
  }

  async insertEntryToCollection(collection, entry) {
    const collectionsList = await this.DB.listCollections().toArray()
    const collectionNames = collectionsList.map(collectionObj => collectionObj.name)
    if (collectionNames.includes(collection)) {
      const objectId = await this.DB.collection("users").insertOne(entry);
      console.log(`DB | ${entry.type} entry for ${entry.username} inserted successfully`)
      return objectId;
    }
    console.log('FAILURE');
    return {
      success: false,
      error: 'Unable to insert to collection',
    }
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