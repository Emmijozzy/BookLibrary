import { useApi } from "../Hooks/useApi";
import { useApp } from "../Hooks/useApp";

type Props = {
  showRightSideBar: boolean;
}

const RightSideBar = ({ showRightSideBar }: Props) => {
  const { userRoles } = useApi();
  const { setCurrentRole, currentRole } = useApp();

  const handleRoleChange = (role: "Admin" | "User") => {
    setCurrentRole(role);
    localStorage.setItem("currentRole", role);
  };

  return (
    <div className={`absolute right-0 flex flex-col border-l border-gray-200 card w-72 bg-white p-5 h-[calc(100vh-120px)] ${showRightSideBar ? 'translate-x-0' : 'translate-x-full'} transition-all duration-300 ease-in-out`} style={{ zIndex: 1000 }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Change Role</h3>
        <select
          value={currentRole}
          onChange={(e) => handleRoleChange(e.target.value as "Admin" | "User")}
          className="w-full p-2 border rounded-md"
        >
          {Array.isArray(userRoles)? userRoles?.map((role: string) => (
            <option key={role} value={role}>
              {role}
            </option>
          )) : 
            (
              <option key={userRoles} value={userRoles}>
                  {userRoles}
              </option>
            )
          }
        </select>
      </div>

    </div>
  );
}

export default RightSideBar;