const portUrl = import.meta.env.VITE_PORTURL
const EmployeeUrl = "Employee"

async function getEmployeeMail()
{

    let fetchUrl = portUrl + EmployeeUrl + "/GetEmployeeMail"
    
    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',

          },
        credentials: 'include' // Include cookies in the request
    });
    console.log(response)
    //if(response.status === 401)
        //throw new Error('Unauthorized') //jer sve errore catchujes na be??
    
    const data = await response.json();
    return data;
}

async function getSharedListEmployees(listId, token)
{
    let fetchUrl = portUrl + EmployeeUrl + "/GetSharedListEmployees/"
    fetchUrl += listId
    
    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        credentials: 'include' // Include cookies in the request

    });

    //if(response.status === 401)
   //     throw new Error('Unauthorized') //jer sve errore catchujes na be??
    
    const data = await response.json();
    return data;

}

async function loginWithGoogle(employee)
{
    let fetchUrl = portUrl + EmployeeUrl + "/LoginWithGoogle"

    const response = await fetch(fetchUrl,{
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body:JSON.stringify(employee)
    });

    const data = await response.json(); //ako vratim obican string, kako dobijam result?
    return data;
}

async function loginWithGoogleAsync(accessToken)
{
    let fetchUrl = portUrl + EmployeeUrl + "/LoginWithGoogleAsync/"
    fetchUrl += accessToken

    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
          },
        credentials: 'include'
    });
    return response;
}

async function logout()
{
    let fetchUrl=portUrl + EmployeeUrl + "/Logout";

    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
          },
        credentials: 'include'

    })
    
    return response;
}

async function isAuthenticated()
{
    let fetchUrl = portUrl + EmployeeUrl +"/IsAuthenticated"

    
    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
          },
        credentials: 'include'

    })

    const data = await response.json();
    return data;
}

export default {
    getEmployeeMail,
    loginWithGoogle,
    loginWithGoogleAsync,
    getSharedListEmployees,
    logout,
    isAuthenticated
}