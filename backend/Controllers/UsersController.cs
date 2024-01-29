using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a13.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using prid_2324_a13.Helpers;

namespace prid_2324.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly MyContext _context;
    private readonly IMapper _mapper;

    public UsersController(MyContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<UserDTO>> Authenticate(UserLoginDTO dto) {
        var User = await Authenticate(dto.Pseudo, dto.Password);

        var result = await new UserValidator(_context).ValidateForAuthenticate(User);
        if (!result.IsValid)
            return BadRequest(result);

        return Ok(_mapper.Map<UserDTO>(User));
    }

    private async Task<User?> Authenticate(string pseudo, string password) {
        var User = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);

        // return null if User not found
        if (User == null)
            return null;

        if (User.Password == TokenHelper.GetPasswordHash(password)) {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, User.Pseudo),
                    new Claim(ClaimTypes.Role, User.Role.ToString())
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            User.Token = tokenHandler.WriteToken(token);
        }

        return User;
    }

}
