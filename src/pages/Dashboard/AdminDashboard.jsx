import React, { useState } from 'react';
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
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Sidebar from './Sidebar';
import { useAuth } from "../../context/AuthContext";
import BookTable from "./BookTable"
import AdminHome from './AdminHome';
import FilterSidebar from './FilterSidebar';


export default function AdminDashboard() {
const { user, logout } = useAuth();
const [toggle, setToggle] = useState(false);

const Toggle = ()=>{
  setToggle(!toggle)
}


  return (
    // Remove this provider when copying and pasting into your project.
    <>
    {/* <Container maxWidth="lg" sx={{ mt: 0}}>
          <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
            <Box>
                <Typography variant="h4">
                  Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Welcome, 
                  {user?.userName || "User"}! ({user?.role || "ADMIN"})
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {Array.from(Array(6)).map((_, index) => (
                      <Grid key={index} size={{ xs: 4, sm: 4, md: 4 }}>
                        BOXXXXX
                      </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper >
      </Container> */}

  <div className="container-fluid bg-secondary min-vh-100" >
      <div className="row">

          {toggle && <div className="col-2 bg-white vh-100 position-fixed">
                        <Sidebar />
                    </div>
            }
            
            <div className="col-auto">
                <AdminHome  Toggle={Toggle}/>
            </div>

             {/* <div className="col-2 bg-white vh-100 float-left top-right">
              <FilterSidebar />
            </div> */}

          </div>
        </div>
    
      

    </>

  );
}



