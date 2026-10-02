import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './Home'
import AccountPage from './Account Page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Account" element={<AccountPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
