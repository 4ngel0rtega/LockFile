import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/home'
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/myProfile' element={<Profile/>}/>
      </Routes>
    </Router>
  )
}

export default App
