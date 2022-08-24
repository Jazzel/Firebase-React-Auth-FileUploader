import React from "react";
import { PieChart } from "react-minimal-pie-chart";

const Chart = () => {
  const defaultLabelStyle = {
    fontSize: "5px",
    fontFamily: "sans-serif",
  };
  return (
    <div className="loader-container">
      <h2>Results</h2>
      <br />
      <PieChart
        style={{ height: "300px" }}
        data={[
          { title: "One", value: 10, color: "#E38627" },
          { title: "Two", value: 15, color: "#C13C37" },
          { title: "Three", value: 20, color: "#6A2135" },
        ]}
        label={({ x, y, dx, dy, dataEntry }) => (
          <text
            key={dataEntry.title}
            x={x}
            y={y}
            dx={dx}
            dy={dy}
            dominantBaseline="central"
            textAnchor="middle"
            style={{
              fontSize: "5px",
              fontFamily: "sans-serif",
            }}
          >
            {Math.round(dataEntry.percentage) + "%"}
          </text>
        )}
        labelStyle={defaultLabelStyle}
      />
      ;
    </div>
  );
};

export default Chart;
