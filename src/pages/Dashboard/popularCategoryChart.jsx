import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import axios from "axios";
import { libraryService } from "../../services/libraryService";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PopularCategoryChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
  const fetchCategoryData = async () => {
    try {
      const res = await libraryService.getCategoryTrend(); 

      const categories = Object.keys(res).map(String); 
      const counts = Object.values(res).map(Number);   

      setChartData({
        labels: categories,
        datasets: [
          {
            label: "Books Borrowed by Category", // must be string
            data: counts,
            backgroundColor: [
              "#1976d2", // primary blue
              "#455a64", // dark slate gray
              "#90a4ae", // soft gray-blue
              "#64b5f6", // light blue
              "#81c784", // soft green
              "#fbc02d", // mustard yellow
              "#ba68c8"  // muted purple
            ],
          },
        ],
      });
    } catch (err) {
      console.error("Error fetching category data:", err);
    }
  };

  fetchCategoryData();
}, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: "Popular Book Categories",
        font: { size: 18 },
      },
    },
  };

  return chartData ? <Pie data={chartData} options={options} /> : <p>Loading...</p>;
};

export default PopularCategoryChart;