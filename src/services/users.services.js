import logger from '#config/logger.js';

import { users } from '#models/user.model.js';

import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';

export const fetchUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUser = async userId => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
  } catch (e) {
    logger.error('Error getting user', e);
    throw e;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    return await db
      .update(users)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });
  } catch (e) {
    logger.error('Error updating user', e);
    throw e;
  }
};

export const deleteUser = async userId => {
  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (e) {
    logger.error('Error updating user', e);
    throw e;
  }
};
