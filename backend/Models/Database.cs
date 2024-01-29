using prid_2324_a13.Models;
using System.ComponentModel.DataAnnotations;
namespace prid_2324_a13;

public class Database
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public virtual ICollection<Quiz> Quizz { get; set; } = new HashSet<Quiz>();
}