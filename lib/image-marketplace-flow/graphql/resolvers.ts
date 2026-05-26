import {
  createWork,
  deleteWork as deleteWorkFromRepository,
  getWorkById,
  listWorks,
} from "../repository";
import type { CreateWorkInput } from "../repository";

export const resolvers = {
  Query: {
    works: () => listWorks(),
    work: (_parent: unknown, args: { id: string }) => getWorkById(args.id),
  },
  Mutation: {
    buyWork: () => {
      throw new Error("buyWork mutation is not implemented yet.");
    },
    createOffer: () => {
      throw new Error("createOffer mutation is not implemented yet.");
    },
    acceptOffer: () => {
      throw new Error("acceptOffer mutation is not implemented yet.");
    },
    createWork: (_parent: unknown, args: CreateWorkInput) => createWork(args),
    deleteWork: async (_parent: unknown, args: { id: string }) => {
      const result = await deleteWorkFromRepository(args.id);
      if (!result.success) {
        throw new Error(result.error ?? "Failed to delete work.");
      }
      return true;
    },
  },
};
