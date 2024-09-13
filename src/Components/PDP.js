import React, { Component } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useParams } from 'react-router-dom';
import './PDP.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GET_PRODUCTS } from '../GraphQl/queries/getProducts';
import { GET_ITEMS } from '../GraphQl/queries/getItems';

// Apollo Client Setup
const client = new ApolloClient({
  uri: 'http://localhost/scandiweb-ecommerce/public/index.php', // GraphQL endpoint
  cache: new InMemoryCache(),
});

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      product: null,
      selectedImage: null,
      items: [], // Holds items data
      selectedAttributes: {}, // Stores selected attributes
    };
  }

  async componentDidMount() {
    const { productId } = this.props.params; // Get productId from URL
    try {
      // Fetch product data
      const productResult = await client.query({
        query: GET_PRODUCTS,
      });

      const fetchedProduct = productResult.data.getProducts.find(p => p.product_id === productId);
      if (fetchedProduct) {
        this.setState({
          product: fetchedProduct,
          selectedImage: fetchedProduct.image_1, // Set default selected image
        });
      } else {
        this.setState({ error: 'No product found' });
      }

      // Fetch items data
      const itemsResult = await client.query({
        query: GET_ITEMS,
      });
      const filteredItems = itemsResult.data.getItems.filter(item => item.product_id === productId);
      this.setState({ items: filteredItems, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  handleImageClick = (image) => {
    this.setState({ selectedImage: image }); // Update selected image on click
  };

  handleAttributeSelect = (attributeName, item) => {
    this.setState(prevState => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: item.valuex, // Update selected attribute value
      }
    }));
  };

  handleAddToCart = () => {
    const { product, selectedAttributes } = this.state;
    const cartItem = {
      product_id: product.product_id,
      attributes: selectedAttributes,
      price: product.product_price,
      image_1: product.image_1, // Add image_1 to the cart item
    };

    // Store the cart item in local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Item added to cart:', cartItem);
  };

  render() {
    const { loading, error, product, selectedImage, items, selectedAttributes } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No product found</p>;

    const images = [
      product.image_1,
      product.image_2,
      product.image_3,
      product.image_4,
      product.image_5,
      product.image_6,
      product.image_7,
    ];

    return (
      <div className="container pdp-container">
        <div className="row">
          {/* First Column: Thumbnail Images */}
          <div data-testid="product-gallery" className="col-md-2 pdp-column-thumbnails">
            {images.map((image, index) => (
              image && (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="pdp-thumbnail-image"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => this.handleImageClick(image)} // Change the main image on click
                />
              )
            ))}
          </div>

          {/* Second Column: Main Image */}
          <div className="col-md-6 pdp-column-main-image">
            <img
              src={selectedImage}
              alt="Main Product"
              className="pdp-main-image"
              style={{ width: '575px', height: '478px', objectFit: 'contain' }}
            />
          </div>

          {/* Third Column: Product Details */}
          <div className="col-md-4 pdp-column-details" style={{ width: '330px', height: '541px' }}>
            <h1 className="pdp-title">{product.product_name}</h1>

            {/* Display Product Attributes */}
            <div data-testid={`product-attribute-${selectedAttributes}`} className="pdp-info">
              {items.length > 0 ? (
                <div>
                  {Object.keys(
                    items.reduce((acc, item) => {
                      const attribute = acc[item.attribute_name] || [];
                      attribute.push(item.display_value);
                      acc[item.attribute_name] = attribute;
                      return acc;
                    }, {})
                  ).map((attributeName, index) => (
                    <div key={index} className="pdp-attribute-group">
                      <strong>{attributeName}:</strong>
                      <div className="pdp-attribute-values">
                        {items
                          .filter(item => item.attribute_name === attributeName)
                          .map(item => (
                            <span
                              key={item.item_id}
                              className="pdp-attribute-value-box"
                              style={{
                                width: attributeName === "Color" ? "32px" : "63px",
                                height: attributeName === "Color" ? "32px" : "45px",
                                backgroundColor: attributeName === "Color" ? item.valuex : selectedAttributes[attributeName] === item.valuex ? "darkgray" : "transparent",
                                border: attributeName === "Color" && selectedAttributes[attributeName] === item.valuex ? "2px solid green" : "1px solid #ccc",
                                padding: "5px",
                                margin: "2px",
                                display: "inline-block",
                                color: attributeName === "Color" ? "#fff" : "#000",
                                textAlign: "center",
                                lineHeight: attributeName === "Color" ? "32px" : "45px",
                                cursor: 'pointer', // Add pointer for better UX
                              }}
                              onClick={() => this.handleAttributeSelect(attributeName, item)} // Update selected attribute on click
                            >
                              {attributeName === "Color" ? "" : item.valuex}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No items found</p>
              )}
            </div>

            {/* Price Section */}
            <div className="pdp-attribute-group">
              <strong>PRICE:</strong>
              <div className="pdp-attribute-values">
                <strong>${product.product_price} USD</strong>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button data-testid="add-to-cart" className="btn btn-green mb-3" onClick={this.handleAddToCart}>Add to Cart</button>

            {/* Product Description */}
            <div data-testid="product-description" className="pdp-info">
              <p>{product.product_description}</p>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

// Higher-Order Component to pass route params to the class component
const PDPWithParams = (props) => {
  const params = useParams();
  return <PDP {...props} params={params} />;
};

export default PDPWithParams;
