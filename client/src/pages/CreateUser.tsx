import { Input, Button, Form, Card, CardBody, CardHeader } from "@heroui/react";
import { EyeIcon } from "@/components/icons";
import { useState } from "react";
export const CreateUser = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
  });
  const [viewPass, setViewPass] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newUser);
    setNewUser({ username: "", password: "" });
  };
  return (
    <Card>
      <CardHeader>
        <pre>Login</pre>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Input
            name="username"
            id="username"
            value={newUser.username}
            placeholder="Username"
            onChange={handleInputChange}
          />
          <span>
            <Input
              name="password"
              id="password"
              value={newUser.password}
              placeholder="password"
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
          <Button type="submit">Login</Button>
        </Form>
      </CardBody>
    </Card>
  );
};
