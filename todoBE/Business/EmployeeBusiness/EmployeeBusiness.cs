using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;
using todoBE.Models;
using todoBE.Repository;
using Newtonsoft.Json.Linq;



namespace todoBE.Business;

public class EmployeeBusiness : IEmployeeBusiness
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;





     public EmployeeBusiness(IEmployeeRepository employeeRepository, IConfiguration configuration, HttpClient httpClient)
    {
        _employeeRepository = employeeRepository;
        _configuration = configuration;
        _httpClient = httpClient;
    }


    public List<Employee> GetAllEmployees()
    {
        return _employeeRepository.GetAllEmployees();
    }

    private bool IsValidEmail(string email)
    {
        string emailRegex = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        Regex regex = new Regex(emailRegex);

        return regex.IsMatch(email);
    }

    
    /* DEPRECATED, USING COOKIES NOW
    public string AuthenticateWithGoogle(Employee emp)
    {
        if(!IsValidEmail(emp.Email))
            throw new ValidationException("Email invalid!");
    
        var existingEmployee = _employeeRepository.GetEmployeeMail(emp.Email);

        if (existingEmployee == null)
            _employeeRepository.CreateEmployee(emp);
   
        string retJwt = CreateToken(emp.Email);
        return retJwt;
   
    }

    private string CreateToken(string email)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email)
        };
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!)
            );

        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: cred
            
        );
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;

    }
*/
    private List<Claim> CreateClaims(string email, int id)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim("EmployeeId", id.ToString())
        };

        return claims;
    }

    public Employee GetEmployeeMail(string email)
    {
        if(!IsValidEmail(email))
            throw new ValidationException("Email invalid!");
            
        var emp = _employeeRepository.GetEmployeeMail(email);
        
        if(emp is null)
            throw new NullReferenceException("Employee not found!");
            
        return emp;    
    }

    public List<Employee> GetSharedListEmployees(int listId)
    {
        return _employeeRepository.GetSharedListEmployees(listId);
    }

    public async Task<List<Claim>> AuthenticateWithGoogleAsync(string googleAccessToken)
    {
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {googleAccessToken}");
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");


        HttpResponseMessage response = await _httpClient.GetAsync("https://www.googleapis.com/oauth2/v1/userinfo");

        if(!response.IsSuccessStatusCode)
           throw new Exception($"Error: {response.StatusCode}");

       
        string responseBody = await response.Content.ReadAsStringAsync();

        JObject jsonObject = JObject.Parse(responseBody);

        string email = (string)jsonObject["email"]!;
        string givenName = (string)jsonObject["given_name"]!;
        string familyName = (string)jsonObject["family_name"]!;
        string pictureUrl = (string)jsonObject["picture"]!;

        Employee em = new()
        {
            Email = email,
            FirstName = givenName,
            LastName = familyName,
            ProfilePicUrl = pictureUrl
        };

        var existingEmployee = _employeeRepository.GetEmployeeMail(email);

        if (existingEmployee == null)
            _employeeRepository.CreateEmployee(em);
   
        return CreateClaims(email, em.Id);

    }
}