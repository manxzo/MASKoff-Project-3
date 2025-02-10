import { Navigate, Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { CreateUser } from "./pages/CreateUser";
import Home from "./pages/Home";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/home"}/>}/>
      <Route element={<Home />} path="/home" />
      <Route element={<Login />} path="/login" />
      <Route element={<CreateUser />} path="/newuser" />
    </Routes>
  );
}

export default App;
