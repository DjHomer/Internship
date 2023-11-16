using todoBE.Business;
using todoBE.Repository;

namespace TimesheetBE.Helper;

public static class ServiceCollectionExtension
{
    public static void AddAllServices(this IServiceCollection services)
    {
        services.AddScoped<IEmployeeBusiness,EmployeeBusiness>();
        services.AddScoped<IEmployeeRepository,EmployeeRepository>();
        services.AddScoped<IListBusiness,ListBusiness>();
        services.AddScoped<IListRepository,ListRepository>();
        services.AddScoped<ITodoItemBusiness,TodoItemBusiness>();
        services.AddScoped<ITodoItemRepository, TodoItemRepository>();
        services.AddHttpClient();

      
    }
}