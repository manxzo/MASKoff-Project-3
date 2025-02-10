import {
  Input,
  Button,
  Form,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { EyeIcon } from "@/components/icons";
import { useState } from "react";
import useLogin from "@/hooks/useLogin";
import DefaultLayout from "@/layouts/default";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [viewPass, setViewPass] = useState(false);
  
  const { userInfo, loading, error, loginUser } = useLogin();

  // 🔹 Fix event.target issue
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Login & Store Token
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await loginUser(credentials);
    
    if (response?.token) {
      localStorage.setItem("token", response.token); // 🔹 Store token
    }
    
    setCredentials({ username: "", password: "" });
  };

  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <pre>Login</pre>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Input
              name="username"
              id="username"
              value={credentials.username}
              placeholder="Username"
              onChange={handleInputChange}
            />
            <span className="w-full flex">
              <Input
                name="password"
                id="password"
                value={credentials.password}
                placeholder="Password"
                type={viewPass ? "text" : "password"}
                onChange={handleInputChange}
              />
              <Button
                onPressStart={() => setViewPass(true)}
                onPressEnd={() => setViewPass(false)}
                isIconOnly
              >
                <EyeIcon />
              </Button>
            </span>
            <Button type="submit" isLoading={loading}>Login</Button>
          </Form>
        </CardBody>
      </Card>

      {error && <p style={{ color: "red" }}>{error}</p>} 
      {userInfo && <p style={{ color: "green" }}>{JSON.stringify(userInfo)}</p>}
    </DefaultLayout>
  );
};
