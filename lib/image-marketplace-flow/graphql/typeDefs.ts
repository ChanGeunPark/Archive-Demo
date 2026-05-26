import { gql } from "@apollo/client";

export const typeDefs = gql`
  type MarketplaceUser {
    id: ID!
    name: String!
    handle: String!
    avatar: String
  }

  type Offer {
    id: ID!
    amount: Int!
    status: String!
    bidder: MarketplaceUser!
    createdAt: String!
  }

  type UsageRight {
    label: String!
    enabled: Boolean!
  }

  type Work {
    id: ID!
    title: String!
    description: String!
    imageUrl: String!
    imageId: String
    width: Int!
    height: Int!
    tags: [String!]!
    listingStatus: String!
    ownershipStatus: String!
    askingPrice: Int
    lastSalePrice: Int
    offerCount: Int!
    usageRights: [UsageRight!]!
    creator: MarketplaceUser!
    owner: MarketplaceUser!
    offers: [Offer!]!
  }

  type OwnershipTransferEvent {
    type: String!
    workId: ID!
    newOwnerId: ID!
    transactionId: String!
    occurredAt: String!
  }

  input UsageRightInput {
    label: String!
    enabled: Boolean!
  }

  type WorkEdge {
    cursor: String!
    node: Work!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type WorkConnection {
    edges: [WorkEdge!]!
    pageInfo: PageInfo!
    totalCount: Int
  }

  type Query {
    works(
      first: Int
      after: String
      query: String
      buyNowOnly: Boolean
    ): WorkConnection!
    work(id: ID!): Work
    user(id: ID!): MarketplaceUser
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
      id: ID
      title: String!
      description: String
      imageUrl: String!
      imageId: String
      width: Int
      height: Int
      tags: [String!]
      creatorId: ID!
      ownerId: ID
      askingPrice: Int
      allowOffers: Boolean
      usageRights: [UsageRightInput!]
    ): Work!
    deleteWork(id: ID!): Boolean!
    updateUserAvatar(userId: ID!, avatarUrl: String!): MarketplaceUser!
    updateAskingPrice(
      workId: ID!
      ownerId: ID!
      askingPrice: Int!
    ): Work!
  }
`;
