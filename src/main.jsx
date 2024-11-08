import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; 
import './index.css'; 

function Main() {
  return (
    <div className="app-container">
      {}
      <App />
    </div>
  );
}

ReactDOM.render(
  <Main />, 
  document.getElementById('root') 
);
