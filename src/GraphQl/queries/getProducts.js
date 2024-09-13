import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
query {
  getProducts {
    product_id
    product_name
    product_description
    category
    brand
    product_price
    inStock
    attribute_1
    attribute_2
    attribute_3
    image_1
    image_2
    image_3
    image_4
    image_5
    image_6
    image_7
    
  }
 
}
`;