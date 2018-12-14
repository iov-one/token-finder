import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(<BrowserRouter>
  <Route path="/" component={App} />
</BrowserRouter>, document.getElementById('root'));
