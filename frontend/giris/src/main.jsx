import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

console.log('main.jsx çalıştı!');
console.log('React app başlatılıyor...');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

console.log('React app render edildi!');
