const express = require('express');
const { book, listMine, cancel } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All appointment routes require authentication
router.use(protect);

router.post('/',      book);
router.get('/',       listMine);
router.delete('/:id', cancel);

module.exports = router;
