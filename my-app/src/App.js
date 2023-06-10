import './App.css';
import Login from './components/login.js'
import SearchPosts from './components/searchPostsByTag.js';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './components/dashboard';
import Home from './components/home.js';
import SeacrhPostByTagClick from './components/searchPostByTagClick';
import AddPost from './components/addPost';
import ShowPost from './components/showPost';
import DisplayUsers from './components/showUsers';
import { RequireAuth } from './components/requireAuth.js';
import AddUser from './components/addUser.js';
import EditPost from './components/editPost';
import OwnPosts from './components/ownPosts';
import EditUser from './components/editUser';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login/>}></Route>
          <Route path='/createUser' element={<AddUser/>}></Route>
          <Route element={<RequireAuth/>} >
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/dashboard/:id' element={<Dashboard/>}></Route>
            <Route path='/home/posts' element={<SearchPosts/>}></Route>
            <Route path='/home/createPost' element={<AddPost/>}></Route>
            <Route path='/home/showPost/:id' element={<ShowPost/>}></Route>
            <Route path='/home/showUsers' element={<DisplayUsers/>}></Route>
            <Route path='/home/editPost' element={<EditPost/>}></Route>
            <Route path='/home/ownPosts' element={<OwnPosts/>}></Route>
            <Route path='/editUser' element= {<EditUser/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
