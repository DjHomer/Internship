using todoBE.Models;
namespace todoBE.Repository;

public interface ITodoItemRepository
{
    void CreateTodoItem(TodoItem tdi);
    TodoItem GetTodoItemId(int todoItemId);
    List<List<TodoItem>> GetTodoItemsDay(int listId, DateTime d);
    List<TodoItem> GetTodoItemsList(int listId);
    void ToggleIsDone(TodoItem tdi);
}