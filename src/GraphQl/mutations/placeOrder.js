import { gql } from '@apollo/client';
export const PLACE_ORDER = gql`
  mutation PlaceOrder($product_id: String, $attributes: String, $product_price: String, $quantity: Int) {
    placeOrder(
      product_id: $product_id
      attributes: $attributes
      product_price: $product_price
      quantity: $quantity
    ) {
      order_id
      product_id
      attributes
      product_price
      quantity
    }
  }
`;



