import { MongoClient } from "mongodb";


export default class MongoWrapper {
  constructor(username, password, cluster) {
    this.username = username,
    this.password = password,
    this.cluster = cluster,
    this.MongoClient = this.createMongoClient(username, password, cluster);
  }

  createMongoClient(username, password, cluster) {
    try {
      const client = new MongoClient(`mongodb+srv://${username}:${password}@${cluster}/myFirstDatabase?retryWrites=true&w=majority`);
      return client.connect();
    } catch(err) {
      throw err;
    }
  }

  getClient() {
    return this.MongoClient;
  }
}