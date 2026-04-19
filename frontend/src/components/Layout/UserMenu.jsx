import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard/user/profile", label: "Profile" },
  { to: "/dashboard/user/orders", label: "Orders" },
];

const UserMenu = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
      Dashboard
    </h3>
    <nav className="flex flex-col gap-2">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);

export default UserMenu;
