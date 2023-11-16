using todoBE.Models;
namespace todoBE.Repository;

public interface IEmployeeRepository
{
    void CreateEmployee(Employee newEmployee);
    List<Employee> GetAllEmployees();
    Employee? GetEmployeeMail(string email);
    List<Employee> GetSharedListEmployees(int listId);
}