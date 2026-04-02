import React, { useState } from "react";
import type { Order, Customer } from "../../types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

interface AppointmentCalendarProps {
  orders: Order[];
  customers: Customer[];
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  orders,
  customers,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const goToToday = () => setCurrentDate(new Date());

  const getOrdersForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return orders.filter(
      (o) => o.date === dateStr || o.estimatedCompletionDate === dateStr,
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
            Service Calendar
            <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 min-w-[160px] justify-center">
            <CalendarIcon size={18} className="text-brand-red" />
            <span className="font-bold text-brand-blue">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="text-xs font-bold text-brand-red underline"
        >
          Go to Today
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {/* Empty cells for previous month */}
          {Array.from({ length: firstDayOfMonth(currentDate) }).map((_, i) => (
            <div
              key={`prev-${i}`}
              className="h-32 md:h-40 border-b border-r border-gray-100 bg-gray-50/30"
            ></div>
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth(currentDate) }).map((_, i) => {
            const day = i + 1;
            const dayOrders = getOrdersForDate(day);
            const isToday =
              new Date().toDateString() ===
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day,
              ).toDateString();

            return (
              <div
                key={day}
                className={`h-32 md:h-40 border-b border-r border-gray-100 p-2 relative group hover:bg-gray-50 transition-colors ${
                  isToday ? "bg-blue-50/50" : ""
                }`}
              >
                <span
                  className={`text-sm font-bold block mb-2 w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday ? "bg-brand-red text-white" : "text-gray-700"
                  }`}
                >
                  {day}
                </span>

                <div className="space-y-1 overflow-y-auto h-[calc(100%-2rem)] scrollbar-none">
                  {dayOrders.map((order) => {
                    const customer = customers.find(
                      (c) => c.id === order.customerId,
                    );
                    return (
                      <div
                        key={order.id}
                        className={`text-[10px] p-1.5 rounded border truncate cursor-pointer ${
                          order.status === "Completed"
                            ? "bg-green-100 border-green-200 text-green-800"
                            : order.status === "In Progress"
                              ? "bg-red-50 border-red-200 text-red-800"
                              : "bg-blue-50 border-blue-200 text-blue-800"
                        }`}
                      >
                        <span className="font-bold">#{order.id}</span>{" "}
                        {customer?.firstName}
                      </div>
                    );
                  })}
                </div>

                {/* Add button on hover */}
                <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-brand-blue text-white p-1 rounded shadow transition-opacity">
                  <PlusIcon size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>{" "}
          Received
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>{" "}
          In Progress
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>{" "}
          Completed
        </div>
      </div>
    </div>
  );
};

// Simple Plus Icon specifically for this component
const PlusIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default AppointmentCalendar;
