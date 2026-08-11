import express from 'express';

import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/users.controller.js';

const router = express.Router();

router.get('/', authenticate, requireRole('admin'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUserById);
router.delete('/:id', authenticate, deleteUserById);

export default router;
