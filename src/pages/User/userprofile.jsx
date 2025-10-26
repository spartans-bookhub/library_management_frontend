import { useAuth } from "../../context/AuthContext";
import { Box, Paper, Typography, Avatar } from "@mui/material";
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

    const avatarContent = user.avatarUrl ? (
        <Avatar alt={user.userName} src={user.avatarUrl} sx={{ width: 80, height: 80 }} />
          ) : (
            <Avatar sx={{ width: 80, height: 80 }}>
              {user.userName ? user.userName.charAt(0).toUpperCase() : "A"}
            </Avatar>
    );


  return(
    <>
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 5, textAlign: 'center' }}>
     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {avatarContent}
          <Box sx={{ ml: 2, textAlign: "left" }}>
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
          </Box>
      </Box>
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

