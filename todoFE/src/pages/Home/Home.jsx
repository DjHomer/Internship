import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import employeeService from '../../core/services/employee.service'
import { useNavigate } from "react-router-dom";
import AuthContext from '../../core/context/AuthProvider';
import Loader from '../../components/Loader/Loader';
import Sidebar from '../../components/Sidebar/Sidebar';
import ListDetails from '../../components/ListDetails/ListDetails';
import MiddleContent from '../../components/MiddleContent/MiddleContent';
import listService from '../../core/services/list.service';
import SidebarGuest from '../../components/SidebarGuest/SidebarGuest';
import MiddleUnauthorized from '../../components/MiddleUnauthorized/MiddleUnauthorized';



export default function Home() {

  const [employee, setEmployee] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isListAllowed, setIsListAllowed] = useState(false)
  const [empLists, setEmpLists] = useState([])
  const [activeList, setActiveList] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(0)
  let { idParams } = useParams();
  let numberId = parseInt(idParams);


  const navigate = useNavigate();
  const {tokenContext, setTokenContext} = useContext(AuthContext);

  const activeListDetails = empLists.find(list => list.id === activeList);


//DEPRECATED, USING COOKIES NOW
  function withTokenValidation(serviceFunction) {
    return async function wrappedServiceFunction(...args) {
      try {
        const response = await serviceFunction(...args, tokenContext);
        return response;
      } catch (error) {
        if (error.message === 'Unauthorized') {//statuscode
          //Cookies.remove("token")
          setTokenContext(null)
          navigate("/login")
        }
      }
    };
  }


  let activeListChanged = (id) => {
    navigate("/home/"+id)
    setActiveList(id)
  }
  let rerenderListDetails = () => {
    setRerender(rerender+1)
  }

  useEffect(() => {

    employeeService.getEmployeeMail().then(resEmp => {

      if(resEmp.status && resEmp.status === 401)
      {
        if(isNaN(numberId))
          navigate("/login")
        
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)
      
      setEmployee(resEmp)

      listService.getListsFromEmployee(resEmp.id).then(lists => {

        console.log("Tu su liste!")
        console.log(lists)
        const privateList = lists.find(list => list.isPrivate === true)

        const sortedLists = lists.sort((a, b) => {
          if (a.isPrivate && !b.isPrivate) {
            return -1;
          } else if (!a.isPrivate && b.isPrivate) {
            return 1;
          }
          return 0;
        });

        setEmpLists(sortedLists)

        if(!isNaN(numberId))
        {
          console.log("Broj je!")
          console.log(numberId)
          listService.isListAvailable(numberId).then(resAvailable => {
            console.log(resAvailable)
            if(resAvailable.status && resAvailable.status == 403)
            {
              setIsListAllowed(false)
              setLoading(false)
              return
            }

            setIsListAllowed(true)
            const listWithId = lists.find(list => list.id === numberId);
            setActiveList(listWithId ? numberId : privateList.id);
            setLoading(false)
            
          })
          
        }
        else
        {
          setActiveList(privateList.id);
          setIsListAllowed(true)
          setLoading(false);     
        }

      })

    })
  },[])


  
  return (
    <div>
    {loading ? (
      <Loader />
    ) : (isAuthenticated && isListAllowed) ? (
      <div className='main'>
        <Sidebar
          employee={employee}
          withTokenValidation={withTokenValidation}
          empLists={empLists}
          setEmpLists={setEmpLists}
          activeList={activeList}
          activeListChanged={activeListChanged}
        />
        <MiddleContent
          activeListId={activeList}
          withTokenValidation={withTokenValidation}
          employeeId={employee.id}
          employeeName={employee.firstName}
          rerenderListDetails={rerenderListDetails}
        />
        <ListDetails
          employee={employee}
          activeListId={activeList}
          activeListDetails={activeListDetails}
          withTokenValidation={withTokenValidation}
          rerender={rerender}
        />
      </div>
    ) : isAuthenticated && !isListAllowed ? (
      <>
        <Sidebar 
          employee={employee}
          withTokenValidation={withTokenValidation}
          empLists={empLists}
          setEmpLists={setEmpLists}
          activeList={activeList}
          activeListChanged={activeListChanged}
        />
        <MiddleUnauthorized listId={numberId} isAuthenticated={isAuthenticated} />
      </>
    ) : (
      <div className='main'>
        <SidebarGuest />
        <MiddleUnauthorized listId={numberId} isAuthenticated={isAuthenticated} />
      </div>
    )}
  </div>
  )
}
