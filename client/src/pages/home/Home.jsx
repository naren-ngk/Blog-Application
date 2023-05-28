import { useEffect, useState, useRef } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from '../../components/search/Search';
import "./home.css";
import axios from "axios";
import { useLocation } from "react-router";

export default function Home({ searchDisplay }) {
  const { search } = useLocation();
  const searchRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeOut, setSearchTimeOut] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/posts" + search);
      setPosts(res.data);
    };
    fetchPosts();
  }, [search]);

  const scrollToComponent = () => {
    searchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (searchDisplay) {
      scrollToComponent();
    }
  }, [searchDisplay])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value);
    setSearchTimeOut(
      setTimeout(() => {
        const searchResults = posts.filter((item) => {
          return item.title.toLowerCase().includes(searchText.toLowerCase());
        })
        setSearchResults(searchResults);
      }, 500)
    );
  }

  return (
    <>
      <Header />
      <div ref={searchRef}>
        {searchDisplay && <SearchBar handleSearchInput={handleSearchChange} searchText={searchText} />}
      </div>
      <div className="home">
        {searchResults ? (<Posts posts={searchResults} />) : (<Posts posts={posts} />)}
        <Sidebar />
      </div>
    </>
  );
}
