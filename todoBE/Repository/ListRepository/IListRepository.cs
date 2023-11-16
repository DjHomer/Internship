using todoBE.Models;
namespace todoBE.Repository;

public interface IListRepository
{
    void CreateSharedList(SharedList sl);
    List CreateList(List l);
    void CreateListInvitation(CollaborativeListInvitation collaborativeListInvitation);
    CollaborativeListInvitation GetListInvitation(string invKey);
    List<List> GetListsFromEmployee(int employeeId);
    void InvalidateInvKey(string invKey);
    List? GetList(int listId);
    bool EmployeeHasAccessToList(int employeeId, int listId);
}