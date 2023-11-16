const portUrl = import.meta.env.VITE_PORTURL
const ListUrl = "List"

async function getListsFromEmployee(id, token)
{

    let fetchUrl = portUrl + ListUrl + "/GetListsFromEmployee/"
    fetchUrl += id
    
    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',

          },
    credentials: 'include'
    });

    if(response.status === 401)
        throw new Error('Unauthorized')
    
    const data = await response.json();
    return data;
}

async function createList(list)
{
    let fetchUrl = portUrl + ListUrl + "/CreateList"
  
    const response = await fetch(fetchUrl, 
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body:JSON.stringify(list)
    })

    if(response.status === 401)
        throw new Error('Unauthorized')

    const data = await response.json();
    return data
    

}

async function sendListInviteEmployee(list, employeeMail, token)
{
    let fetchUrl = portUrl + ListUrl + "/SendListInviteEmployee/"
    fetchUrl += employeeMail
  
    const response = await fetch(fetchUrl, 
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body:JSON.stringify(list)
    })

    if(response.status === 401)
        throw new Error('Unauthorized')

    const data = await response.json();
    return data
    

}

async function getListInfo(employeeId, listId, token)
{

    let fetchUrl = portUrl + ListUrl + "/GetListInfo/"
    fetchUrl += listId
    fetchUrl += "/" + employeeId
    
    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request

    });

    if(response.status === 401)
        throw new Error('Unauthorized')
    
    const data = await response.json();
    return data;
}

async function joinList(invKey, token)
{
    let fetchUrl = portUrl + ListUrl + "/JoinList"
    fetchUrl += "?invKey="+invKey
  
    const response = await fetch(fetchUrl, 
    {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request

    })

    if(response.status === 401)
        throw new Error('Unauthorized')

    const data = await response.json();
    return data
}

async function getListName(listId)
{
    let fetchUrl = portUrl + ListUrl + "/GetListName/"
    fetchUrl += listId

    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });
    
    const data = await response.json();
    return data

}

async function isListAvailable(listId)
{
    let fetchUrl = portUrl + ListUrl + "/IsListAvailable/"
    fetchUrl += listId

    const response = await fetch(fetchUrl,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
    });
    
    const data = await response.json();
    return data
}



export default {
    getListsFromEmployee,
    getListInfo,
    createList,
    sendListInviteEmployee,
    joinList,
    getListName,
    isListAvailable
}