import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { libraryService } from "../../services/libraryService";

export const BorrowingChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBorrowingTrends = async () => {
      try {
        const res = await libraryService.getBorrowingTrend();
        // Assuming `res` is an array of 12 monthly values like [10, 15, 8, ...]
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        // Convert to Recharts-friendly format
        const formattedData = months.map((month, index) => ({
          month,
          borrowed: res[index] || 0,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching borrowing trends:", error);
      }
    };

    fetchBorrowingTrends();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>
        Monthly Borrowing Trends (Books)
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="borrowed"
              name="Books Borrowed"
              stroke="#1976d2"
              strokeWidth={2}
              fill="rgba(25,118,210,0.2)"
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center" }}>Loading...</p>
      )}
    </div>
  );
};
