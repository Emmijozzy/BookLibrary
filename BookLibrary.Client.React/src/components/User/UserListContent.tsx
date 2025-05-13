import { User } from "../../Types/User";
import EmptyState from "../bookIIndex/EmptyStateProps";
import { LoadingSpinner2 } from "../LoadingSpinner2";
import BodyRow from "./BodyRow";
import HeadRow from "./HeadRow";
import { UserCard } from "./UserCard";

type Props = {
  users: User[],
  viewMode: string
  loading: boolean
}

export const UserListContent = ({ users, viewMode, loading }: Props) => {

  if (loading) {
      return (
        <LoadingSpinner2 />
      );
  }

  if (users.length === 0) {
      return (
          <EmptyState
              title="No User found"
              message="Try adjusting your search or filter criteria."
          />
      );
  }

  return          viewMode === 'carpet' ? (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {users && users.map((user) => (
            <UserCard key={user.id} user={user} />
        ))}
    </div>
) : (
  <div className="mt-6 overflow-x-auto">
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <HeadRow />
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((item, index) => (
              <BodyRow item={item} key={item.id} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
}