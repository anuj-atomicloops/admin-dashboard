import { Link, useLocation } from "react-router-dom"

export default function Sidebar() {
  const location = useLocation()

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/users", label: "Users" },
    { to: "/reports", label: "Reports" },
    { to: "/settings", label: "Settings" },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`${
              location.pathname === link.to ? "text-blue-400 font-semibold" : "hover:text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
