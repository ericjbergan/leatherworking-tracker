import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Use import.meta.env instead of process.env
console.log('API URL:', import.meta.env.VITE_API_URL)

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

const rootElement = ReactDOM.createRoot(root)
rootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 