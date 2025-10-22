import { TextField } from "@mui/material";

export default function EditProfile(){
    const handleSubmit = () => {
        alert("check")
    }
    return(
       <>
        <form onSubmit={handleSubmit()}>
            <TextField />
        </form>
       </>
    )
}