import "../nav.scss"
import { useNavigate } from 'react-router'
const Nav = () => {
  const navigate = useNavigate()
  return (
   <nav className="nav-bar">
    <p>Instagram</p>
    <button onClick={()=>{navigate('/create-post')}} className='btn primary-b tn'>New Post</button>
   </nav>
  )
}

export default Nav