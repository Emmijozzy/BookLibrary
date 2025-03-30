import { useLocation } from "react-router-dom";

type Props = {
  onNavigate: (path: string) => void;
  Icon: React.ReactNode;
  navItem: string;
  path: string;
}

const NavItem = ({ onNavigate, Icon, navItem, path}: Props) => {
  const location = useLocation();

  const isActive = (route: string) => {
    return location.pathname.includes(route);
  }

  return (
    <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
    <button className={`p-16-semibold flex items-center size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear duration-150 ${isActive(path) ? 'bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700' : ''}`}
      onClick={() => onNavigate(path)}
    >
      {Icon}
      {navItem}
    </button>
  </li>
  )
}

export default NavItem