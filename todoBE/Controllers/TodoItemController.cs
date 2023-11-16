using Microsoft.AspNetCore.Mvc;
using todoBE.Business;
using todoBE.Models;

namespace todoBE.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoItemController : ControllerBase
{
    private readonly ITodoItemBusiness _todoItemBusiness;

    public TodoItemController(ITodoItemBusiness todoItemBusiness)
    {
        _todoItemBusiness = todoItemBusiness;
    }

    [Route("GetTodoItemsDay/{listId}")]
    [HttpGet]
    public ActionResult GetTodoItemsDay(int listId, DateTime d) 
    {
        List<List<TodoItem>> items = _todoItemBusiness.GetTodoItemsDay(listId, d); 
        return Ok(new{
            UncompletedItems = items[0],
            TodaysItems = items[1]
        });
    }

    [Route("CreateTodoItem")]
    [HttpPost]
    public ActionResult CreateTodoItem(TodoItem tdi) 
    {
        _todoItemBusiness.CreateTodoItem(tdi); 
        return Ok(tdi);
    }

    [Route("ToggleIsDone")] 
    [HttpPut]
    public ActionResult ToggleIsDone(TodoItem tdi) 
    {
        _todoItemBusiness.ToggleIsDone(tdi);
        TodoItem tdiRet = _todoItemBusiness.GetTodoItemId(tdi.Id); 
        return Ok(tdiRet);
    }
}