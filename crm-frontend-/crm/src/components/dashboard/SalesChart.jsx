import { Card, CardContent, Typography, Box } from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SalesChart = ({ data }) => {
  const chartData =
    data?.map((item) => ({
      name: new Date(item.month).toLocaleString("default", {
        month: "short",
      }),
      revenue: item.revenue,
    })) || [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 0);
  const roundedMax = Math.ceil(maxRevenue / 5000) * 5000;
  return (
    <Card sx={{ flex: 2, borderRadius: 3 }}>
      <CardContent sx={{ p: 5 }}>
        <Typography fontWeight="bold" mb={2}>
          Sales Reports
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              {/* <YAxis /> */}
              {/* <YAxis
                axisLine={false}
                tickLine={false}
                  domain={[0, roundedMax]}  
  tickCount={5}       
                tickFormatter={(value) => `${value / 1000}k`}
              /> */}

              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, roundedMax]}
                ticks={Array.from(
                  { length: roundedMax / 5000 + 1 },
                  (_, i) => i * 5000,
                )}
                tickFormatter={(value) => `${value / 1000}k`}
              />

              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#6C63FF"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
