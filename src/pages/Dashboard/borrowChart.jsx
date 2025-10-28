import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "../../utils/axiosConfig";
import { libraryService } from "../../services/libraryService";

export const BorrowingChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchBorrowingTrends = async () => {
      try {
        const res = await libraryService.getBorrowingTrend()

        setChartData({
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
          datasets: [
            {
              label: "Books Borrowed",
              data: res, 
              borderColor: "#1976d2",
              backgroundColor: "rgba(25,118,210,0.2)",
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching borrowing trends:", err);
      }
    };

    fetchBorrowingTrends();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Monthly Borrowing Trends (Books)" ,
        font: { size: 18 },
      },
    },
  };

  return chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>;

};