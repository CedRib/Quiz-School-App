using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace prid_2324_a13.Models
{
    public class QuizValidator : AbstractValidator<Quiz>
    {
        private readonly MyContext _context;

        public QuizValidator(MyContext context) {
            _context = context;

            RuleFor(q => q.Name.Trim())
                .NotEmpty()
                .NotNull()
                .MinimumLength(3)
                .DependentRules(() => {
                    RuleFor(q => new { q.Name, q.Id })
                                    .MustAsync((q, token) => BeUniqueQuizName(q.Name, q.Id, token))
                                    .WithMessage("Quiz name must be unique.");
                });


            RuleFor(q => q.Questions)
                .NotEmpty()
                .ForEach(question => question.SetValidator(new QuestionValidator(_context)));

            RuleFor(q => q)
                .Must(quiz => !quiz.IsTest || (quiz.StartDate.HasValue && quiz.EndDate.HasValue && quiz.StartDate.Value < quiz.EndDate.Value))
                .When(q => q.IsTest)
                .WithMessage("For a test quiz, start date must be before finish date.");

        }

        private async Task<bool> BeUniqueQuizName(string name, int id, CancellationToken token) =>
            !await _context.Quizes.AnyAsync(q => q.Name == name && q.Id != id, cancellationToken: token);
    }


    public class QuestionValidator : AbstractValidator<Question>
    {
        private readonly MyContext _context;

        public QuestionValidator(MyContext context) {
            _context = context;

            RuleFor(q => q.Body)
                .NotEmpty()
                .NotNull()
                .MinimumLength(2);

            RuleFor(q => q.Solutions)
                .NotEmpty()
                .ForEach(solution => solution.SetValidator(new SolutionValidator(_context)));
        }
    }


    public class SolutionValidator : AbstractValidator<Solution>
    {
        private readonly MyContext _context;


        public SolutionValidator(MyContext context) {
            _context = context;

            RuleFor(s => s.Sql)
                .NotEmpty()
                .NotNull();
        }
    }
}
