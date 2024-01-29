using System.ComponentModel.DataAnnotations;

namespace prid_2324_a13.Models
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Sql { get; set; } = null!;

        [Required]
        public DateTimeOffset Timestamp { get; set; }

        public bool IsCorrect { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!;

        public int AttemptId { get; set; }
        public Attempt Attempt { get; set; } = null!;
    }
}
