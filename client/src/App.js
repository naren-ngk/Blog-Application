import Home from "./pages/home/Home";
import TopBar from "./components/topbar/Topbar";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "./context/Context";
import './App.css'

function App() {
  const { user } = useContext(Context);

  const [searchDisplay, setSearchDisplay] = useState(false);

  const handleSearchClick = () => {
    setSearchDisplay(!searchDisplay);
  }

  return (
    <Router>
      <TopBar handleSearchClick={handleSearchClick} />
      <Switch>
        <Route exact path="/">
          <Home searchDisplay={searchDisplay} />
        </Route>
        <Route path="/register">{user ? <Home /> : <Register />}</Route>
        <Route path="/login">{user ? <Home /> : <Login />}</Route>
        <Route path="/write">{user ? <Write /> : <Register />}</Route>
        <Route path="/settings">{user ? <Settings /> : <Register />}</Route>
        <Route path="/post/:postId">
          <Single />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
