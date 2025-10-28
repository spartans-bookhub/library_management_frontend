// UserProfile.jsx
import { useAuth } from "../../context/AuthContext";
import { Box, Grid, Paper, Typography, Avatar, Container } from "@mui/material";
import EditProfile from "./EditProfile";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Typography textAlign="center" sx={{ mt: 4 }}>Loading user profile...</Typography>;
  }

  if (!user) {
    return <Typography textAlign="center" sx={{ mt: 4 }}>No user data available.</Typography>;
  }

  const avatarContent = user.avatarUrl ? (
    <Avatar alt={user.userName} src={user.avatarUrl} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
  ) : (
    <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
      {user.userName ? user.userName.charAt(0).toUpperCase() : "A"}
    </Avatar>
  );

  return (
    <Box sx={{ backgroundColor: "grey.100", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="center">
          
          {/* PROFILE */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {avatarContent}
              <Typography variant="h6" fontWeight="bold">
                {user.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>

              <Box sx={{ mt: 3, textAlign: "left", width: "100%" }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                   <PhoneIcon color="primary" fontSize="small" /> {user.contactNumber || "N/A"}
                </Typography>
                <Typography variant="body1">
                    <LocationOnIcon color="error" fontSize="small" /> {user.address || "No address provided"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT: EDIT PROFILE */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                {/* Edit Profile */}
              </Typography>
              <EditProfile />
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
