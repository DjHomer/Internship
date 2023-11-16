using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using todoBE.Business;
using todoBE.Models;

namespace todoBE.Controllers;

[ApiController]
[Route("[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeBusiness _employeeBusiness;

    public EmployeeController(IEmployeeBusiness employeeBusiness)
    {
        _employeeBusiness = employeeBusiness;
    }
    
    [Authorize] 
    [Route("GetAllEmployees")]
    [HttpGet]
    public ActionResult GetAllEmployees()
    {
        List<Employee> employees = _employeeBusiness.GetAllEmployees();
        return Ok(employees);

    }

    [Authorize] 
    [Route("GetEmployeeMail")]
    [HttpGet]
    public ActionResult GetEmployeeMail()
    {
        var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
        string emailCookie = emailClaim!.Value;
   
        Employee employee = _employeeBusiness.GetEmployeeMail(emailCookie);
        return Ok(employee);

    }

    
    [Authorize] 
    [Route("GetSharedListEmployees/{listId}")]
    [HttpGet]
    public ActionResult GetSharedListEmployees(int listId)
    {
        List<Employee> emps = _employeeBusiness.GetSharedListEmployees(listId);
        return Ok(emps);
    }

    /*DEPRECATED, USING COOKIES NOW
    [Route("LoginWithGoogle")]
    [HttpPost]
    public IActionResult AuthenticateWithGoogle(Employee emp)
    {
        string jwt = _employeeBusiness.AuthenticateWithGoogle(emp);
        return Ok(new {
            token = jwt
        });
    }
*/
    [Route("LoginWithGoogleAsync/{googleAccessToken}")]
    [HttpGet]
    public async Task<IActionResult> AuthenticateWithGoogleAsync(string googleAccessToken)
    {
        var empClaims = await _employeeBusiness.AuthenticateWithGoogleAsync(googleAccessToken);

        var identity = new ClaimsIdentity(empClaims,"CookieAuthentication");
        var principle = new ClaimsPrincipal(identity);

       await HttpContext.SignInAsync("CookieAuthentication", principle);

        return Ok("Authentication successful");
    }

    [Route("Logout")]
    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("CookieAuthentication");
        return Ok("Signed out successfully!");
    }


    [Route("IsAuthenticated")]
    [HttpGet]
    public IActionResult IsAuthenticated()
    {
        return Ok(new {
            isAuthenticated = HttpContext.User.Identity!.IsAuthenticated
        });
    }

    [Route("TestCookieSession")]
    [HttpGet]
    public IActionResult TestCookieSession()
    {
        var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
        string email = emailClaim!.Value;


        return Ok(email);
    }

}