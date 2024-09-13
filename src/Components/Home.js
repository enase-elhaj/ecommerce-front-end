import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  padding: 8,
  border: "1px solid #ddd",
};

const tableCellStyle = {
  padding: 8,
  border: "1px solid #ddd",
  color: "blue",
};

class Home extends Component {
  render() {
    return (
      <div style={{ padding: 20 }}>
        <h1 style={{ marginBottom: 20, fontSize: 20 }}>Page List</h1>
        <table style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>URL</th>
              <th style={tableHeaderStyle}>Page</th>
            </tr>
          </thead>
          <tbody>
          
            <tr>
              <td style={tableCellStyle}><Link to="/Category">/Category</Link></td>
              <td style={tableCellStyle}><Link to="/Category">Category</Link></td>
            </tr>
           
            <tr>
              <td style={tableCellStyle}><Link to="/ProjectCover">/ProjectCover</Link></td>
              <td style={tableCellStyle}><Link to="/ProjectCover">Project Cover</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Home;
