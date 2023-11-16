using System.ComponentModel.DataAnnotations;

namespace todoBE.Models;


public class TodoItem
{
    [Key]
    public int Id { get; set; }
    public int ListId { get; set; }
    public List? List  {get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateFinished { get; set; }
    public string Description { get; set; } = " ";
    public bool IsDone { get; set; }
    public int? DoneById { get; set; } = null;
    public Employee? DoneBy { get; set; }
}