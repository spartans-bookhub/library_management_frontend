import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Book Nest
        </Typography>

        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/register"
            sx={{ mr: 2 }}
          >
            Register
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/login"
          >
            Login
          </Button>
           <Button
            color="inherit"
            component={RouterLink}
            to="/userprofile"
          >
            user
          </Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
}