import {
  acceptOffer as acceptOfferInRepository,
  buyWork as buyWorkInRepository,
  createOffer as createOfferInRepository,
  createWork,
  deleteWork as deleteWorkFromRepository,
  getUserById,
  getWorkById,
  listWorks,
  updateUserAvatar as updateUserAvatarInRepository,
  updateAskingPrice as updateAskingPriceInRepository,
} from "../repository";
import type { CreateWorkInput } from "../repository";

export const resolvers = {
  Query: {
    works: (
      _parent: unknown,
      args: {
        first?: number;
        after?: string;
        query?: string;
        buyNowOnly?: boolean;
        minPrice?: number;
        maxPrice?: number;
      },
    ) =>
      listWorks({
        first: args.first,
        after: args.after,
        query: args.query,
        buyNowOnly: args.buyNowOnly,
        minPrice: args.minPrice,
        maxPrice: args.maxPrice,
      }),
    work: (_parent: unknown, args: { id: string }) => getWorkById(args.id),
    user: (_parent: unknown, args: { id: string }) => getUserById(args.id),
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
    updateUserAvatar: (
      _parent: unknown,
      args: { userId: string; avatarUrl: string },
    ) => updateUserAvatarInRepository(args.userId, args.avatarUrl),
    updateAskingPrice: (
      _parent: unknown,
      args: { workId: string; ownerId: string; askingPrice: number },
    ) => updateAskingPriceInRepository(args),
  },
};
