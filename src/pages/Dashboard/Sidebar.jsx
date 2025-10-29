import React from 'react'
// import BookTable from './BookTable'
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

export default function Sidebar() {
  return (
    <div>
        {/* <h5> Sidebar</h5>
        */}

        {/* <Container> */}
            <div className='bg-grey '>
                <div>
                    <i className="bi bi-bootstrap-fill my-2"></i>
                    <span className="brand-name fs-4">Admin-NK</span>
                </div>
                <hr className='text-dark'/>
                <div className="list-group list-group-flush">
                    <a href="#" className="list-group-item list-group-item-action py-2">
                            <span><span className="material-icons fs-5 me-2">face</span>Dashboard</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-2">
                            <span><span className="material-icons fs-5 me-2">home</span>Home</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-2">
                            <span><span className="material-icons fs-5 me-2">pie_chart</span>Reports</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-2">
                            <span><span className="material-icons fs-5 me-2">face</span>Logout</span>
                    </a>
                </div>
            </div>

        {/* </Container> */}

     
    </div>
  )
}

