import Footer from "../components/Footer"
import Main from "../components/Main"
import AuthHeader from "../components/AuthHeader"


const AuthLayout = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <AuthHeader />
      <Main />
      <Footer />
    </div>
  )
}
export default AuthLayout