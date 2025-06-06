import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
    <p className="mx-auto -mt-4 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
        Welcome to
        <span className="border-b border-dotted border-slate-300">Book Library</span>
    </p>

    <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        <span className="inline-block">
            My
            <span className="relative whitespace-nowrap text-orange-600">
                <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-orange-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                <span className="relative">Personal</span>
            </span>
        </span>
        <span className="inline-block">Book Libary</span>
    </h1>

    <p className="mx-auto mt-9 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
        <span className="inline-block">Discover and Read</span>
        <span className="inline-block">the World's Best Books.</span>
    </p>

    <div className="mt-12 flex flex-col justify-center gap-y-5 sm:mt-10 sm:flex-row sm:gap-y-0 sm:gap-x-6">

        <Link className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:bg-blue-500 hover:text-blue-100 active:bg-blue-700 active:text-blue-300 focus-visible:outline-blue-600 animate-fade-in-left"
           to="Auth/Login">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24"
                 aria-hidden="true" className="h-3 w-3 flex-none" height="1em" width="1em"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M10 9V6.414L4.707 11.707a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L4 9.586 8.293 5.293A1 1 0 0 1 9 6v3h11a1 1 0 1 1 0 2H9v3.586l-3.293-3.293a1 1 0 0 1 0-1.414l6-6zM17 3h-6a3 3 0 0 0-3 3v4H7V6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a3 3 0 0 0-3 3v4h2v-4a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5V6a3 3 0 0 0-3-3h6a3 3 0 0 1 3 3v4h-1V6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a3 3 0 0 0-3 3v4H4v4h14v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4h-2v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v4H6v-4a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5V6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a1 1 0 0 1-1 1H4V6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a1 1 0 0 1-1-1v-4a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3V4h1v5a1 1 0 0 1 1 1h1V4a1 1 0 0 1 1-1h6V6h1V4a1 1 0 0 1 1-1z"></path>
            </svg>
            <span className="ml-3">Login</span>
        </Link>

        <Link className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white hover:bg-green-500 hover:text-green-100 active:bg-green-700 active:text-green-300 focus-visible:outline-green-600 animate-fade-in-right"
           to="Auth/Register">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24"
                 aria-hidden="true" className="h-3 w-3 flex-none" height="1em" width="1em"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0-7C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-18a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"></path>
            </svg>
            <span className="ml-3">Register</span>
        </Link>
    </div>

</div>


  )
}
export default Home