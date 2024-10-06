const express = require('express');
const {
  createUser,
  getUser,
  withdraw,
} = require('../controllers/userController');
const router = express.Router();

router.post('/create', createUser);
router.get('/:walletAddress', getUser);
router.post('/withdraw', withdraw);

module.exports = router;
