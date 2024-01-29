using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace prid_2324_a13.Models
{
    public class Quiz
    {

        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsPublished { get; set; }
        public bool IsTest { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        public int? DatabaseId { get; set; }
        public Database? Database { get; set; }
        private string? _evaluation;
        public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
        public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();

        [NotMapped]
        public bool WithAttempt { get; set; }
        [NotMapped]
        public string? Evaluation {
            get => _evaluation ?? "N/A";
            set => _evaluation = value;
        }
        [NotMapped]
        public string? Status { get; set; }


        public bool IsClosed {
            get {
                return EndDate.HasValue && DateTimeOffset.Now > EndDate.Value;
            }
        }

        public void SetStudentStatusWithAttempt(Attempt attempt) {
            if (IsClosed) {
                Status = "Clôturé";
            } else {
                Status = attempt.Finish.HasValue ? "Terminé" : "En_COURS";
            }
        }

        public void SetStudentStatusWithoutAttempt() {

            if (IsClosed) {
                Status = "Clôturé";
            } else if (IsTest && DateTimeOffset.Now < StartDate!.Value) {
                Status = "A Venir";
            } else {
                Status = "Pas Commencé";
            }
        }

        public void SetTeacherStatus() {
            if (IsPublished) {
                Status = "Publié";
            } else {
                Status = "Non Publié";
            }
        }

    }

}
