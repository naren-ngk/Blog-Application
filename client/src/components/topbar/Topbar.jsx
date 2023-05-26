import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./topbar.css";

export default function TopBar() {
  const { user, dispatch } = useContext(Context);
  const searchRef = useRef(null);

  const [profile, setProfile] = useState('images/user.png');
  const [searchText, setSearchText] = useState('');
  const [searchDisplay, setSearchDisplay] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchDisplay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user && user.profilePic.length > 0) {
      setProfile(user.profilePic)
    }
  }, [user]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <div>
      <div className="top">
        <div className="topLeft">
          <i className="topIcon fab fa-facebook-square"></i>
          <i className="topIcon fab fa-twitter-square"></i>
          <i className="topIcon fab fa-pinterest-square"></i>
          <i className="topIcon fab fa-instagram-square"></i>
        </div>
        <div className="topCenter">
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/">
                HOME
            </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/">
                ABOUT
            </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/">
                CONTACT
            </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/write">
                WRITE
            </Link>
            </li>
            <li className="topListItem" onClick={handleLogout}>
              {user && "LOGOUT"}
            </li>
          </ul>
        </div>
        <div className='topSearchDiv'>
          <i
            className="topSearchIcon fas fa-search"
            onClick={() => setSearchDisplay(true)}></i>
        </div>
        <div className='topCenterDiv'></div>
        <div className="topRight">
          {user ? (
            <Link to="/settings">
              <img className="topImg" src={profile} alt="" />
            </Link>
          ) : (
              <ul className="topList">
                <li className="topListItem">
                  <Link className="link" to="/login">
                    LOGIN
              </Link>
                </li>
                <li className="topListItem">
                  <Link className="link" to="/register">
                    REGISTER
              </Link>
                </li>
              </ul>
            )}
        </div>
      </div>
      {searchDisplay && (
        <div className='searchbar' ref={searchRef}>
          <input className="search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search blogs..." />
          <button className='generate' type='button'>
            Search
      </button>
        </div>
      )}
    </div>
  );
}
