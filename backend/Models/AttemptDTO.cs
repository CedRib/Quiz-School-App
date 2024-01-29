using Microsoft.AspNetCore.Mvc.ModelBinding;
using prid_2324_a13.Models;

namespace prid_2324_a13;

public class AttemptDTO
{

    public int Id { get; set; }
    public DateTimeOffset Start { get; set; }

    public DateTimeOffset? Finish { get; set; }

    public int QuizId { get; set; }
    public int UserId { get; set; }
    public UserDTO? User { get; set; } = null!;
}