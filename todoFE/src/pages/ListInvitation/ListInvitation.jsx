import React, { useContext, useEffect } from 'react'
import Loader from '../../components/Loader/Loader'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../../core/context/AuthProvider';
import listService from '../../core/services/list.service';

export default function ListInvitation() {

    const {tokenContext, setTokenContext} = useContext(AuthContext);

    const navigate = useNavigate();
    
    const {search} = useLocation()

    function withTokenValidation(serviceFunction) {
        return async function wrappedServiceFunction(...args) {
          try {
            const response = await serviceFunction(...args, tokenContext);
            return response;
          } catch (error) {
            if (error.message === 'Unauthorized') {//statuscode better
              Cookies.remove("token")
              setTokenContext(null)
              navigate("/login")
            }
          }
        };
    }

    const joinListWithValidation = withTokenValidation(listService.joinList)

    useEffect(() => {

        const params = new URLSearchParams(search)
        const invKeyUrl = params.get("invKey")

        joinListWithValidation(invKeyUrl).then(res => {
            console.log(res)
            navigate("/home")
        })


    },[])


  return (
    <div><Loader/></div>
  )
}
