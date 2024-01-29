using prid_2324_a13.Models;

namespace prid_2324_a13;


public class AnswerDTO
{
    public int Id { get; set; }
    public string Sql { get; set; } = null!;
    public DateTimeOffset TimeStamp { get; set; }
    public bool IsCorrect { get; set; }

    public QuestionDTO? Question { get; set; } = null!;
    public int QuestionId { get; set;}
    public int AttemptId { get; set; }

    public AttemptDTO? Attempt { get; set; } = null!;

}

