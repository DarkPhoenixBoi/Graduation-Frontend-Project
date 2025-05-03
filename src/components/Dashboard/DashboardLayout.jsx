// components/Dashboard/DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/dashboard/books"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/tags"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Tags
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/assign-tags"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Assign Tags
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/reviews"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Reviews
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet /> {/* renders nested page content */}
      </main>
    </div>
  );
}
