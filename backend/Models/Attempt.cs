using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_a13.Models
{

    public class Attempt
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public DateTimeOffset Start { get; set; }

        public DateTimeOffset? Finish { get; set; }
        public int QuizId { get; set; }
        public Quiz? Quiz { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        [NotMapped]
        public bool IsLastAttempt { get; set; }
        [NotMapped]
        public bool IsActive => Finish == null;

        public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();

       
    }
}
