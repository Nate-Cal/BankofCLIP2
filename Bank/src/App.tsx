import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route element={<Layout />}>
          <Route path="/Balance" element={<div>Balance</div>} />
          <Route path="/Deposit" element={<div>Deposit</div>} />
          <Route path="/Withdraw" element={<div>Withdraw</div>} />
          <Route path="/Transfer" element={<div>Transfer</div>} />
          <Route path="/History" element={<div>History</div>} />
          <Route path="/Logout" element={<div>Logout</div>} />
          <Route path="/register" element={<div>Register</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
