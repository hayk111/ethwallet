const express = require('express');
const {
  createUser,
  getUser,
  deposit,
  withdraw,
} = require('../controllers/userController');
const router = express.Router();

router.post('/create', createUser);
router.get('/:walletAddress', getUser);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);

module.exports = router;
