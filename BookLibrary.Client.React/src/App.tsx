import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import VerifyAuth from './Auth/VerifyAuth';
import { useApp } from './Hooks/useApp';
import AdminLayout from './Layout/AdminLayout';
import Layout from './Layout/AuthLayout';
import HomeLayout from './Layout/HomeLayout';
import Book from './Pages/Book/Admin/Book';
import Create from './Pages/Book/Create';
import Delete from './Pages/Book/Delete';
import Details from './Pages/Book/Details';
import Edit from './Pages/Book/Edit';
import Index from './Pages/Book/Index';
import ByCategory from './Pages/Category/ByCategory';
import CreateCategory from './Pages/Category/CreateCategory';
import DeleteCategory from './Pages/Category/DeleteCategory';
import EditCategory from './Pages/Category/EditCategory';
import ViewCategoryDetails from './Pages/Category/ViewCategory';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import UserProfile from './Pages/Profile/UserProfile';
import User from './Pages/User/User';
import UserDetails from './Pages/User/UserDetails';
import AccountRestrictedPage from './Pages/AccountRestrictedPage';
import MyBooks from './Pages/Book/MyBooks';

function App() {
    const {currentRole} = useApp()

    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path='Auth' >
                        <Route path='login' element={<Login />} />
                        <Route path='Register' element={<Register />} />
                    </Route>
                    <Route path="/account-restricted" element={<AccountRestrictedPage />} />
                </Route>
                {
                    currentRole !== "Admin" ? (
                        <Route path='/' element={<HomeLayout />} >
                            <Route path='/Books' element={<VerifyAuth />}>
                                <Route index element ={<Index />} />
                                <Route path='Edit/:id' element={<Edit />} />
                                <Route path='Create' element={<Create />} />
                                <Route path='Delete/:id' element={<Delete />} /> 
                                <Route path='Details/:id' element={<Details />} />
                            </Route>
                            <Route path='/mybooks' element={<VerifyAuth />}>
                                <Route index element ={<MyBooks />} />
                            </Route>
                            <Route path='/categories' element={<VerifyAuth />}>
                                <Route index element ={<ByCategory />} />
                                <Route path='Details/:id' element={<ViewCategoryDetails />} />
                            </Route>
                            <Route path='/profile' element={<VerifyAuth />}>
                                <Route index element ={<UserProfile />} />
                            </Route>
                        </Route>
                    ) : (
                        <Route path='/' element={<AdminLayout />} >
                            <Route path='/Books' element={<VerifyAuth />}>
                                <Route index element ={<Book />} />
                                <Route path='Edit/:id' element={<Edit />} />
                                <Route path='Create' element={<Create />} />
                                <Route path='Delete/:id' element={<Delete />} /> 
                                <Route path='Details/:id' element={<Details />} />
                            </Route>
                            <Route path='/mybooks' element={<VerifyAuth />}>
                                <Route index element ={<MyBooks />} />
                            </Route>
                            <Route path='/categories' element={<VerifyAuth />}>
                                <Route index element ={<ByCategory />} />
                                <Route path='Details/:id' element ={<ViewCategoryDetails />} />
                                <Route path='Create' element={<CreateCategory />} />
                                <Route path='Edit/:id' element={<EditCategory />} />
                                <Route path='Delete/:id' element={<DeleteCategory />} />
                            </Route>
                            <Route path='/users' element={<VerifyAuth />}>
                                <Route index element ={<User />} />
                                <Route path='Details/:id' element ={<UserDetails />} />
                            </Route>
                            <Route path='/profile' element={<VerifyAuth />}>
                                <Route index element ={<UserProfile />} />
                            </Route>
                        </Route>
                    )}
                <Route path='*' element={<NotFound />} />
            </Routes>       
        </>
    )
}
export default App;