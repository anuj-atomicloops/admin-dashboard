import { useHookstate } from "@hookstate/core";
import { ChartBarDefault } from "./components/BarChart";

import { globalState } from "@/store/globalState";
import { ChartPieLegend } from "./components/PieChart";
import { ChartLineMultiple } from "./components/LineChart";

function DashboardContainer() {
  const users = useHookstate(globalState?.users);
  const products = useHookstate(globalState?.products);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Top Chart Section */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 rounded-xl shadow-md">
          <ChartBarDefault data={users?.get()} />
        </div>
        <div className="bg-muted/50 rounded-xl shadow-md">
          <ChartPieLegend data={products?.get()} />
        </div>
        <div className="bg-muted/50 rounded-xl shadow-md">
          <div className="bg-muted/50 rounded-xl shadow-md p-4 flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-bold">₹12,450</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">₹54,300</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">₹2,15,800</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 rounded-xl shadow-md lg:col-span-2">
          <ChartLineMultiple />
        </div>
        <div className="bg-muted/50 rounded-xl shadow-md"></div>
      </div>
    </div>
  );
}

export default DashboardContainer;
