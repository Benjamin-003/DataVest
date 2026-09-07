import { prisma } from '../../prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { priceService } from './price.service';
import { AddPositionInput } from './portfolio.schema';

export const portfolioService = {

  // Récupère toutes les positions avec les prix actuels
  async findAll(userId: string) {
    const positions = await prisma.position.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (positions.length === 0) return [];

    // Récupère tous les prix en une seule passe
    const symbols = [...new Set(positions.map(p => p.symbol))];
    const prices  = await priceService.getPrices(symbols);

    // Calcule les métriques pour chaque position
    return positions.map(position => {
      const currentPrice = prices[position.symbol] ?? null;
      const value        = currentPrice ? currentPrice * position.quantity : null;
      const cost         = position.buyPrice * position.quantity;
      const pnl          = value !== null ? value - cost : null;
      const pnlPercent   = pnl !== null ? (pnl / cost) * 100 : null;

      return {
        id:           position.id,
        symbol:       position.symbol,
        name:         position.name,
        quantity:     position.quantity,
        buyPrice:     position.buyPrice,
        currentPrice,
        value,
        cost,
        pnl,
        pnlPercent,
        createdAt:    position.createdAt,
      };
    });
  },

  async addPosition(userId: string, data: AddPositionInput) {
    return prisma.position.create({
      data: { userId, ...data },
    });
  },

  async removePosition(userId: string, positionId: string) {
    const position = await prisma.position.findUnique({
      where: { id: positionId },
    });
    if (!position || position.userId !== userId) {
      throw new AppError(404, 'Position introuvable');
    }
    return prisma.position.delete({ where: { id: positionId } });
  },
};