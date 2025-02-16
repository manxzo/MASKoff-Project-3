import { Navigate, Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { CreateUser } from "./pages/CreateUser";
import Home from "./pages/Home";
import { Messages } from "./pages/Messages";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/home"}/>}/>
      <Route element={<Home />} path="/home" />
      <Route element={<Login />} path="/login" />
      <Route element={<CreateUser />} path="/newuser" />
     <Route element={<Messages/>} path="/messages"/> 
    </Routes>
  );
}

export default App;
