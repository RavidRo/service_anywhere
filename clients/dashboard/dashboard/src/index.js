import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Helmet } from 'react-helmet'

const siteTitle = "Order Dashboard";

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
          <title>{ siteTitle }</title>
        </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
