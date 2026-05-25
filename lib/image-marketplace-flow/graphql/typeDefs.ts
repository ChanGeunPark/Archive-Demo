import { gql } from "@apollo/client";

export const typeDefs = gql`
  type MarketplaceUser {
    id: ID!
    name: String!
    handle: String!
    avatar: String
  }

  type Work {
    id: ID!
    title: String!
    description: String!
    imageUrl: String!
    width: Int!
    height: Int!
    tags: [String!]!
    listingStatus: String!
    ownershipStatus: String!
    askingPrice: Int
    lastSalePrice: Int
    offerCount: Int!
    creator: MarketplaceUser!
    owner: MarketplaceUser!
    offers: [Offer!]!
  }

  type Offer {
    id: ID!
    amount: Int!
    status: String!
    bidder: MarketplaceUser!
    createdAt: String!
  }

  type OwnershipTransferEvent {
    type: String!
    workId: ID!
    newOwnerId: ID!
    transactionId: String!
    occurredAt: String!
  }

  type Query {
    works: [Work!]!
    work(id: ID!): Work
  }

  type Mutation {
    buyWork(workId: ID!, price: Int!, buyerId: ID!): OwnershipTransferEvent!
    createOffer(workId: ID!, amount: Int!, bidderId: ID!): Offer!
    acceptOffer(
      workId: ID!
      offerId: ID!
      ownerId: ID!
    ): OwnershipTransferEvent!
    createWork(
      title: String!
      description: String
      imageUrl: String!
      width: Int
      height: Int
      tags: [String!]
      creatorId: ID!
      ownerId: ID
      askingPrice: Int
      allowOffers: Boolean
    ): Work!
  }
`;
