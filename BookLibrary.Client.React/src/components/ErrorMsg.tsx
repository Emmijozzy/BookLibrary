import { useEffect, useState } from "react";

type Props = {
  error: string
}

const ErrorMsg = ({error}: Props) => {
  const [errorMessage, setErrorMessage] = useState(error);

  useEffect(() => {
    setErrorMessage(error);
  }, [error])

  const handleClose = () => {
    setErrorMessage("");
  }

  return (
    errorMessage && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center" role="alert">
        <div>
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={handleClose}
          className="bg-transparent text-red-700 hover:text-red-900 font-semibold p-1"
          aria-label="close"
        >
          ×
        </button>
      </div>
    )
  )
}

export default ErrorMsg