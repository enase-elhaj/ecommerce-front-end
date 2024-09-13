import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { GET_PRODUCTS } from '../GraphQl/queries/getProducts';
import { GET_ITEMS } from '../GraphQl/queries/getItems';
import { PLACE_ORDER } from '../GraphQl/mutations/placeOrder';
import './CartOverlay.css';
import { graphql } from '@apollo/client/react/hoc';


// Apollo Client Setup
const client = new ApolloClient({
  uri: 'http://localhost/scandiweb-ecommerce/public/index.php', //GraphQL endpoint
  cache: new InMemoryCache(),
});

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      cartTotal: 0,
      attributesMap: {},
      productData: [],
      itemData: [],
      //////
      isCartOverlayOpen: true,
    };
  }

  componentDidMount() {
    const storedItems = JSON.parse(localStorage.getItem('cart')) || [];
    this.setState({ cartItems: storedItems });
    this.calculateCartTotal(storedItems);

    this.fetchData();

    ////
    this.updateItemCount(); // Call the function to update the item count
  }
  ///////////
  componentDidUpdate(prevProps, prevState) {
    if (prevState.cartItems !== this.state.cartItems) {
      this.updateItemCount(); // Update item count whenever cart changes
    }
  }
  //////////

  fetchData = async () => {
    try {
      const productResult = await client.query({ query: GET_PRODUCTS });
      const itemsResult = await client.query({ query: GET_ITEMS });

      if (Array.isArray(productResult.data.getProducts)) {
        this.setState({ productData: productResult.data.getProducts });
      }

      if (Array.isArray(itemsResult.data.getItems)) {
        this.setState({ itemData: itemsResult.data.getItems });
      }

      const newAttributesMap = {};
      const { cartItems } = this.state;
      cartItems.forEach((item) => {
        const filteredItems = itemsResult.data.getItems.filter(
          (i) => i.product_id === item.product_id
        );
        newAttributesMap[item.product_id] = {};
        filteredItems.forEach((i) => {
          if (!newAttributesMap[item.product_id][i.attribute_name]) {
            newAttributesMap[item.product_id][i.attribute_name] = new Set();
          }
          newAttributesMap[item.product_id][i.attribute_name].add(i.valuex);
        });
      });
      this.setState({ attributesMap: newAttributesMap });
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  calculateCartTotal = (items) => {
    const total = items.reduce((acc, item) => {
      const itemTotal = parseFloat(item.price) * (item.quantity || 1);
      return acc + itemTotal;
    }, 0);
    this.setState({ cartTotal: total });
  };

  increaseQuantity = (index) => {
    const updatedItems = [...this.state.cartItems];
    updatedItems[index].quantity = (updatedItems[index].quantity || 1) + 1;
    this.setState({ cartItems: updatedItems });
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    this.calculateCartTotal(updatedItems);
  };

  decreaseQuantity = (index) => {
    const updatedItems = [...this.state.cartItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
    } else if (updatedItems[index].quantity === 1) {
      updatedItems.splice(index, 1);
    }
    this.setState({ cartItems: updatedItems });
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    this.calculateCartTotal(updatedItems);
  };

  handleAttributeSelect = (index, attributeName, value) => {
    const updatedItems = [...this.state.cartItems];
    updatedItems[index].attributes = {
      ...updatedItems[index].attributes,
      [attributeName]: value,
    };
    this.setState({ cartItems: updatedItems });
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  handlePlaceOrder = async () => {
    const { cartItems } = this.state;
    const { mutate } = this.props; // Apollo mutation function injected via HoC
  
    try {
      // Ensure cartItems exist and contain necessary information
      if (!cartItems || cartItems.length === 0) {
        console.error('No items in cart to place an order');
        return;
      }
  
      // Iterate through cart items to construct orders
      for (const item of cartItems) {
        const product_id = item.product_id || ''; // Default to an empty string if not available
        const attributes = JSON.stringify(item.attributes || {}); // Stringify attributes for JSON format
        const product_price = item.price ? item.price.toString() : '0'; // Convert price to string
        const quantity = item.quantity ? parseInt(item.quantity, 10) : 1; // Ensure quantity is an integer
  
        console.log('Placing order with variables:', {
          product_id,
          attributes,
          product_price,
          quantity,
        });
  
        // Check if all required variables are present
        if (product_id && attributes && product_price && quantity) {
          try {
            // Call the mutation and pass the necessary variables
            const response = await mutate({
              mutation: PLACE_ORDER, // Mutation query imported from GraphQL setup
              variables: {
                product_id,
                attributes,
                product_price,
                quantity,
              },
            });
  
            // Log the response from the mutation
            console.log('Order placed successfully:', response.data.placeOrder);
          } catch (error) {
            console.error('Error placing order:', error.message);
          }
        } else {
          console.error('Missing required fields in order:', { product_id, attributes, product_price, quantity });
        }
      }
  
      // Clear cart after placing order
      this.setState({ cartItems: [] });
      localStorage.removeItem('cart');
      this.setState({ cartTotal: 0 });
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };

  calculateTotalItemCount = () => {
    const { cartItems } = this.state;
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

updateItemCount = () => {
    const totalItemCount = this.calculateTotalItemCount();
    if (this.props.onItemCountChange) {
      this.props.onItemCountChange(totalItemCount); // Pass the item count to the parent
    }
  };

  toggleCartOverlay = () => {
    this.setState({ isCartOverlayOpen: !this.state.isCartOverlayOpen });
  };
  
  render() {
    const { cartItems, cartTotal, attributesMap, productData, isCartOverlayOpen } = this.state;
    //////
    const isCartEmpty = cartItems.length === 0; // Check if the cart is empty

    return (
      <>
      {/* Conditionally render the background overlay */}
      {isCartOverlayOpen && <div className="background-overlay" 
      onClick={this.toggleCartOverlay}></div>}

      {/* container of attributes options */}
      <div data-testid='cart-item-attribute-${attribute name in kebab case}' className={`cart-overlay ${isCartOverlayOpen ? 'open' : 'closed'}`}>

         <div data-testid='cart-item-amount' >My Bag, {this.calculateTotalItemCount()} items</div>
        {cartItems.length === 0 ? (
          <p>No items in the cart</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="item-details">
                <p className="attribute-options">
                  {productData.find((p) => p.product_id === item.product_id)
                    ?.product_name || 'Unknown Product'}
                </p>
                <p className="attribute-options">${item.price} USD</p>
                  {/* attribute options */}
                <div className="attribute-options" 
                data-testid='cart-item-attribute-${attribute name in kebab case}-${attribute name in kebab case}' >
                  {attributesMap[item.product_id] &&
                    Object.entries(attributesMap[item.product_id]).map(
                      ([attributeName, values]) => (
                        <div key={attributeName}>
                          <strong>{attributeName}:</strong>
                          <div className="attribute-values">
                            {Array.from(values).map((value) => (
                              // selected
                              <span data-testid='cart-item-attribute-${attribute name in kebab case}-${attribute name in kebab case}-selected' 
                                key={value}
                                className="attribute-box"
                                style={{
                                  width:
                                    attributeName === 'Color' ? '20px' : 'auto',
                                  height:
                                    attributeName === 'Color' ? '20px' : 'auto',
                                  backgroundColor:
                                    attributeName === 'Color'
                                      ? value
                                      : 'transparent',
                                  padding:
                                    attributeName === 'Color' ? '0' : '5px',
                                  margin: '2px',
                                  display: 'inline-block',
                                  textAlign: 'center',
                                  lineHeight:
                                    attributeName === 'Color' ? '20px' : 'auto',
                                  cursor: 'pointer',
                                  border:
                                    item.attributes[attributeName] === value
                                      ? '2px solid green'
                                      : '1px solid #ccc',
                                }}
                                onClick={() =>
                                  this.handleAttributeSelect(
                                    index,
                                    attributeName,
                                    value
                                  )
                                }
                              >
                                {attributeName === 'Color' ? '' : value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>

              <div className="item-quantity">
                <button data-testid='cart-item-amount-increase' onClick={() => this.increaseQuantity(index)}>+</button>
                <span>{item.quantity || 1}</span>
                <button data-testid='cart-item-amount-decrease' onClick={() => this.decreaseQuantity(index)}>-</button>
              </div>

              <div className="item-image">
                <img
                  src={item.image_1 || 'placeholder.jpg'}
                  alt={item.product_id}
                  style={{ width: '121px', height: '167px' }}
                />
              </div>
            </div>
          ))
        )}

        <div data-testid='cart-total' className="total">
          <strong>Total for Cart: ${cartTotal.toFixed(2)} USD</strong>
        </div>

        <div>
          <button className={`btn-green ${isCartEmpty ? 'disabled' : ''}`} // Apply disabled class when cart is empty
           onClick={this.handlePlaceOrder} disabled={isCartEmpty} // Disable button if cart is empty 
           >Place Order</button>
        </div>
      </div>
      </>
    );
  }
}

export default graphql(PLACE_ORDER)(
  graphql(GET_ITEMS)(
    graphql(GET_PRODUCTS)(CartOverlay)
  )
);
