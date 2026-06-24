import "../nav.scss"
import { useNavigate } from 'react-router'
const Nav = () => {
  const navigate = useNavigate()
  return (
   <nav className="nav-bar">
    <p>Instagram</p>
    <div className="nav-actions">
      <button onClick={()=>{navigate('/profile')}} className='btn primary-btn'>Profile</button>
      <button onClick={()=>{navigate('/create-post')}} className='btn primary-btn'>New Post</button>
    </div>
   </nav>
  )
}

export default Nav