import { NavLink, useLocation } from "react-router-dom";

type Props = {
  Icon: React.ReactNode;
  navItem: string;
  path: string;
}

const NavItem = ({ Icon, navItem, path}: Props) => {
  const location = useLocation();
  const pathWithoutSlash = location.pathname.toLowerCase().replace('/', '');
  
  const isActive = () => {
    return pathWithoutSlash == path.toLowerCase() || pathWithoutSlash.startsWith(path.toLowerCase());
  }

  return (
    <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
    <NavLink to={path}>
      <button className={`p-16-semibold flex items-center size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear duration-150 ${isActive() ? 'bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700' : ''}`}
      >
        {Icon}
        {navItem}
      </button>
    </NavLink>
  </li>
  )
}

export default NavItem