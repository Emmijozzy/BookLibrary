import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import VerifyAuth from './Auth/VerifyAuth';
import Layout from './Layout/AuthLayout';
import HomeLayout from './Layout/HomeLayout';
import Create from './Pages/Book/Create';
import Delete from './Pages/Book/Delete';
import Details from './Pages/Book/Details';
import Edit from './Pages/Book/Edit';
import Index from './Pages/Book/Index';
import ByCategory from './Pages/Category/ByCategory';
import CreateCategory from './Pages/Category/CreateCategory';
import EditCategory from './Pages/Category/EditCategory';
import ViewCategoryDetails from './Pages/Category/ViewCategory';
import Home from './Pages/Home';
import DeleteCategory from './Pages/Category/DeleteCategory';
import { ToastContainer } from 'react-toastify';

function App() {

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
                </Route>
                <Route path='/' element={<HomeLayout />} >
                    <Route path='/Books' element={<VerifyAuth />}>
                        <Route index element ={<Index />} />
                        <Route path='Edit/:id' element={<Edit />} />
                        <Route path='Create' element={<Create />} />
                        <Route path='Delete/:id' element={<Delete />} /> 
                        <Route path='Details/:id' element={<Details />} />
                    </Route>
                    <Route path='/categories' element={<VerifyAuth />}>
                        <Route index element ={<ByCategory />} />
                        <Route path='Edit/:id' element={<EditCategory />} />
                        <Route path='Create' element={<CreateCategory />} />
                        <Route path='Delete/:id' element={<DeleteCategory />} /> 
                        <Route path='Details/:id' element={<ViewCategoryDetails />} />
                    </Route>
                </Route>
            </Routes>       
        </>
    )


}

export default App;