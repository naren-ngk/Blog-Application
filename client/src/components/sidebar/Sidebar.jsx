import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const [cats, setCats] = useState([]);
  const [shortCats, setShortCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get("/categories");
      setCats(res.data);
    };
    getCats();
  }, []);

  useEffect(() => {
    const modifiedCat = () => {
      const categoriesObject = cats.map((cat) => {
        const object = { name: cat.name, shortedName: cat.name.split(' ')[0] };
        return object;
      });
      setShortCats(categoriesObject);
    }
    modifiedCat();
  }, [cats]);

  return (
    <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">About BlogSpot</span>
        <img
          src="/images/side.jpg"
          alt="" 
          className='typewriter'
        />
        <p className='bio'>
          BlogSpot is equipped with functionalities AI image generation, automatic typo mistake checking, and a seamless user experience. These features contribute to an enhanced content quality, making it a valuable tool for bloggers.
        </p>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        <ul className="sidebarList">
          {shortCats.map((c) => (
            <Link to={`/?cat=${c.name}`} className="link">
              <li className="sidebarListItem">{c.shortedName}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">FOLLOW US</span>
        <div className="sidebarSocial">
          <i className="sidebarIcon fab fa-facebook-square"></i>
          <i className="sidebarIcon fab fa-twitter-square"></i>
          <i className="sidebarIcon fab fa-pinterest-square"></i>
          <i className="sidebarIcon fab fa-instagram-square"></i>
        </div>
      </div>
    </div>
  );
}
