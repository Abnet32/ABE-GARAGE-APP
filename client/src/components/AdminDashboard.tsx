import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Users,
  UserPlus,
  Wrench,
  Menu,
  TrendingUp,
  CalendarDays,
  Package,
  X,
  LogOut,
  Home,
} from "lucide-react";
import type {
  Employee,
  Customer,
  Vehicle,
  Service,
  Order,
  InventoryItem,
} from "../types.ts";

// Sub-components
import DashboardHome from "./admin/DashboardHome";
import DashboardOverview from "./admin/DashboardOverview";
import OrdersList from "./admin/OrdersList";
import CreateOrder from "./admin/CreateOrder";
import EmployeesList from "./admin/EmployeesList";
import AddEmployee from "./admin/AddEmployee";
import CustomersList from "./admin/CustomersList";
import AddCustomer from "./admin/AddCustomer";
import ServicesManager from "./admin/ServicesManager";
import InventoryManager from "./admin/InventoryManager";
import AppointmentCalendar from "./admin/AppointmentCalendar";
import Footer from "./Footer";

export type AdminView =
  | "dashboard"
  | "overview"
  | "orders"
  | "new-order"
  | "edit-order"
  | "calendar"
  | "inventory"
  | "employees"
  | "add-employee"
  | "edit-employee"
  | "customers"
  | "add-customer"
  | "edit-customer"
  | "services";

