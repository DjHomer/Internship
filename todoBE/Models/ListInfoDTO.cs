using System.ComponentModel.DataAnnotations;

namespace todoBE.Models;

public class ListInfoDTO
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int CompletedByMe { get; set; }
}