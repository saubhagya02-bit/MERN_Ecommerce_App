import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard/user/profile", label: "Profile", icon: "⊙" },
  { to: "/dashboard/user/orders", label: "Orders", icon: "≡" },
];

const UserMenu = () => (
  <div className="panel">
    <p className="label-xs mb-4">My Account</p>
    <nav className="flex flex-col gap-1">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
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

export default UserMenu;
