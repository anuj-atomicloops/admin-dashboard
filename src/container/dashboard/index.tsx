import { useHookstate } from "@hookstate/core";
import { ChartBarDefault } from "./components/BarChart";
import { globalState } from "@/store/globalState";
import { ChartPieLegend } from "./components/PieChart";
import { ChartLineLabel } from "./components/LineChart";
import useDashboardHook from "./hook";

import { ThemeToggle } from "@/components/ThemeToggle";

function DashboardContainer() {
  const users = useHookstate(globalState?.users);
  const products = useHookstate(globalState?.products);

  const {
    todayRevenue,
    yesterdayRevenue,
    thisWeekRevenue,
    lastWeekRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    thisYearRevenue,
    lastYearRevenue,
    totalRevenue,
    monthlyRevenue,
  } = useDashboardHook();

  const revenueStats = [
    { label: "Today", value: todayRevenue },
    { label: "Yesterday", value: yesterdayRevenue },
    { label: "This Week", value: thisWeekRevenue },
    { label: "This Month", value: thisMonthRevenue },
    { label: "This Year", value: thisYearRevenue },
    { label: "Last Week", value: lastWeekRevenue },

    { label: "Last Month", value: lastMonthRevenue },

    { label: "Last Year", value: lastYearRevenue },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 pt-0">
      <div className="flex justify-between">
      
        <h3 className="text-xl font-bold">Admin Dashboard</h3>
        <ThemeToggle />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {/* ------------------- Users Bar Chart -------------------*/}
        <div className="bg-muted/50 rounded-xl shadow-md border">
          <ChartBarDefault data={users?.get()} />
        </div>

        {/* -------------------Products Pie Chart -------------------*/}
        <div className="bg-muted/50 rounded-xl shadow-md">
          <ChartPieLegend data={products?.get()} />
        </div>

        {/* ------------------- Revenue Overview -------------------*/}
        <div className="bg-muted/50 border rounded-2xl h-fit shadow-md p-4 flex flex-col row-span-2">
          <h3 className="text-xl font-bold mb-4 text-center">
            Revenue Overview
          </h3>

          {/*------------------- Revenue List ------------------- */}
          <div className=" divide-y divide-muted-foreground/20 border  rounded-lg">
            {revenueStats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-base font-bold">₹ {stat.value}</p>
              </div>
            ))}
          </div>

          {/* -------------------Total Revenue -------------------*/}
          <div className="py-4 rounded-2xl border mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg text-center flex flex-col justify-center items-center">
            <p className="text-sm font-medium">All Time Revenue</p>
            <p className="text-xl font-extrabold">₹ {totalRevenue}</p>
          </div>
        </div>

        {/* -------------------yearly revenue line chart--------------- */}
        <div className="bg-muted/50 rounded-xl shadow-md lg:col-span-2">
          <ChartLineLabel data={monthlyRevenue} />
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;
