using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace todoBE.Models;

public class Employee
{
    [Key]
    public int Id { get; set; }

    [MaxLength(50)]
    public string Email { get; set; } = "";

    [MaxLength(50)]
    public string FirstName { get; set; } = "";

    [MaxLength(50)]
    public string LastName { get; set; } = "";

    public string ProfilePicUrl {get; set;} = "";

    [JsonIgnore]
    public List<CollaborativeListInvitation>? Invitations { get; set; }

    [JsonIgnore]
    public List<SharedList>? SharedLists { get; set;}

    [JsonIgnore]
    public List<TodoItem>? TodoItems { get; set; }




}