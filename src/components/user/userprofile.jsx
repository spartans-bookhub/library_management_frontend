import { useAuth } from "../../context/AuthContext";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import EditProfile from "./editprofile";

export default function UserProfile(){
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false);

    if (loading) {
    return <Typography>Loading user profile...</Typography>;
  }
    if (!user) {
      return <p>Loading user data...</p>;
    }

    const handleEditClick = () => {
      setIsEditing(true)
    }

       
    const handleCancel = () =>{
        setIsEditing(false);
    }


  return(
    <>
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Typography variant="h6" component="h6" gutterBottom>
          {user.userName}
      </Typography>
       <Typography variant="body2" color="textSecondary" gutterBottom>
           {user.email}
      </Typography>
       <Typography  variant="body1" sx={{ mt: 1 }}>
           {user.contactNumber}
      </Typography>
        <Typography  variant="body1" sx={{ mt: 1 }}>
           {user.address}
      </Typography>
       <Button variant="outlined" sx={{ mt: 3 }} onClick={handleEditClick}>
         Edit Profile 
        </Button>
        </Paper>
       <Box sx={{  mx: 'auto',
                width: '90vw',
                maxWidth: 600,
                mb: 5,
                p: 3,  
                }}>
        {isEditing && <EditProfile onCancel={handleCancel}/>}
        </Box>
    
    </>
  )
}

