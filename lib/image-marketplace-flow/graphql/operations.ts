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
