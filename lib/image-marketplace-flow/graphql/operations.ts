import { gql } from "@apollo/client";

export const WORKS_QUERY = gql`
  query Works {
    works {
      id
      title
      imageUrl
      width
      height
      listingStatus
      askingPrice
      owner {
        id
        name
        handle
        avatar
      }
    }
  }
`;

export const USER_QUERY = gql`
  query MarketplaceUser($id: ID!) {
    user(id: $id) {
      id
      name
      handle
      avatar
    }
  }
`;

export const CREATE_WORK_MUTATION = gql`
  mutation CreateWork(
    $id: ID!
    $title: String!
    $description: String
    $imageUrl: String!
    $imageId: String
    $width: Int
    $height: Int
    $tags: [String!]
    $creatorId: ID!
    $ownerId: ID
    $askingPrice: Int
    $allowOffers: Boolean
    $usageRights: [UsageRightInput!]
  ) {
    createWork(
      id: $id
      title: $title
      description: $description
      imageUrl: $imageUrl
      imageId: $imageId
      width: $width
      height: $height
      tags: $tags
      creatorId: $creatorId
      ownerId: $ownerId
      askingPrice: $askingPrice
      allowOffers: $allowOffers
      usageRights: $usageRights
    ) {
      id
      title
      imageUrl
      listingStatus
      askingPrice
    }
  }
`;

export const WORK_DETAIL_QUERY = gql`
  query WorkDetail($id: ID!) {
    work(id: $id) {
      id
      title
      description
      imageUrl
      width
      height
      tags
      listingStatus
      ownershipStatus
      askingPrice
      lastSalePrice
      offerCount
      usageRights {
        label
        enabled
      }
      creator {
        id
        name
        handle
        avatar
      }
      owner {
        id
        name
        handle
        avatar
      }
      offers {
        id
        amount
        status
        createdAt
        bidder {
          id
          name
          handle
          avatar
        }
      }
    }
  }
`;

export const DELETE_WORK_MUTATION = gql`
  mutation DeleteWork($id: ID!) {
    deleteWork(id: $id)
  }
`;

export const BUY_WORK_MUTATION = gql`
  mutation BuyWork($workId: ID!, $price: Int!, $buyerId: ID!) {
    buyWork(workId: $workId, price: $price, buyerId: $buyerId) {
      type
      workId
      newOwnerId
      transactionId
      occurredAt
    }
  }
`;

export const CREATE_OFFER_MUTATION = gql`
  mutation CreateOffer($workId: ID!, $amount: Int!, $bidderId: ID!) {
    createOffer(workId: $workId, amount: $amount, bidderId: $bidderId) {
      id
      amount
      status
      createdAt
      bidder {
        id
        name
        handle
        avatar
      }
    }
  }
`;

export const ACCEPT_OFFER_MUTATION = gql`
  mutation AcceptOffer($workId: ID!, $offerId: ID!, $ownerId: ID!) {
    acceptOffer(workId: $workId, offerId: $offerId, ownerId: $ownerId) {
      type
      workId
      newOwnerId
      transactionId
      occurredAt
    }
  }
`;

export const UPDATE_USER_AVATAR_MUTATION = gql`
  mutation UpdateUserAvatar($userId: ID!, $avatarUrl: String!) {
    updateUserAvatar(userId: $userId, avatarUrl: $avatarUrl) {
      id
      name
      handle
      avatar
    }
  }
`;
