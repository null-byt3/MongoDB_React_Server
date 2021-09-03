import MongoWrapper from './MongoWrapper.js';
import express from 'express';
const app = express()
const port = 80


async function runApp() {
  const mongoClient = new MongoWrapper('Sebastian', 's8542361', 'cluster0.hvknw.mongodb.net');
  const connectedClient = await mongoClient.getClient();
  const database = connectedClient.db('sample_mflix');
  const movies = database.collection('movies');
  const query = { title: 'Back to the Future' };
  const movie = await movies.findOne({ title: 'Back to the Future' });
  console.log(movie);
}







app.get('/', (req, res) => {
  res.send(makeHTML(movies));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// async function run() {
//   try {
//     await client.connect();
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

runApp().catch((err) => {console.log(err)});