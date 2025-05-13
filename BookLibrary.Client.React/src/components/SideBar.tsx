import BookIcon from "../assets/BookIcon";
import CollectionICon from "../assets/CollectionICon";
import LogOutIcon from "../assets/LogOutIcon";
import useLogout from "../Hooks/Auth/useLogout";
import { useApp } from "../Hooks/useApp";
import NavItem from "./NavItem";

  type Props = {
    showSideBar: boolean;
  }
  
  const SideBar = ({ showSideBar }: Props) => {
    const { currentRole } = useApp();
    const isAdmin = currentRole === "Admin";  
    const {handlerLogout} = useLogout()

    const navItems = [
      {
        name: 'Books',
        icon: <BookIcon />,
        path: 'books',
      },
      {
        name: 'Categories',
        icon: <CollectionICon />,
        path: 'categories',
      },
      {
        name: 'Profile',
        icon: <CollectionICon />,
        path: 'profile',
      }
    ]

    const navItemsAdmin = [
      {
        name: 'Books',
        icon: <BookIcon />,
        path: 'books',
      },
      {
        name: 'Categories',
        icon: <CollectionICon />,
        path: 'categories',
      },
      {
        name: 'Users',
        icon: <CollectionICon />,
        path: 'users',
      },
      {
        name: 'Profile',
        icon: <CollectionICon />,
        path: 'profile',
      }
    ]


    return (
      <div className={`absolute flex flex-col border-r border-gray-200 card w-72 bg-white p-5 h-[calc(100vh-120px)] ${showSideBar ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out md:translate-x-0`}>
        <ul className="w-full h-full flex flex-col gap-2">
          {
            isAdmin 
              ?  navItemsAdmin.map((item, index) => (
                  <NavItem key={index} navItem={item.name} Icon={item.icon} path={item.path} />
                ))

              :  navItems.map((item, index) => (
                  <NavItem key={index} navItem={item.name} Icon={item.icon} path={item.path} />
                ))
          }

          <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap mt-auto">
            <button onClick={handlerLogout} className="p-16-semibold flex items-center size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-red-100 hover:shadow-inner focus:bg-gradient-to-r from-red-400 to-red-600 focus:text-white text-gray-700 transition-all ease-linear">
              <LogOutIcon />
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }

  export default SideBar;