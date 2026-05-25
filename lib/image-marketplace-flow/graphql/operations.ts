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
        avatar
      }
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
