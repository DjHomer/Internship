const portUrl = import.meta.env.VITE_PORTURL
const TodoUrl = "TodoItem"

async function getTodoItemsDay(listId, date, token)
{

    let fetchUrl = portUrl + TodoUrl + "/GetTodoItemsDay/"
    fetchUrl += listId
    fetchUrl += "?d=" + date
    
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

async function createTodoItem(todoItem, token)
{
    let fetchUrl = portUrl + TodoUrl + "/CreateTodoItem"
  
    const response = await fetch(fetchUrl, 
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body:JSON.stringify(todoItem)
    })

    if(response.status === 401)
        throw new Error('Unauthorized')

    const data = await response.json();
    return data
    

}

async function toggleIsDone(todoItem, token)
{

    let fetchUrl = portUrl + TodoUrl + "/ToggleIsDone"
    
    const response = await fetch(fetchUrl,{
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body:JSON.stringify(todoItem)

    });

    if(response.status === 401)
        throw new Error('Unauthorized')
    
    const data = await response.json();
    return data;
}






export default {
    getTodoItemsDay,
    toggleIsDone,
    createTodoItem
}