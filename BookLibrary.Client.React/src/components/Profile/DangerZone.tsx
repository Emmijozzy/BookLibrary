interface DangerZoneProps {
  onDeleteClick: () => void;
}

const DangerZone = ({ onDeleteClick }: DangerZoneProps) => {
  return (
    <div>
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-1">Delete Account</h4>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={onDeleteClick}
            className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;