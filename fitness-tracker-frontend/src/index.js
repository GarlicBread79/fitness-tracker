// src/index.js

import 'bootswatch/dist/flatly/bootstrap.min.css'; // <-- Use Flatly theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // your custom global CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
