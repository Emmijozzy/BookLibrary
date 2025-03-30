import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookIcon from "../assets/BookIcon";
import CollectionICon from "../assets/CollectionICon";
import LogOutIcon from "../assets/LogOutIcon";
import { useApi } from "../Hooks/useApi";
import UseFetch from "../Hooks/UseFetch";
import NavItem from "./NavItem";

  type Props = {
    onNavigate : (path: string) => void;
    showSideBar: boolean;
  }
  
  const SideBar = ({ onNavigate, showSideBar }: Props) => {
    const { data, error, fetchData } = UseFetch();
    const { clearAuthToken } = useApi();
    const navigate = useNavigate();

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
    ]

    const handlerLogout = () => {
      const authToken = localStorage.getItem("authToken") as string
      const values = {
        token: authToken
      }
       fetchData("AuthApi/logout", {method: 'post', data: {...values}});
    }

      useEffect(() => {
        if(data) {
          localStorage.removeItem("authToken");
          clearAuthToken();
          navigate("/");
        }
    
        console.log(error)
      }, [data, error, navigate])


    return (
      <div className={`absolute flex flex-col card w-72 bg-white p-5 shadow-md shadow-purple-200/50 rounded-md h-[calc(100vh-95px)] ${showSideBar ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out md:translate-x-0`}>
        <ul className="w-full h-full flex flex-col gap-2">
          {
            navItems.map((item, index) => (
              <NavItem onNavigate={onNavigate} key={index} navItem={item.name} Icon={item.icon} path={item.path} />
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