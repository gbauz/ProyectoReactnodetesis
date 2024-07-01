import { BookOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import "./Navigation.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  const [activeNav, setActiveNav] = useState("#");
  const navItems = [
    { id: "Home", route: "/", icon: HomeOutlined },
    { id: "Paciente", route: "/paciente", icon: UserOutlined },
    { id: "Resultado", route: "/resultado", icon: BookOutlined },
  ];
  const handleNavClick = (navId) => {
    setActiveNav(navId);
  };
  return (
    <div className="slidebar">
      {/* <div className="Menulist">
      </div> */}
      <ul>
        {navItems.map((item) => (
          <li>
            <NavLink
              key={item.id}
              to={item.route}
              onClick={() => handleNavClick(item.id)}
              className={activeNav === item.id ? "active" : ""}
            >
              {/* <i className={`fa-solid ${item.icon}`}></i> */}
              <item.icon />
              {item.id} 
            </NavLink>
          </li>
      ))}
      </ul>
    </div>
  );
};

export default Navigation;
