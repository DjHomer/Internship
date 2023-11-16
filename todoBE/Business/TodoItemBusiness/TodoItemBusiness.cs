using todoBE.Models;
using todoBE.Repository;

namespace todoBE.Business;

public class TodoItemBusiness : ITodoItemBusiness
{
    private readonly ITodoItemRepository _todoItemRepository;


     public TodoItemBusiness(ITodoItemRepository todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public void CreateTodoItem(TodoItem tdi)
    {
        //check from cookie who is creating the list?
        
        tdi.IsDone = false;

        _todoItemRepository.CreateTodoItem(tdi);
    }

    public TodoItem GetTodoItemId(int todoItemId)
    {
        TodoItem tdi = _todoItemRepository.GetTodoItemId(todoItemId);
        return tdi;
    }

    public List<List<TodoItem>> GetTodoItemsDay(int listId, DateTime d)
    {
        //check if valid list/date
        return _todoItemRepository.GetTodoItemsDay(listId, d);
    }

    public void ToggleIsDone(TodoItem tdi)
    {
        //check if employeeId is legit?!
        _todoItemRepository.ToggleIsDone(tdi);
    }
}