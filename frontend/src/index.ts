import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Use import.meta.env instead of process.env
console.log('API URL:', import.meta.env.VITE_API_URL)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 