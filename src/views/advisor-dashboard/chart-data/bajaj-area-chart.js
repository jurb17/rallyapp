import { hardDashboardStats } from "../data/ApiReplacement";

// ===========================|| DASHBOARD - BAJAJ AREA CHART ||=========================== //

const chartData = {
  type: "area",
  height: 95,
  options: {
    chart: {
      id: "support-chart",
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: () => "Ticket ",
        },
      },
      marker: {
        show: false,
      },
    },
  },
  series: [
    {
      data: Object.values(hardDashboardStats.revenue.monthly),
    },
  ],
};

export default chartData;
