import React from "react";
import { Box, Typography } from "@mui/material";

export default function LandingPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage:
          "url('src/assets/images/library.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* Dark overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Centered text */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          Welcome to BookNest
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          "Turning pages shaping minds"
        </Typography>
      </Box>
    </Box>
  );
}

