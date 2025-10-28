import React, { useEffect, useState } from "react";
import { Box, Typography, Fade } from "@mui/material";


export default function LandingPage() {
 const taglines = [
   "Turning pages, shaping minds.",
   "Discover. Borrow. Learn.",
   "Where stories find their readers.",
 ];


 const [index, setIndex] = useState(0);
 const [fade, setFade] = useState(true);


 useEffect(() => {
   const interval = setInterval(() => {
     setFade(false); // start fade out
     setTimeout(() => {
       setIndex((prev) => (prev + 1) % taglines.length); // switch text
       setFade(true); // fade in new text
     }, 400);
   }, 3000);


   return () => clearInterval(interval);
 }, []);


 return (
   <Box
     sx={{
       height: "100vh",
      //  backgroundImage: "url('src/assets/images/library.jpg')",
       backgroundImage: "url('src/assets/images/webappimg.jpg')",

       backgroundSize: "cover",
       backgroundPosition: "center",
       position: "relative",
       color: "#fff",
       overflow: "hidden",
     }}
   >
     {/* Dark overlay */}
     <Box
       sx={{
         position: "absolute",
         top: 0,
         left: 0,
         width: "100%",
         height: "100%",
        //  bgcolor: "rgba(229, 229, 229, 0.6)",
         bgcolor: "rgb(229 229 229 / 0%)"
       }}
     />


     {/* Centered animated text */}
     <Box
       sx={{
         position: "absolute",
         top: "43%",
         left: "50%",
         transform: "translate(-50%, -50%)",
         textAlign: "center",
         zIndex: 1,
       }}
     >
       {/* Animated main title */}
       <Typography
         variant="h1"
         sx={{
           fontWeight: "bold",
           fontSize: { xs: "2.5rem", md: "5rem" }, // Responsive sizing
           letterSpacing: 3,
           mb: 3,
           animation: "slideDown 1.2s ease-out",
           textShadow: "4px 4px 15px rgba(0,0,0,0.8)",
         }}
       >
         Welcome to <span style={{ color: "#ffcc00" }}>BookNest</span>
       </Typography>


       {/* Rotating tagline */}
       <Fade in={fade} timeout={800}>
         <Typography
           variant="h5"
           sx={{
             color: "rgba(255,255,255,0.95)",
             fontStyle: "italic",
             letterSpacing: 1,
             fontSize: { xs: "1.2rem", md: "1.8rem" },
           }}
         >
           {taglines[index]}
         </Typography>
       </Fade>
     </Box>


     {/* Keyframe Animation */}
     <style>
       {`
         @keyframes slideDown {
           from {
             opacity: 0;
             transform: translateY(-40px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
       `}
     </style>
   </Box>
 );
}

