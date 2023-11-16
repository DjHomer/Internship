using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace todoBE.Models;

public class List //drugo ime??? List<> pa nije ambiguous 
{   
    [Key]
    public int Id { get; set; }

    [MaxLength(60)]
    public string Name { get; set; } = "";

    public int OwnerId { get; set; }

    public Employee? Owner { get; set; }

    public bool IsPrivate { get; set; }

    [JsonIgnore]
    public List<CollaborativeListInvitation>? Invitations { get; set; }

    [JsonIgnore]
    public List<SharedList>? SharedLists { get; set; }

    [JsonIgnore]
    public List<TodoItem>? TodoItems { get; set; }

}