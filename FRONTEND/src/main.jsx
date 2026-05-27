import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Si querés un CSS global básico para sacarle los márgenes por defecto al body,
// podés agregar un index.css e importarlo acá.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)