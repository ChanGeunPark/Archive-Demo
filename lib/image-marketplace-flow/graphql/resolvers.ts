import { getWorkById, listWorks } from "../repository";

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
  },
};
