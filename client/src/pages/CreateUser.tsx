import { Input, Button, Form, Card, CardBody, CardHeader } from "@heroui/react";
import { EyeIcon } from "@/components/icons";
import { useState } from "react";
import useCreateUser from "@/hooks/useCreateUser";
import DefaultLayout from "@/layouts/default";

export const CreateUser = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    repeatPass: "",
  });

  const [viewPass, setViewPass] = useState(false);
  const { error:createError ,loading, createNewUser,user } = useCreateUser();
  const [error, setError] = useState("");
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "repeatPass") {
      setError(
        newUser.password && newUser.repeatPass && newUser.password !== value
          ? "Passwords do not match"
          : ""
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newUser.password !== newUser.repeatPass) {
        setError("Passwords do not match");
        return;
    }
    
 
    if (newUser.password.length < 8) {
        setError("Password should be at least 8 characters long!");
        return;
    }
    

    if (newUser.username.length < 6) {
        setError("Username must be at least 6 characters long!");
        return;
    }

 
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!strongPasswordRegex.test(newUser.password)) {
        setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).");
        return;
    }

    try {
        await createNewUser({
            username: newUser.username,
            password: newUser.password,
        });
        alert("User created successfully!");
        setNewUser({ username: "", password: "", repeatPass: "" });
        setError("");
    } catch (err) {
        console.error("Error creating user:", err);
        setError("Error creating user. Try again.");
    }
};


  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <h2>Sign Up</h2>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Input
              name="username"
              value={newUser.username}
              placeholder="Username"
              onChange={handleInputChange}
            />
          <span className="w-full flex">
          <Input
              name="password"
              value={newUser.password}
              placeholder="Password"
              type={viewPass?"text":"password"}
              onChange={handleInputChange}
            />
            <Button isIconOnly onPressStart={()=>setViewPass(true)} onPressEnd={()=>setViewPass(false)}><EyeIcon/></Button>
          </span>
           
            <Input
              name="repeatPass"
              value={newUser.repeatPass}
              placeholder="Repeat Password"
              type={viewPass?"text":"password"}
              onChange={handleInputChange}
            />
            {user && <p style={{ color: "green" }}>{JSON.stringify(user)}</p>} 
            {createError && <p style={{ color: "red" }}>{createError}</p>}  
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button type="submit" isDisabled={!!error} isLoading={loading}>
              Sign Up
            </Button>
          </Form>
        </CardBody>
      </Card>
    </DefaultLayout>
  );
};
