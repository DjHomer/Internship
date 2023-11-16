using System.ComponentModel.DataAnnotations;

namespace todoBE.Models;

public class SharedList
{

    [Key]
    public int Id { get; set; }
    public int ListId { get; set; }
    public List? List { get; set; }

    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}

