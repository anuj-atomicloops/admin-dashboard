import { globalState } from "@/store/globalState";
import { useHookstate } from "@hookstate/core";

const useDashboardHook = () => {
  const orders = useHookstate(globalState.orders).get();
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (date: Date, now: Date) => {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(date, yesterday);
  };

  const isSameWeek = (date: Date, ref: Date) => {
    const startOfWeek = new Date(ref);
    startOfWeek.setDate(ref.getDate() - ref.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  };

  const isLastWeek = (date: Date, ref: Date) => {
    const startOfThisWeek = new Date(ref);
    startOfThisWeek.setDate(ref.getDate() - ref.getDay()); // Sunday
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);

    return date >= startOfLastWeek && date <= endOfLastWeek;
  };

  const isSameMonth = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

  const isLastMonth = (date: Date, ref: Date) => {
    const lastMonth = new Date(ref);
    lastMonth.setMonth(ref.getMonth() - 1);
    return (
      date.getFullYear() === lastMonth.getFullYear() &&
      date.getMonth() === lastMonth.getMonth()
    );
  };

  const isSameYear = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear();

  const isLastYear = (date: Date, ref: Date) =>
    date.getFullYear() === ref.getFullYear() - 1;

  // -------------------------------------------------------
  const todayRevenue = orders
    .filter((o: any) => isSameDay(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const yesterdayRevenue = orders
    .filter((o: any) => isYesterday(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const thisWeekRevenue = orders
    .filter((o: any) => isSameWeek(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const lastWeekRevenue = orders
    .filter((o: any) => isLastWeek(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const thisMonthRevenue = orders
    .filter((o: any) => isSameMonth(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const lastMonthRevenue = orders
    .filter((o: any) => isLastMonth(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const thisYearRevenue = orders
    .filter((o: any) => isSameYear(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const lastYearRevenue = orders
    .filter((o: any) => isLastYear(new Date(o.orderDate), now))
    .reduce((acc, o: any) => acc + o.totalAmount, 0);

  const totalRevenue = orders.reduce((acc, o: any) => acc + o.totalAmount, 0);

  //----------- Monthly Revenue (Jan - Dec) --------------------
  const monthlyRevenue = Array.from({ length: 12 }, (_, monthIdx) => {
    const monthRevenue = orders
      .filter(
        (o: any) =>
          new Date(o.orderDate).getFullYear() === now.getFullYear() &&
          new Date(o.orderDate).getMonth() === monthIdx
      )
      .reduce((acc, o: any) => acc + o.totalAmount, 0);

    return {
      month: new Date(0, monthIdx).toLocaleString("default", { month: "long" }),
      desktop: monthRevenue,
    };
  });

  return {
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
  };
};

export default useDashboardHook;