interface AdminDashboardProps {
  onNavigate: (view: AdminView, sectionId?: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onLogout,
}) => {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Mock Database State ---

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      firstName: "Admin",
      lastName: "User",
      email: "admin@autorex.com",
      phone: "555-0101",
      role: "Admin",
      active: true,
      addedDate: "2023-01-01",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Mechanic",
      email: "john@autorex.com",
      phone: "555-0102",
      role: "Employee",
      active: true,
      addedDate: "2023-02-15",
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      firstName: "Jasmine",
      lastName: "Albeshir",
      email: "jasmine@gmail.com",
      phone: "240-835-487",
      active: true,
      addedDate: "2023-05-20",
      hash: "cust_123",
    },
    {
      id: 2,
      firstName: "Adugna",
      lastName: "Bekele",
      email: "test@evangadi.com",
      phone: "202-386-2702",
      active: true,
      addedDate: "2023-06-10",
      hash: "cust_456",
    },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      customerId: 1,
      year: "2020",
      make: "BMW",
      model: "X7",
      type: "SUV",
      mileage: "12000",
      tag: "0101AD",
      serial: "BM123456",
      color: "Gold",
    },
    {
      id: 2,
      customerId: 2,
      year: "2022",
      make: "Tesla",
      model: "Model S",
      type: "Sedan",
      mileage: "10000",
      tag: "9890Ab2",
      serial: "TS999888",
      color: "Silver",
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      names: "Overview",
      descriptions: "Key performance indicators",
      view: "overview",
      name: "Oil Change",
      description: "Synthetic oil change and filter replacement",
    },
    {
      id: 2,
      names: "Add Order",
      descriptions: "Add new order",
      view: "new-order",
      name: "Brake Repair",
      description: "Brake pad replacement and rotor resurfacing",
    },
    {
      id: 3,
      names: "All Orders",
      descriptions: "Quick access to orders",
      view: "orders",
      name: "Tire Rotation",
      description: "Rotate tires to ensure even wear",
    },
    {
      id: 4,
      names: "Inventory",
      descriptions: "Track parts, stock levels",
      view: "inventory",
      name: "Engine Tune-up",
      description: "Spark plugs, air filter, and system check",
    },
    {
      id: 5,
      names: "Add Employee",
      descriptions: "Add a new employee",
      view: "add-employee",
      name: "Battery Service",
      description: "Battery check, charging system analysis and replacement",
    },
    {
      id: 6,
      names: "All Employees",
      descriptions: "List all employees",
      view: "employees",
      name: "AC Recharge",
      description: "Air conditioning system diagnostic and refrigerant refill",
    },
    {
      id: 7,
      names: "Add Customer",
      descriptions: "Add new customer",
      view: "add-customer",
      name: "Wheel Alignment",
      description: "Computerized wheel alignment for better handling",
    },
    {
      id: 8,
      names: "All Customers",
      descriptions: "List all customers",
      view: "customers",
      name: "Suspension",
      description: "Struts, shocks, and suspension component repair",
    },
    {
      id: 9,
      names: "All Services",
      descriptions: "List all services",
      view: "services",
      name: "Detailing",
      description: "Complete interior and exterior professional detailing",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 101,
      customerId: 1,
      vehicleId: 1,
      employeeId: 2,
      date: "2023-10-25",
      status: "In Progress",
      description: "Check engine light is on",
      serviceIds: [1, 4],
      hash: "ord_abc",
      estimatedCompletionDate: "2023-10-27",
    },
    {
      id: 102,
      customerId: 2,
      vehicleId: 2,
      employeeId: 2,
      date: "2023-10-26",
      status: "Received",
      description: "Regular maintenance",
      serviceIds: [3],
      hash: "ord_xyz",
      estimatedCompletionDate: "2023-10-28",
    },
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Synthetic Oil 5W-30",
      partNumber: "OIL-5W30-SYN",
      category: "Fluids",
      quantity: 45,
      price: 24.99,
      minStockLevel: 10,
    },
    {
      id: 2,
      name: "Oil Filter BMW",
      partNumber: "FLT-BMW-X7",
      category: "Engine",
      quantity: 12,
      price: 15.5,
      minStockLevel: 5,
    },
    {
      id: 3,
      name: "Ceramic Brake Pads",
      partNumber: "BRK-PAD-001",
      category: "Brakes",
      quantity: 8,
      price: 89.99,
      minStockLevel: 4,
    },
    {
      id: 4,
      name: "Air Filter",
      partNumber: "AIR-FLT-GEN",
      category: "Engine",
      quantity: 20,
      price: 12.99,
      minStockLevel: 8,
    },
    {
      id: 5,
      name: "Spark Plug Iridium",
      partNumber: "SPK-NGK-900",
      category: "Engine",
      quantity: 4,
      price: 18.5,
      minStockLevel: 12,
    },
  ]);

  // --- Selection State for Editing ---
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // --- Actions ---

  // Employee Actions
  const handleAddEmployee = (empData: Omit<Employee, "id" | "addedDate">) => {
    const newEmp: Employee = {
      ...empData,
      id: Date.now(),
      addedDate: new Date().toISOString().split("T")[0],
    };
    setEmployees([...employees, newEmp]);
    setCurrentView("employees");
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setCurrentView("edit-employee");
  };

  const handleUpdateEmployee = (
    empData: Omit<Employee, "id" | "addedDate">
  ) => {
    if (!editingEmployee) return;
    setEmployees(
      employees.map((e) =>
        e.id === editingEmployee.id ? { ...e, ...empData } : e
      )
    );
    setEditingEmployee(null);
    setCurrentView("employees");
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  // Customer Actions
  const handleAddCustomer = (custData: Omit<Customer, "id" | "addedDate">) => {
    const newCust: Customer = {
      ...custData,
      id: Date.now(),
      addedDate: new Date().toISOString().split("T")[0],
      hash: Math.random().toString(36).substring(7),
    };
    setCustomers([...customers, newCust]);
    setCurrentView("customers");
  };

  const handleEditCustomer = (cust: Customer) => {
    setEditingCustomer(cust);
    setCurrentView("edit-customer");
  };

  const handleUpdateCustomer = (
    custData: Omit<Customer, "id" | "addedDate">
  ) => {
    if (!editingCustomer) return;
    setCustomers(
      customers.map((c) =>
        c.id === editingCustomer.id ? { ...c, ...custData } : c
      )
    );
    setEditingCustomer(null);
    setCurrentView("customers");
  };

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  // Service Actions
  const addService = (srv: Omit<Service, "id">) => {
    setServices([...services, { ...srv, id: Date.now() }]);
  };

  const updateService = (id: number, srv: Omit<Service, "id">) => {
    setServices(services.map((s) => (s.id === id ? { ...s, ...srv } : s)));
  };

  const deleteService = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  // Vehicle & Order Actions
  const addVehicle = (veh: Omit<Vehicle, "id">) => {
    setVehicles([...vehicles, { ...veh, id: Date.now() }]);
  };

  const addOrder = (ord: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...ord,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "Received",
      hash: Math.random().toString(36).substring(7),
    };
    setOrders([...orders, newOrder]);
    setCurrentView("orders");
  };
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setCurrentView("edit-order"); // or whatever your page name is
  };
  const handleUpdateOrder = (ord: Omit<Order, "id" | "date" | "hash">) => {
    if (!editingOrder) return;
    setOrders(
      orders.map((e) => (e.id === editingOrder.id ? { ...e, ...ord } : e))
    );
    setEditingOrder(null);
    setCurrentView("orders");
  };
  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Inventory Actions
  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    setInventory([...inventory, { ...item, id: Date.now() }]);
  };

  const updateInventoryItem = (
    id: number,
    itemData: Partial<InventoryItem>
  ) => {
    setInventory(
      inventory.map((i) => (i.id === id ? { ...i, ...itemData } : i))
    );
  };

  const deleteInventoryItem = (id: number) => {
    if (window.confirm("Delete this inventory item?")) {
      setInventory(inventory.filter((i) => i.id !== id));
    }
  };

  // --- Navigation ---

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { id: "overview", label: "Overview", icon: <TrendingUp size={18} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={18} /> },
    { id: "orders", label: "Orders", icon: <ClipboardList size={18} /> },
    { id: "new-order", label: "New Order", icon: <PlusCircle size={18} /> },
    { id: "inventory", label: "Inventory", icon: <Package size={18} /> },
    { id: "add-employee", label: "Add Employee", icon: <UserPlus size={18} /> },
    { id: "employees", label: "Employees", icon: <Users size={18} /> },
    { id: "add-customer", label: "Add Customer", icon: <UserPlus size={18} /> },
    { id: "customers", label: "Customers", icon: <Users size={18} /> },
    { id: "services", label: "Services", icon: <Wrench size={18} /> },
  ];

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardHome
            orders={orders}
            employees={employees}
            customers={customers}
            services={services}
            setCurrentView={setCurrentView}
          />
        );
      case "overview":
        return (
          <DashboardOverview
            orders={orders}
            employees={employees}
            customers={customers}
            services={services}
          />
        );
      case "calendar":
        return <AppointmentCalendar orders={orders} customers={customers} />;
      case "orders":
        return (
          <OrdersList
            orders={orders}
            customers={customers}
            vehicles={vehicles}
            employees={employees}
            onEdit={handleEditOrder}
            onUpdateStatus={updateOrderStatus}
          />
        );
      case "new-order":
        return (
          <CreateOrder
            customers={customers}
            vehicles={vehicles}
            services={services}
            employees={employees}
            onSubmit={addOrder}
            onAddVehicle={addVehicle}
          />
        );
      case "edit-order":
        return (
          <CreateOrder
            customers={customers}
            vehicles={vehicles}
            services={services}
            employees={employees}
            onSubmit={handleUpdateOrder} // ✔ CORRECT (expects Order)
            onAddVehicle={addVehicle}
            initialData={editingOrder || undefined}
            isEditing
          />
        );
      case "inventory":
        return (
          <InventoryManager
            inventory={inventory}
            onAdd={addInventoryItem}
            onUpdate={updateInventoryItem}
            onDelete={deleteInventoryItem}
          />
        );
      case "employees":
        return (
          <EmployeesList
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        );
      case "add-employee":
        return <AddEmployee onSubmit={handleAddEmployee} />;
      case "edit-employee":
        return (
          <AddEmployee
            onSubmit={handleUpdateEmployee}
            initialData={editingEmployee || undefined}
            isEditing
          />
        );
      case "customers":
        return (
          <CustomersList
            customers={customers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        );
      case "add-customer":
        return <AddCustomer onSubmit={handleAddCustomer} />;
      case "edit-customer":
        return (
          <AddCustomer
            onSubmit={handleUpdateCustomer}
            initialData={editingCustomer || undefined}
            isEditing
          />
        );
      case "services":
        return (
          <ServicesManager
            services={services}
            onAdd={addService}
            onUpdate={updateService}
            onDelete={deleteService}
          />
        );
      default:
        return (
          <DashboardHome
            orders={orders}
            employees={employees}
            customers={customers}
            services={services}
            setCurrentView={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Top Header Mobile - Styled to match main theme but for admin */}
      <header className="lg:hidden h-16 bg-white shadow-md flex items-center justify-between px-4 shrink-0 sticky top-0 z-40 relative">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-brand-blue hover:bg-gray-100 rounded transition-colors"
        >
          <Menu size={28} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-wide text-brand-blue font-heading">
            Admin Panel
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs shadow-sm">
          A
        </div>

        {/* Red/Blue Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-1 flex">
          <div className="h-full w-1/2 bg-brand-red"></div>
          <div className="h-full w-1/2 bg-brand-blue"></div>
        </div>
      </header>

      <div className="flex flex-1 relative items-stretch">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-[60] lg:z-40 w-64 md:w-72 bg-brand-blue border-r border-gray-700 transform transition-transform duration-200 ease-in-out flex flex-col lg:h-screen ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-24 shrink-0 flex items-center justify-between px-6 lg:justify-center border-b border-gray-700 bg-brand-blue">
            <div className="relative w-fit hidden lg:block">
              <div className="flex items-baseline gap-2">
                <h2
                  className="text-3xl font-bold text-white tracking-tight font-amharic cursor-pointer"
                  onClick={() => onNavigate("home")}
                >
                  <span className="text-brand-red">አቤ</span> ጋራዥ
                </h2>
              </div>
              {/* Logo Underline for sidebar (matches main header style) */}
              <div className="h-1 w-full bg-gray-800 mt-1 rounded-full overflow-hidden flex">
                <div className="h-full w-1/2 bg-white"></div>
                <div className="h-full w-1/2 bg-brand-red"></div>
              </div>
            </div>

            <div className="font-bold  text-xl text-white lg:hidden">
              <h2
                className="text-2xl font-bold text-white tracking-tight font-amharic cursor-pointer"
                onClick={() => onNavigate("home")}
              >
                <span className="text-brand-red">አቤ</span> ጋራዥ
              </h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          <nav
            className="flex-1 py-4 px-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as AdminView);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                  currentView === item.id
                    ? "bg-brand-red text-white shadow-md"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <div className="pt-6 mt-6 border-t border-gray-700 space-y-2 mb-8">
              <button
                onClick={() => onNavigate("home")}
                className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Home size={18} />
                Back to Home
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 lg:p-10 overflow-x-hidden">
          {renderView()}
        </main>
      </div>

      {/* Full Width Footer */}
      <Footer onNavigate={onNavigate} showAppointmentBanner={false} />
    </div>
  );
};

export default AdminDashboard;
