import logger from '#config/logger.js';

import {
  deleteUser,
  fetchUsers,
  getUser,
  updateUser,
} from '#services/users.services.js';

import { formatValidationError } from '#utils/format.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

const validateId = async id => {
  const paramsResult = userIdSchema.safeParse(id);

  if (!paramsResult.success) {
    return {
      error: 'Invalid user id',
      details: formatValidationError(paramsResult.error),
    };
  }

  return paramsResult.data;
};

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await fetchUsers();

    logger.info('Successfully retrieved all users');
    res.status(200).json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error('Error fetching users', e);
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id, error, details } = validateId(req.params.id);

    if (error || details) {
      return res.status(400).json({
        error,
        details,
      });
    }

    const user = await getUser(id);

    if (!user) {
      logger.warn(`User ${id} not found!`);
      return res.status(404).json({ message: `User ${id} not found!` });
    }

    logger.info('Successfully retrieved user with id: ', id);
    res.status(200).json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (e) {
    logger.error('Error fetching user', e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { id, error, details } = validateId(req.params.id);

    if (error || details) {
      return res.status(400).json({
        error,
        details,
      });
    }

    const bodyResult = updateUserSchema.safeParse(req.body);

    if (!bodyResult.success) {
      return res.status(400).json({
        error: 'Invalid update data',
        details: formatValidationError(bodyResult.error),
      });
    }

    const exsitingUser = await getUser(id);

    if (!exsitingUser) {
      logger.warn(`User ${id} not found!`);
      return res.status(404).json({ message: `User ${id} not found!` });
    }

    // --- Authorization ---
    // Only the account owner or an admin may update this user.
    const isSelf = req.user.id === id;
    const isAdmin = req.user.role === 'admin';

    if (!isSelf && !isAdmin) {
      return res
        .status(403)
        .json({ error: 'Forbidden: you can only update your own account' });
    }

    // Only an admin may change a role.
    if (bodyResult.data.role && !isAdmin) {
      return res
        .status(403)
        .json({ error: 'Forbidden: only admins can change roles' });
    }

    const updatedUser = await updateUser(id, bodyResult.data);

    logger.info(`User ${id} updated successfully`);
    res.status(200).json({
      message: `User ${id} updated successfully`,
      updatedUser,
    });
  } catch (e) {
    logger.error('Error getting user', e);
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id, error, details } = validateId(req.params.id);

    if (error || details) {
      return res.status(400).json({
        error,
        details,
      });
    }

    const exsitingUser = await getUser(id);

    if (!exsitingUser) {
      logger.warn(`User ${id} not found!`);
      return res.status(404).json({ message: `User ${id} not found!` });
    }

    await deleteUser(id);

    logger.info(`User ${id} deleted successfully`);
    res.status(200).json({
      message: `User ${id} deleted successfully`,
    });
  } catch (e) {
    logger.error('Error deleting user', e);
    next(e);
  }
};
