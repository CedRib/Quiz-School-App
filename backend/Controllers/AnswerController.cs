using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a13.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using prid_2324_a13;
using prid_2324_a13.Helpers;

namespace prid_2324.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AnswerController : ControllerBase
{
    private readonly MyContext _context;
    private readonly IMapper _mapper;


    public AnswerController(MyContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [Authorized(Role.Student)]
    [HttpPost]
    public async Task<ActionResult<AnswerDTO>> CreateAnswer(AnswerDTO answer) {

        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == User.Identity!.Name);

        if (user == null) {
            return Unauthorized();
        }

        var attempt = await _context.Attempts.FirstOrDefaultAsync(a => a.Id == answer.AttemptId && a.Finish == null);

        if (attempt == null) {
            return NotFound("Attempt not found or already finished");
        }

        var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == answer.QuestionId);

        if (question == null) {
            return NotFound("Question not found");
        }

        var newAnswer = _mapper.Map<Answer>(answer);
        newAnswer.Attempt = attempt;
        newAnswer.Question = question;

        _context.Answers.Add(newAnswer);
        await _context.SaveChangesAsync();

        var createdAnswerDTO = _mapper.Map<AnswerDTO>(answer);

        return createdAnswerDTO;


    }






}