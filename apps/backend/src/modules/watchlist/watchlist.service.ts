import { prisma } from '../../prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { AddItemInput } from './watchlist.schema';

export const watchlistService = {

  async findAll(userId: string) {
    return prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async addItem(userId: string, data: AddItemInput) {
    const existing = await prisma.watchlistItem.findUnique({
      where: { userId_symbol: { userId, symbol: data.symbol } },
    });
    if (existing) {
      throw new AppError(409, `${data.symbol} est déjà dans votre watchlist`);
    }
    return prisma.watchlistItem.create({
      data: { userId, ...data },
    });
  },

  async removeItem(userId: string, itemId: string) {
    const item = await prisma.watchlistItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.userId !== userId) {
      throw new AppError(404, 'Item introuvable');
    }
    return prisma.watchlistItem.delete({ where: { id: itemId } });
  },
};