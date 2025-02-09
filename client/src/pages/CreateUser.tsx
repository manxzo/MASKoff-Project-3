import { Input, Button, Form, Card, CardBody, CardHeader } from "@heroui/react";
import { EyeIcon } from "@/components/icons";
import { useEffect, useState } from "react";
import useCreateUser from "@/hooks/useCreateUser";
import DefaultLayout from "@/layouts/default";

export const CreateUser = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    repeatPass: "",
  });

  const [viewPass, setViewPass] = useState(false);
const {error:createError,loading,createNewUser} = useCreateUser()
const [error,setError] = useState("")
useEffect(()=>(createError?setError(createError):null),[createError])
  const handleInputChange = (event) => {
    const { name, value } = event.target; 
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "repeatPass" || name === "password") {
      if (newUser.password && newUser.repeatPass && newUser.password !== value) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (newUser.password !== newUser.repeatPass) {
      setError("Passwords do not match");
      return;
    }
    createNewUser({username:newUser.username,password:newUser.password})
    setNewUser({ username: "", password: "", repeatPass: "" });
    setError("");
  };

  return (
    <DefaultLayout>
<Card>
      <CardHeader>
        <pre>Sign Up</pre>
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

          <Input
            name="repeatPass"
            id="repeatPass"
            value={newUser.repeatPass}
            placeholder="Repeat Password"
            type="password"
            onChange={handleInputChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}

          <Button type="submit" isDisabled={!!error} isLoading={loading}>Sign Up</Button>
        </Form>
      </CardBody>
    </Card>
    </DefaultLayout>
    
  );
};
