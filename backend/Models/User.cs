using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace prid_2324_a13.Models;

public enum Role
{
    Teacher = 1, Student = 0
}

public class User
{
    [Key]
    public int Id { get; set; }
    public string Pseudo { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? LastName { get; set; }
    public string? FirstName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public Role Role { get; set; } = Role.Student;

    [NotMapped]
    public string? Token { get; set; }

    public string? RefreshToken { get; set; }

}

public class Teacher : User {

    public Teacher() {
        this.Role = Role.Teacher;
    }    
}

public class Student : User
{
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
}
