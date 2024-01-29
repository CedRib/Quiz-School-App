using System.ComponentModel.DataAnnotations;

namespace prid_2324_a13.Models;

    public class SolutionDTO 
    {
        public int Id { get; set; }
        public int SolutionOrder { get; set; }
        public string Sql { get; set; } = null!;
    }