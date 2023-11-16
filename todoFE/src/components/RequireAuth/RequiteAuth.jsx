import { useState, useContext, useEffect } from "react";
import{useLocation, Navigate,Outlet} from "react-router-dom"
import AuthContext from "../../core/context/AuthProvider";
import Cookies from "js-cookie"
import employeeService from "../../core/services/employee.service";


const RequireAuth = () => {

    const {tokenContext, setTokenContext} = useContext(AuthContext);
    const location = useLocation();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() =>{

        employeeService.isAuthenticated().then(res => {

            setAuthenticated(res.isAuthenticated)
        })
        
    },[tokenContext])

    useEffect(() =>{
        
        employeeService.isAuthenticated().then(res => {

            setAuthenticated(res.isAuthenticated)
        })
       
    },[]) 


    return(
        authenticated
        ? <Outlet/>
        : <Navigate to="/login" state={{from:location}} replace/>
    );
}

export default RequireAuth