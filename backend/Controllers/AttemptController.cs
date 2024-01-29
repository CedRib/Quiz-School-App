using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a13.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using prid_2324_a13;
using prid_2324_a13.Helpers;


namespace prid_2324.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttemptController : ControllerBase
    {
        private readonly MyContext _context;
        private readonly IMapper _mapper;

        public AttemptController(MyContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }


        [Authorized(Role.Student)]
        [HttpPost]
        public async Task<ActionResult<AttemptDTO>> CreateAttempt(AttemptDTO newAttempt) {
            var quiz = await _context.Quizes.FindAsync(newAttempt.QuizId);
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == User.Identity!.Name);

            if (quiz != null && user != null) {
                newAttempt.QuizId = quiz.Id;
                newAttempt.UserId = user.Id;
            }

            var attempt = _mapper.Map<Attempt>(newAttempt);

            _context.Attempts.Add(attempt);

            await _context.SaveChangesAsync();
            var createdAttemptDTO = _mapper.Map<AttemptDTO>(attempt);
            return createdAttemptDTO;
        }


        [Authorized(Role.Teacher, Role.Student)]
        [HttpGet("byQuizId/{quizId:int}")]
        public async Task<ActionResult<AttemptDTO>> GetAttemptByQuizId(int quizId) {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == User.Identity!.Name);

            if (user == null) {
                return Unauthorized();
            }

            var attempt = await _context.Attempts
                .Include(a => a.Answers)
                    .ThenInclude(ans => ans.Question)
                        .ThenInclude(q => q.Solutions)
                .FirstOrDefaultAsync(a => a.QuizId == quizId && a.UserId == user.Id && a.Finish == null);

            var result = _mapper.Map<AttemptDTO>(attempt);
            return result;
        }


        [Authorized(Role.Student)]
        [HttpPost("closeAttempt")]
        public async Task<IActionResult> CloseAttempt(AttemptDTO attemptDTO) {
            var attempt = await _context.Attempts.FindAsync(attemptDTO.Id);
            if (attempt == null) {
                return NotFound();
            }
            
            attempt.Finish = DateTimeOffset.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
