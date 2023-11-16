using todoBE.Models;
using Microsoft.EntityFrameworkCore;

namespace todoBE.Repository;


public class ListRepository : IListRepository
{
    
    public TodoContext Context { get; set; }

    public ListRepository(TodoContext context) => Context = context;

    public List<List> GetListsFromEmployee(int employeeId)
    {

        return Context.Lists
            .Where(l => l.OwnerId == employeeId || 
                Context.SharedLists!.Any(sl => sl.ListId == l.Id && sl.EmployeeId == employeeId))
				.Include(l => l.Owner)
                .ToList();
           
    }

    public List CreateList(List l)
    {

        Context.Lists.Add(l);
        Context.SaveChanges();

        var retList = Context.Lists
            .Where(li => li.Id == l.Id)
            .Include(l => l.Owner)
            .FirstOrDefault();

        if(retList is null)
            throw new NullReferenceException("List not found!");

        return retList;
    }

    public CollaborativeListInvitation GetListInvitation(string invKey)
    {
        
        var listInv = Context.CollaborativeListInvitations.Where(cli => cli.Invitationkey == invKey).FirstOrDefault();

        if(listInv is null)
            return new CollaborativeListInvitation //Bad idea??
            {
                Id = 0,
                EmployeeId = 0,
                ListId = 0,
                Invitationkey = ""
            };

        return listInv;
    }

    public void CreateListInvitation(CollaborativeListInvitation collaborativeListInvitation)
    {

        Context.CollaborativeListInvitations.Add(collaborativeListInvitation);
        Context.SaveChanges();

        
    }

    public void InvalidateInvKey(string invKey)
    {
        
        var cli = Context.CollaborativeListInvitations.Where(e => e.Invitationkey == invKey).FirstOrDefault();

        if(cli is null)
             throw new NullReferenceException("Doslo je do greske servera");

        cli.TimeIssued = cli.TimeIssued.AddDays(-1);
        Context.SaveChanges();
    }

    public void CreateSharedList(SharedList sl)
    {

        Context.SharedLists.Add(sl);
        Context.SaveChanges();

    }

    public List? GetList(int listId)
    {
        
        return Context.Lists.Find(listId);
    }

    public bool EmployeeHasAccessToList(int employeeId, int listId)
    {
        bool listExists = Context.Lists!.Any(l => l.Id == listId);

        if (!listExists)
        {
            return true;//NECU DA MI VRATI 403, NEK BUDE 200 ZA SAD, INVALID LIST ID RESAVAM NA KLIJENTU
        }
        bool hasAccess = Context.Lists!
        .Any(l => l.Id == listId && (l.OwnerId == employeeId || 
                Context.SharedLists!.Any(sl => sl.ListId == l.Id && sl.EmployeeId == employeeId)));
    
        return hasAccess;
    }
}
