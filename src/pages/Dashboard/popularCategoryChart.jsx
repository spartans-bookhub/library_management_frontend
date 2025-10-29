import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { libraryService } from "../../services/libraryService";

const COLORS = [
  "#1976d2", // Biography
  "#455a64", // Memoir
  "#90a4ae", // Science Fiction
  "#64b5f6", // Self-help
  "#81c784", // Thriller
  "#fbc02d", // History
  "#ba68c8", // Others
];

const PopularCategoryChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await libraryService.getCategoryTrend(); 
        // Example response: { "Biography": 20, "Memoir": 15, "Science Fiction": 25, ... }

        const formattedData = Object.entries(res).map(([category, count]) => ({
          name: category,
          value: count,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  return (
    <Box sx={{ width: "100%", height: 420 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Popular Book Categories
      </Typography>

      {data.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "100%",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Pie Chart */}
          <Box sx={{ flex: "1 1 350px", minWidth: 300, height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} books`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Custom Legend */}
          <Box sx={{ flex: "0 1 220px", minWidth: 200 }}>

            {data.map((entry, index) => (
              <Box
                key={entry.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: COLORS[index % COLORS.length],
                    borderRadius: "3px",
                    mr: 1.5,
                  }}
                />
                <Typography variant="body2">{entry.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography align="center">Loading...</Typography>
      )}
    </Box>
  );
};

export default PopularCategoryChart;
