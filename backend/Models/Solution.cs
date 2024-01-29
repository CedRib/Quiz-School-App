using System.ComponentModel.DataAnnotations;

namespace prid_2324_a13.Models
{

    public class Solution
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public int SolutionOrder { get; set; }

        [Required]
        public string Sql { get; set; } = null!;

        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!;


    }
}
