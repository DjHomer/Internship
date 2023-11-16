using todoBE.Models;

namespace todoBE.Business;

public interface IListBusiness
{
    List CreateList(List li);
    List<List> GetListsFromEmployee(int employeeId);
    public ListInfoDTO GetListInfo(int employeeId, int listId);
    string SendListInviteEmployee(string employeeMail, List li);
    CollaborativeListInvitation JoinList(string invKey);
    string GetListName(int listId);
    void IsListAvailable(string email, int listId);
}