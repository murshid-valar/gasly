import { z } from 'zod';
import { router, procedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const appRouter = router({
  getCylinders: procedure.query(async () => {
    return prisma.cylinder.findMany();
  }),
  createCylinder: procedure
    .input(z.object({
      type: z.string(),
      capacity: z.number(),
      status: z.string(),
      location: z.string().optional(),
      customerId: z.string().optional(),
      industryId: z.string().optional(),
      purchaseDate: z.date().optional(),
      lastRefillDate: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      return prisma.cylinder.create({ data: input });
    }),
  updateCylinder: procedure
    .input(z.object({
      id: z.string(),
      type: z.string().optional(),
      capacity: z.number().optional(),
      status: z.string().optional(),
      location: z.string().optional(),
      customerId: z.string().optional(),
      industryId: z.string().optional(),
      purchaseDate: z.date().optional(),
      lastRefillDate: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.cylinder.update({
        where: { id },
        data,
      });
    }),
  deleteCylinder: procedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return prisma.cylinder.delete({
        where: { id: input },
      });
    }),
});

export type AppRouter = typeof appRouter;