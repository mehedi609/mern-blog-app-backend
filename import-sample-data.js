require('dotenv').config();
const fs = require('fs');
const User = require('./model/User');
const { dbConnect } = require('./config');

dbConnect();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/sample-data/user.json`, 'utf-8'),
);

async function importData() {
  try {
    await User.create(tours);
    console.log('Data imported successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

async function deleteData() {
  try {
    await User.deleteMany();
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
