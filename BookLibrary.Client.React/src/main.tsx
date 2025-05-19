import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ApiProvider } from './context/ApiProvider.tsx'
import AppContextProvider from './context/AppContextProvider.tsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
        <AppContextProvider>
          <ApiProvider>
              <App />  
          </ApiProvider>
        </AppContextProvider>  
    </BrowserRouter>
  // </React.StrictMode>,
)
