import {
  acceptOffer as acceptOfferInRepository,
  buyWork as buyWorkInRepository,
  createOffer as createOfferInRepository,
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
    buyWork: (
      _parent: unknown,
      args: { workId: string; price: number; buyerId: string },
    ) => buyWorkInRepository(args),
    createOffer: (
      _parent: unknown,
      args: { workId: string; amount: number; bidderId: string },
    ) => createOfferInRepository(args),
    acceptOffer: (
      _parent: unknown,
      args: { workId: string; offerId: string; ownerId: string },
    ) => acceptOfferInRepository(args),
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
