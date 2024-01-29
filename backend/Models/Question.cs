using System.ComponentModel.DataAnnotations;

namespace prid_2324_a13.Models
{

    public class Question
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public int QuestionOrder { get; set; }

        [Required]
        public required string Body { get; set; }

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; } = null!;

        public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
        public virtual ICollection<Solution> Solutions {get ; set;} = new HashSet<Solution>();

    }
}
