import express from 'express';

import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/users.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;
