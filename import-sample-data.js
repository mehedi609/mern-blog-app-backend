require('dotenv').config();
const fs = require('fs');
const User = require('./model/User');
const { dbConnect } = require('./config');
const { Category, Post } = require('./model');

dbConnect();

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/sample-data/users.json`, 'utf-8'),
);
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/sample-data/categories.json`, 'utf-8'),
);
const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/sample-data/posts.json`, 'utf-8'),
);

async function importData() {
  try {
    await User.create(users);
    await Category.create(categories);
    await Post.create(posts);
    console.log('Data imported successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

async function deleteData() {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Post.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

console.log(process.argv[2]);

const flag = process.argv[2].split('--')[1];
console.log(flag);

if (flag === 'import') {
  importData();
} else if (flag === 'delete') {
  deleteData();
}
