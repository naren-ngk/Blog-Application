import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./topbar.css";

export default function TopBar({ handleSearchClick }) {
  const { user, dispatch } = useContext(Context);

  const [profile, setProfile] = useState('images/user.png');

  useEffect(() => {
    if (user && user.profilePic.length > 0) {
      setProfile(user.profilePic)
    }
  }, [user]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
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
          onClick={handleSearchClick}></i>
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
  );
}