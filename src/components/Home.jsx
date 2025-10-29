import React, { useEffect, useState } from "react";
import { Box, Typography, Fade, Grid, Card, CardContent } from "@mui/material";
import { AutoAwesome, AccessAlarm, Psychology, LibraryBooks } from "@mui/icons-material";

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
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % taglines.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <LibraryBooks sx={{ fontSize: 45, color: "#1976d2" }} />,
      title: "Effortless Borrow & Return",
      desc: "Borrow and return books easily through an intuitive dashboard. Every action is tracked seamlessly, ensuring accuracy and transparency across all records.",
    },
    {
      icon: <AccessAlarm sx={{ fontSize: 45, color: "#1976d2" }} />,
      title: "Automated Email Reminders",
      desc: "Cron jobs notify users automatically about due and overdue books. Timely email alerts help members stay on track without missing return deadlines.",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 45, color: "#1976d2" }} />,
      title: "Personalized Recommendations",
      desc: "Discover books you’ll love through intelligent recommendations tailored to your reading patterns, favorite authors, and genres you explore most often.",
    },
    {
      icon: <Psychology sx={{ fontSize: 45, color: "#1976d2" }} />,
      title: "AI Book Expert",
      desc: "An AI-powered assistant that provides concise book summaries, theme overviews, and insights helping readers understand and choose books faster.",
    },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          height: "85vh",
          backgroundImage: "url('src/assets/images/library.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.55)",
          }}
        />
        <Box sx={{ zIndex: 1, px: 3, maxWidth: "800px" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "4rem" },
              letterSpacing: 2,
              mb: 2,
              textShadow: "4px 4px 15px rgba(0,0,0,0.8)",
            }}
          >
            Welcome to <span style={{ color: "#ffcc00" }}>BookNest</span>
          </Typography>
          <Fade in={fade} timeout={800}>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.95)",
                fontStyle: "italic",
                letterSpacing: 1,
                fontSize: { xs: "1.1rem", md: "1.5rem" },
              }}
            >
              {taglines[index]}
            </Typography>
          </Fade>
        </Box>
      </Box>

      {/* ABOUT SECTION */}
      <Box
        sx={{
          py: 8,
          px: { xs: 3, md: 10 },
          backgroundColor: "#f8f9fa",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 3, color: "#2c3e50" }}
        >
          Smarter Library Management with AI
        </Typography>
        <Typography
          sx={{
            maxWidth: "750px",
            margin: "0 auto",
            color: "#555",
            fontSize: "1.05rem",
            lineHeight: 1.8,
          }}
        >
          BookNest combines technology and intelligence to make reading
          effortless. From smart recommendations to automatic email alerts, our
          platform keeps libraries organized and readers deeply engaged.
        </Typography>
      </Box>

      {/* FEATURES SECTION */}
      <Box
        sx={{
          py: 8,
          px: { xs: 3, md: 10 },
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 6,
            color: "#2c3e50",
          }}
        >
          Core Features
        </Typography>

        <Grid
          container
          spacing={4}
          sx={{ justifyContent: "center", alignItems: "stretch" }}
        >
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {feature.icon}
                  <Typography
                    variant="h6"
                    sx={{ mt: 2, fontWeight: "bold", color: "#333" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "#666",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FINAL NOTE */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          background: "linear-gradient(135deg, #1a237e, #3949ab)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2, letterSpacing: 1 }}
        >
          “BookNest bridges intelligence and imagination — empowering readers
          and libraries alike.”
        </Typography>
      </Box>
    </Box>
  );
}
