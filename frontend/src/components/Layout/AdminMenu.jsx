import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard/admin", label: "Dashboard", icon: "▦" },
  { to: "/dashboard/admin/create-category", label: "Categories", icon: "⊞" },
  { to: "/dashboard/admin/create-product", label: "Add Product", icon: "+" },
  { to: "/dashboard/admin/products", label: "Products", icon: "◫" },
  { to: "/dashboard/admin/orders", label: "Orders", icon: "≡" },
  { to: "/dashboard/admin/users", label: "Users", icon: "⊙" },
];

const AdminMenu = () => (
  <div className="panel">
    <p className="label-xs mb-4">Admin Panel</p>
    <nav className="flex flex-col gap-1">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/dashboard/admin"}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="text-base leading-none w-4 text-center">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);

export default AdminMenu;
