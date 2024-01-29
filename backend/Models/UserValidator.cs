using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using prid_2324_a13.Helpers;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace prid_2324_a13.Models
{
    public partial class UserValidator : AbstractValidator<User>
    {
        private readonly MyContext _context;

        public UserValidator(MyContext context) {
            _context = context;

            RuleFor(u => u.Pseudo)
                .NotEmpty()
                .Matches("^[a-zA-Z][a-zA-Z0-9_]{2,9}$")
                .DependentRules(() => RuleFor(u => new { u.Pseudo, u.Id })
                    .MustAsync((u, token) => BeUniquePseudo(u.Pseudo, u.Id, token))
                    .OverridePropertyName(nameof(User.Pseudo))
                    .WithMessage("'{PropertyName}' must be unique.")
                );

            RuleFor(u => u.Role)
                .IsInEnum();

            RuleFor(u => u.Password)
                .NotEmpty()
                .Length(3, 10);

            RuleFor(u => u.Email)
                .NotEmpty()
                .EmailAddress()
                .DependentRules(() => RuleFor(u => new { u.Id, u.Email })
                    .MustAsync(async (u, token) => !await _context.Users.AnyAsync(o => u.Email == o.Email && u.Id != o.Id, cancellationToken: token))
                    .OverridePropertyName(nameof(User.Email))
                    .WithMessage("'{PropertyName}' must be unique.")
                );

            RuleFor(u => new { u.FirstName, u.LastName, u.Id })
                .Must(u => u.FirstName.IsNullOrEmpty() == u.LastName.IsNullOrEmpty())
                .DependentRules(() => {
                    RuleFor(u => u.FirstName).Must(name => ValidName(name));
                    RuleFor(u => u.LastName).Must(name => ValidName(name));
                })
                .OverridePropertyName(nameof(User.FirstName))
                .WithMessage("First and last name can not be empty if the other isn't.")
                .DependentRules(() => RuleFor(u => new { u.FirstName, u.LastName, u.Id })
                    // .MustAsync((user, token) => BeUniqueFullName(user.FirstName, user.LastName, user.Id, token))
                    // .OverridePropertyName(nameof(User.FirstName))
                    // .WithMessage("'{PropertyName}' must be unique.")
                );

            RuleSet("create", () => { });

            RuleSet("authenticate", () => RuleFor(m => m.Token).NotNull().OverridePropertyName("Password").WithMessage("Incorrect password."));
        }


        public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(User user) {
            return await this.ValidateAsync(user, o => o.IncludeRuleSets("default", "create"));
        }

        public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(User? user) {
            if (user == null)
                return ValidatorHelper.CustomError("User not found.", "Pseudo");
            return await this.ValidateAsync(user!, o => o.IncludeRuleSets("authenticate"));
        }

        private async Task<bool> BeUniquePseudo(string pseudo, int id, CancellationToken token) =>
                 !await _context.Users.AnyAsync(u => u.Pseudo == pseudo && u.Id != id, cancellationToken: token);

        // private bool ValidFullName(string? firstname, string? lastname, int id) =>
        //     firstname.IsNullOrEmpty() && lastname.IsNullOrEmpty() || true; // Additional checking

        // private async Task<bool> BeUniqueFullName(string? firstname, string? lastname, int id, CancellationToken token) =>
        //     !firstname.IsNullOrEmpty() || !await _context.Users.AnyAsync(u => u.FirstName == firstname && u.LastName == lastname && u.Id != id, cancellationToken: token);

        private static bool ValidName(string? name) =>
            name == null || MyRegex().Match(name).Success;

        [GeneratedRegex(@"^\S.{3,50}\S$")]
        private static partial Regex MyRegex();
    }
}

