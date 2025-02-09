import { Input,Button,Form,Card,CardBody,CardFooter,CardHeader } from "@heroui/react";
import { EyeIcon } from "@/components/icons";
import { useState } from "react";
export const Login = () =>{
const [credentials,setCredentials] = useState({username:"",password:""})
const [viewPass,setViewPass] = useState(false);
const handleInputChange = (event) =>{
    const {name,value} = event
    setCredentials((prev)=>({...prev,[name]:value}))
}
const handleSubmit = (event)=>{
    event.preventDefault();
    console.log(credentials);
    setCredentials({username:"",password:""})
}
return(
    <Card>
        <CardHeader><pre>Login</pre></CardHeader>
        <CardBody>
            <Form onSubmit={handleSubmit}>
                <Input name="username" id="username" value={credentials.username} placeholder="Username" onChange={handleInputChange}/>
                <span>
                     <Input name="password" id="password" value={credentials.password} placeholder="password" type={viewPass?"text":"password"} onChange={handleInputChange}/>
                     <Button onPressStart={()=>setViewPass(true)} onPressEnd={()=>setViewPass(false)} isIconOnly><EyeIcon/></Button>
                </span>
               <Button type="submit">Login</Button>          
            </Form>
            </CardBody> 
    </Card>
)
}