using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using todoBE.Business;
using todoBE.Models;

namespace todoBE.Controllers;

[ApiController]
[Route("[controller]")]
public class ListController : ControllerBase
{
    private readonly IListBusiness _listBusiness;

    public ListController(IListBusiness listBusiness)
    {
        _listBusiness = listBusiness;
    }

    [Authorize] 
    [Route("GetListsFromEmployee/{employeeId}")]
    [HttpGet]
    public ActionResult GetListsFromEmployee(int employeeId)
    {
        //Later: USE ID FROM COOKIE
        List<List> lists = _listBusiness.GetListsFromEmployee(employeeId); 
        return Ok(lists);
    }

    
    [Route("GetListInfo/{listId}/{employeeId}")]
    [HttpGet]
    public ActionResult GetListInfo(int employeeId, int listId)
    {
        ListInfoDTO lid = _listBusiness.GetListInfo(employeeId, listId);  
        return Ok(lid);
    }

    [Authorize]
    [Route("SendListInviteEmployee/{employeeMail}")]
    [HttpPost]
    public ActionResult SendListInviteEmployee(string employeeMail, List li)
    {
        string retKey = _listBusiness.SendListInviteEmployee(employeeMail, li);
        return Ok(retKey);
    }

    [Authorize] 
    [Route("CreateList")]
    [HttpPost]
    public ActionResult CreateList(List li)
    {
        List liRet = _listBusiness.CreateList(li); 
        return Ok(liRet);
    }

    
    [Authorize] 
    [Route("JoinList")]
    [HttpPut]
    public ActionResult JoinList(string invKey = "")
    {
        CollaborativeListInvitation cli = _listBusiness.JoinList(invKey); 
        return Ok(cli);
    }

    [Route("GetListName/{listId}")]
    [HttpGet]
    public ActionResult GetListName(int listId)
    {
        string nameOfList = _listBusiness.GetListName(listId);
        return Ok(new
            {
            listName = nameOfList
            });
    }

    [Authorize]
    [Route("IsListAvailable/{listId}")]
    [HttpGet]
    public ActionResult IsListAvailable(int listId)
    {
        var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
        string email = emailClaim!.Value;
        
        _listBusiness.IsListAvailable(email, listId);
        return Ok(new{
            response = "List available!"
        });
    }


}