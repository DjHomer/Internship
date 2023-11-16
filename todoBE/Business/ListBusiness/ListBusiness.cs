using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using todoBE.Helper;
using todoBE.Models;
using todoBE.Repository;
using todoBE.Template;

namespace todoBE.Business;

public class ListBusiness : IListBusiness
{
    private readonly IListRepository _listRepository;
    private readonly ITodoItemRepository _todoItemRepository;

    private readonly IEmployeeBusiness _employeeBusiness;

    private readonly IConfiguration _configuration;


     public ListBusiness(IListRepository listRepository, ITodoItemRepository todoItemRepository, IEmployeeBusiness employeeBusiness, IConfiguration configuration)
    {
        _listRepository = listRepository;
        _todoItemRepository = todoItemRepository;
        _employeeBusiness = employeeBusiness;
        _configuration = configuration;

    }

    public List CreateList(List li)
    {
        //Validate ownerId and does he have a list with the name?
        li.IsPrivate = false;
     
       List retList =  _listRepository.CreateList(li);
       return retList;

    }

    public List<List> GetListsFromEmployee(int employeeId)
    {
        return _listRepository.GetListsFromEmployee(employeeId);
    }

  public ListInfoDTO GetListInfo(int employeeId, int listId)
    {
        //provera sa cookie-em??
        List<TodoItem> tdis = _todoItemRepository.GetTodoItemsList(listId);

        int totalTasks = tdis.Count;
        int completedTasks = tdis.Count(item => item.IsDone);
        int completedByMe = tdis.Count(item => item.IsDone && item.DoneById == employeeId);
        return new ListInfoDTO
        {
            TotalTasks = totalTasks,
            CompletedTasks = completedTasks,
            CompletedByMe = completedByMe
        };
    }

    public string SendListInviteEmployee(string employeeMail, List li)
    {
        Employee empRet = _employeeBusiness.GetEmployeeMail(employeeMail);

        //test if valid list and if valid employee matches?

        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();

        int keyLength = 15;
        bool search = true;
        string randomKey = "";
        while(search)
        {
            randomKey = new string(Enumerable.Repeat(chars, keyLength).Select(s => s[random.Next(s.Length)]).ToArray());
            CollaborativeListInvitation cli = _listRepository.GetListInvitation(randomKey);
            if(cli.EmployeeId == 0)
                search = false;
        }

        _listRepository.CreateListInvitation(new CollaborativeListInvitation{

            EmployeeId = empRet!.Id,
            ListId = li.Id,
            TimeIssued = DateTime.Now,
            Invitationkey = randomKey

        }); 

        SendHtmlMail(empRet, li, randomKey, "Collaborative List Invite");

        return randomKey;
    }

    private void SendHtmlMail(Employee emp, List li, string key, string msgSubject)
    {
        string retBody = EmailTemplate.InvitationTemplate(emp.FirstName, emp.LastName, li.Owner!.FirstName, 
                                                        li.Owner.LastName, li.Owner.Email, li.Name, key);


        MailMessage mail = new MailMessage();
        SmtpClient smtpClient = new SmtpClient(_configuration["Smtp:Host"]);

        mail.From = new MailAddress(_configuration["Smtp:Username"]!);
        mail.To.Add(emp.Email);
        mail.Subject = msgSubject;
        mail.IsBodyHtml = true;
        mail.Body = retBody;

        smtpClient.Port = Int32.Parse(_configuration["Smtp:Port"]!);
        smtpClient.Credentials = new System.Net.NetworkCredential(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);
        smtpClient.EnableSsl = true;

        smtpClient.Send(mail);


    }

    public CollaborativeListInvitation JoinList(string invKey)
    {

        if(string.IsNullOrWhiteSpace(invKey) || invKey.Length > 30)
                throw new ValidationException("Key nije validno unesen!");

        CollaborativeListInvitation cli = _listRepository.GetListInvitation(invKey);
        //check if employee matches ^

        if (cli.Id == 0)
            throw new NullReferenceException("Invalid link");
        
        TimeSpan timeElapsed = DateTime.Now - cli.TimeIssued;

        if (timeElapsed.TotalHours > 24)
            throw new Exception("Invitation link has expired.");

        //check if employee already in the list??
        SharedList sl = new SharedList
        {
            ListId = cli.ListId,
            EmployeeId = cli.EmployeeId
        };

        _listRepository.CreateSharedList(sl);


        _listRepository.InvalidateInvKey(invKey);
        
        return cli;
    }

    public string GetListName(int listId)
    {
        List? retList = _listRepository.GetList(listId);

        if(retList is null)
            throw new NullReferenceException("list not found!");
        
        if(retList.IsPrivate == true)
            throw new UnauthorizedAccessException("Can't access a private list!");
        
        return retList.Name;
    }

    public void IsListAvailable(string email, int listId)
    {
        Employee emp = _employeeBusiness.GetEmployeeMail(email);

        if(!_listRepository.EmployeeHasAccessToList(emp.Id,listId))
            throw new ForbiddenException("Access is forbidden for this user");

        
    }
}