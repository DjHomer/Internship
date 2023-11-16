using System.Security.Claims;
using todoBE.Models;

namespace todoBE.Business;

public interface IEmployeeBusiness
{
    //string AuthenticateWithGoogle(Employee emp);
    Task<List<Claim>> AuthenticateWithGoogleAsync(string googleAccessToken);
    List<Employee> GetAllEmployees();
    Employee GetEmployeeMail(string email);
    List<Employee> GetSharedListEmployees(int listId);

}