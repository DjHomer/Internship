using todoBE.Models;

namespace todoBE.Business;

public interface ITodoItemBusiness
{
    void CreateTodoItem(TodoItem tdi);
    TodoItem GetTodoItemId(int todoItemId);
    List<List<TodoItem>> GetTodoItemsDay(int listId, DateTime d);
    void ToggleIsDone(TodoItem tdi);
}