using Microsoft.EntityFrameworkCore;
using todoBE.Models;
namespace todoBE.Repository;

public class EmployeeRepository : IEmployeeRepository
{
    
    public TodoContext Context { get; set; }

    public EmployeeRepository(TodoContext context) => Context = context;

    public List<Employee> GetAllEmployees()
    {
        List<Employee> employees = Context.Employees!.ToList();
        return employees;
    }

    public Employee? GetEmployeeMail(string email)
    {
        return Context.Employees?.FirstOrDefault(e => e.Email == email);
    }

    public List<Employee> GetSharedListEmployees(int listId)
    {
       
        return Context.Employees
            .Where(emp =>  
                Context.SharedLists!.Any(sl => sl.EmployeeId == emp.Id && sl.ListId == listId))
                .ToList();
           
    }

    public void CreateEmployee(Employee newEmployee)
    {
        Context.Employees?.Add(newEmployee);
        Context.SaveChanges();

         var newList = new List
            {
                Name = "My private todo list",
                OwnerId = newEmployee.Id,
                IsPrivate = true,
            };

        if(Context.Lists is null)
            throw new NullReferenceException("Internal error?!");

        Context.Lists.Add(newList);
        //da zoves ListRepository za create ili to da resis ovde?
        Context.SaveChanges();

    }


}