import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import CartOverlay from './Components/CartOverlay';
import Category from './Components/Category';
import Tech from './Components/Tech';
import PDP from './Components/PDP';
import React, { Component } from 'react';
import Header from './Components/Header';
import ProjectCover from './Components/ProjectCover';

class App extends Component {
  constructor(props) {
    super(props);
    const storedItems = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = storedItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

    this.state = {
      itemCount: itemCount, // Shared state for item count
    };
  }

  handleItemCountChange = (newCount) => {
    this.setState({ itemCount: newCount });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header itemCount={this.state.itemCount} 
          onItemCountChange={this.handleItemCountChange} /> {/* Pass itemCount to Header */}
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/cartoverlay' element={
              <CartOverlay onItemCountChange={this.handleItemCountChange} /> // Pass callback to CartOverlay
            }/>
            <Route path='category' element={<Category />} />
            <Route path='clothes' element={<Category />} />
            <Route path='tech' element={<Tech />} />
            <Route path="/pdp/:productId" element={<PDP />} />

            <Route path='projectCover' element={<ProjectCover/>} />
            
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;




