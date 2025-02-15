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
import { useNavigate } from "react-router";
export const Login = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [viewPass, setViewPass] = useState(false);
  
  const { user, loading, error, loginAndUpdateUser } = useLogin();

  //  Fix event.target issue
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  //  Login & Store Token
  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginAndUpdateUser(credentials.username,credentials.password); 
    if(!error){
     // navigate('/dashboard')
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
      {user && <p style={{ color: "green" }}>{JSON.stringify(user)}</p>}
    </DefaultLayout>
  );
};
