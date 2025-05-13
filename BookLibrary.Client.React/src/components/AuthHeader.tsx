import { Link } from "react-router-dom";

const AuthHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 fixed w-screen h-[60px] top-0">
      <nav className=" md:w-[96%] mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
              Book Library
            </Link>
          </div>

        </div>
      </nav>
    </header>
  )
}

export default AuthHeader