import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login(){
    const navigate = useNavigate();
    const handleLogin = () =>{
        alert("makin api call")
        axios.post("http://localhost:9007/login", {
                                                        "email" : "john@test.com",
                                                        "password" : "Password@123"
                                                    })
            .then((res) =>{
                const userData = res.data
                console.log(userData)

                //navigate
                navigate("/userprofile", { state: {user: userData}})
            })
            .catch((err) => {
                console.error("Login failed", err)
            })
    }
    return(
        <>
            <Button onClick={handleLogin}>Login</Button>
        </>
    )
}