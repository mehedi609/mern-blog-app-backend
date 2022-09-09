const express = require('express');
const { getAllUsers, removeUser } = require('../controllers/user-controller');
const { validateMongodbId } = require('../middlewares');

const router = express.Router();

router.get('/', getAllUsers);
router.delete('/:id', validateMongodbId, removeUser);

module.exports = { userRoutes: router };
