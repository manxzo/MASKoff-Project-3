import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { CreateUser } from "./pages/CreateUser";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/home" />
      <Route element={<Login />} path="/login" />
      <Route element={<CreateUser />} path="/user/new" />
    </Routes>
  );
}

export default App;
