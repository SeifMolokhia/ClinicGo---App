const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/doctorController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public — read
router.get('/',    list);
router.get('/:id', getById);

// Admin only — write
router.post('/',      protect, requireAdmin, create);
router.put('/:id',    protect, requireAdmin, update);
router.delete('/:id', protect, requireAdmin, remove);

module.exports = router;
