import "./Profile.css";
import { NavLink, Outlet } from "react-router-dom";

export const Profile = () => {
  const headings = ["Profile", "Address", "Orders"];
  const routes = ["", "address", "orders"];

  return (
    <div className="profile_page">
      <ul className="profile_list">
        {headings?.map((heading, index) => (
          <li className="profile_list_item">
            <NavLink
              to={`/profile/${routes[index]}`}
              className={({ isActive }) =>
                isActive ? "navlink active_navlink" : "navlink"
              }
            >
              <h2>{heading}</h2>
            </NavLink>
          </li>
        ))}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
};
