import { useHookstate } from "@hookstate/core";
import { ChartBarDefault } from "./components/BarChart";
import useDashboardHook from "./hook";
import { globalState } from "@/store/globalState";

function DashboardContainer() {
  const users = useHookstate(globalState.users);
  console.log(users.get(), "dgdfgd");
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <ChartBarDefault data = {users.get()}/>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>

    //
  );
}

export default DashboardContainer;
