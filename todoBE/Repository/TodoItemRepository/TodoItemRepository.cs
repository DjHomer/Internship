using Microsoft.EntityFrameworkCore;
using todoBE.Models;

namespace todoBE.Repository;

public class TodoItemRepository : ITodoItemRepository
{
    
    public TodoContext Context { get; set; }

    public TodoItemRepository(TodoContext context) => Context = context;

    public List<List<TodoItem>> GetTodoItemsDay(int listId, DateTime d)
    {
        
        List<List<TodoItem>> retLists = new List<List<TodoItem>>();


        var uncompletedItems = Context.TodoItems
        .Where(item => item.ListId == listId && 
                    ((item.IsDone == false && item.DateCreated.Date < d.Date) || 
                     (item.DateFinished.HasValue && item.DateFinished.Value.Date == d.Date && item.DateCreated.Date < d.Date)))
        .Include(to => to.DoneBy)
        .ToList();

        retLists.Add(uncompletedItems);

        var todaysItems = Context.TodoItems
        .Where(item => item.ListId == listId && item.DateCreated.Date == d.Date)
        .Include(to => to.DoneBy)
        .ToList();

        retLists.Add(todaysItems);

        return retLists;
      
    }

    public void ToggleIsDone(TodoItem tdi)
    {

        var tdiRet = Context.TodoItems.Find(tdi.Id);

        if(tdiRet is null) //coalesce expression?!?!
            throw new Exception("Item not found!!");
        
        tdiRet.IsDone = !tdi.IsDone;
        if(tdiRet.IsDone == true)
        {
            tdiRet.DoneById = tdi.DoneById;
            tdiRet.DateFinished = tdi.DateFinished;
        }
        else
        {
            tdiRet.DateFinished = null;
            tdiRet.DoneById = null;
        }
        
        Context.SaveChanges();
    }

    public void CreateTodoItem(TodoItem tdi)
    {

        Context.TodoItems.Add(tdi);
        Context.SaveChanges();

    }

    public List<TodoItem> GetTodoItemsList(int listId)
    {
            
        var tdi =  Context.TodoItems
            .Where(item => item.ListId == listId)
            .Include(t => t.DoneBy);

        int c = tdi.Count();
        return tdi.ToList();
    }

    public TodoItem GetTodoItemId(int todoItemId)
    {
       
        var tdi = Context.TodoItems.Where(td => td.Id == todoItemId).Include(t => t.DoneBy).FirstOrDefault();
        if(tdi is null)
            throw new NullReferenceException("Item not found!");
        return tdi;
    }
}