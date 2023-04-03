const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('startup').collection('user');
const resultCollection = client.db('startup').collection('result');
const movieCollection = client.db('startup').collection('movies');

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

function addResult(result) {
  resultCollection.insertOne(result);
}

function getRecentVotes() {
  const query = {};
  const options = {
    sort: { date: -1 },
    limit: 10,
  };
  const cursor = resultCollection.find(query, options);
  console.log(cursor)
  return cursor.toArray();
}

function getMovies(){
  const query = {};
  const pipeline = [
    { $match: {} },
    { $sample: { size: 3 } },];
  return movieCollection.aggregate(pipeline).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addResult,
  getRecentVotes,
  getMovies,
};
