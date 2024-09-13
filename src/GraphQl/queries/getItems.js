import { gql } from '@apollo/client';

export const GET_ITEMS = gql`
query {
  getItems {
    item_id
    attribute_name
    product_id
    display_value
    valuex  
  }
}
`;