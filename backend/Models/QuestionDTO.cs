using System.Text.Json.Serialization;

namespace prid_2324_a13.Models;

public class QuestionDTO
{

    public int Id { get; set; }
    public int QuestionOrder { get; set; }
    public string Body { get; set; } = null!;
    public int QuizId { get; set; }

}

public class QuestionWithSolutionDTO : QuestionDTO
{

    public ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();
}

public class QuestionOrderDTO
{

    public int Id { get; set; }
    public int QuestionOrder { get; set; }
}

public class QuestionWithStudentAnswerDTO
{
    public int Id { get; set; }
    public int QuestionOrder { get; set; }
    public string Body { get; set; } = null!;
    public int QuizId { get; set; }
    public ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();
    public AnswerDTO Answer { get; set; } = null!;
}

