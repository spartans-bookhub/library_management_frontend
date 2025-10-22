import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" component="h1">
              Library Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome, {user?.userName || "User"}! ({user?.role || "STUDENT"})
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Books Issued
                </Typography>
                <Typography variant="h3" color="warning.main">
                  127
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently borrowed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" size="large">
                      Current Borrowed Books
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" size="large">
                      History
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button variant="contained" size="large">
                      Return Books
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
