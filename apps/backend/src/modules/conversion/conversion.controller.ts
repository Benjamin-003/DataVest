import { Request, Response, NextFunction } from 'express';
import { conversionService } from './conversion.service';

const getUserId = (req: Request): string => req.user!.id;
const getParamId = (req: Request): string => req.params.id as string;

export const conversionController = {

  async create(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileName, xmlContent } = req.body;
    const user = req.user!;
    const userName = `${user.firstName}_${user.lastName}`;
    const conversion = await conversionService.create(getUserId(req), fileName, xmlContent, userName);
    res.status(201).json(conversion);
  } catch (err) {
    next(err);
  }
},

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const conversions = await conversionService.findAllByUser(getUserId(req));
      res.status(200).json(conversions);
    } catch (err) {
      next(err);
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const conversion = await conversionService.findOneByUser(getUserId(req), getParamId(req));
      res.status(200).json(conversion);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await conversionService.delete(getUserId(req), getParamId(req));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};