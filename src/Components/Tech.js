import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import './Category.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GET_PRODUCTS } from '../GraphQl/queries/getProducts';

// Apollo Client Setup
const client = new ApolloClient({
  uri: 'http://localhost/scandiweb-ecommerce/public/index.php', // replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

class Tech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      products: [],
    };
  }

  componentDidMount() {
    // Fetch data when the component mounts
    client
      .query({
        query: GET_PRODUCTS,
      })
      .then(result => {
        this.setState({
          loading: false,
          products: result.data.getProducts,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  }

  render() {
    const { loading, error, products } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Filter products by category 
    const filteredProducts = products.filter(product => product.category === 'tech');

    return (
      <div>
        <div className="title-4 ml-5 mt-5 mb-5">Technology</div>
        <div className="row ml-5 row-custom-gap">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div className="col-md-4 mb-4 card-custom-gap" key={index}>
                <div className="card" style={{ width: '450px', height: '444px' }}>
                  {/* Link to PDP.js with product id */}
                  <Link to={`/pdp/${product.product_id}`}>
                  <img 
                    src={product.image_1} 
                    className="px-2" 
                    style={{ width: '394px', height: '330px', objectFit: 'contain', alignSelf: 'center' }} 
                    alt={product.product_name} 
                  /></Link>
                  <div className="card-body">
                    <a href="#"><h5 className="card-title">{product.product_name}</h5></a>
                    <p className="card-text">${product.product_price} USD</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    );
  }
}

export default Tech;
