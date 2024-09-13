import React, { Component } from 'react';
import './Category.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CartOverlay from './CartOverlay'; // Import CartOverlay
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { withNavigate} from './WithNavigate';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCartOverlay: false, // State to track if CartOverlay is visible
      activeCategory: 'clothes', // Default active category/////////
    };
  }
//////////////
  handleCategoryClick = (event, category) => {
    // event.preventDefault();
    this.setState({ activeCategory: category });
  };
  /////////
  toggleCartOverlay = () => {
    this.setState(prevState => ({
      showCartOverlay: !prevState.showCartOverlay, // Toggle overlay visibility
    }));
  };

    handleBack = () => {
      this.props.navigate(-1); // Go back to the previous page
    }

  render() {
    const { itemCount, onItemCountChange } = this.props; // Receive itemCount as a prop
    const { activeCategory } = this.state;//////////
    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary bg-light">
      {/* <nav className="navbar navbar-expand-lg bg-body-tertiary bg-light"> */}
        <div className="container-fluid pt-4 pl-5 pr-5" style={{ display: 'flex' }}>
          <div className="cats" id="navbarNav" data-testid='category-link'>
            <ul className="navbar-nav">

              <li className="nav-item">
                <Link to="/clothes"  className={`nav-link label-7 ${activeCategory === 'clothes' ? 'active' : ''}`} 
                
                data-testid={activeCategory === 'clothes' ? 'active-category-link' : undefined}
                onClick={() => this.handleCategoryClick('clothes')}>Clothes</Link>
              </li>

              <li className="nav-item">
                <Link to ="/tech" className={`nav-link label-7 ${activeCategory === 'tech' ? 'active' : ''}`} 
                
                data-testid={activeCategory === 'tech' ? 'active-category-link' : undefined}
                onClick={() => this.handleCategoryClick('tech')}>Tech </Link>
              </li>
            </ul>
          </div>

          <div >
            <button className='arrow' onClick={this.handleBack}>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
            </button>

          </div>

          {/* Cart button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={this.toggleCartOverlay}
              className="cart-btn"
              style={{ background: 'none', border: 'none' }}
              data-testid='cart-btn'
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mycart" />
              <sup className="cart-number">{itemCount}</sup>
            </button>
            
            {/* Render CartOverlay if showCartOverlay is true */}
            {this.state.showCartOverlay && ( <CartOverlay onItemCountChange={onItemCountChange} />)}
          </div>
        </div>
      </nav>
    );
  }
}

export default withNavigate(Header);

