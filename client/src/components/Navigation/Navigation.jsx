import "./Navigation.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const [activeNav, setActiveNav] = useState("#");
  const navItems = [
    { id: "home", route: "/", icon: "fa-house" },
    { id: "paciente", route: "/paciente", icon: "fa-user" },
    { id: "resultado", route: "/resultado", icon: "fa-book" },
  ];
  const handleNavClick = (navId) => {
    setActiveNav(navId);
  };
  return (
    <nav>
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.route}
          onClick={() => handleNavClick(item.id)}
          className={activeNav === item.id ? "active" : ""}
        >
          {/* <i className={`fa-solid ${item.icon}`}></i> */}
          ({item.id}) - 
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
