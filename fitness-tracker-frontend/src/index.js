// src/index.js

import 'bootswatch/dist/flatly/bootstrap.min.css'; // Imports the Flatly theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Will also import the global CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
