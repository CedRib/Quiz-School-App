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
    public class QuizController : ControllerBase
    {
        private readonly MyContext _context;
        private readonly IMapper _mapper;

        public QuizController(MyContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

//Get ByQuizName pour l'unicité du nom du quiz
        [Authorized(Role.Teacher)]
        [HttpGet("byName/{name}")]
        public async Task<ActionResult<int>> ByName(string name) {
            var quiz = await _context.Quizes.SingleOrDefaultAsync(q => q.Name == name);

            return quiz?.Id ?? 0;
        }


//Recupère tous les quiz pour les quizList
        [Authorized(Role.Student, Role.Teacher)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizDTO>>> GetAll() {
            var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);
            var quizzes = await _context.Quizes
                .Include(q => q.Database)
                .Include(q => q.Questions.OrderBy(q => q.QuestionOrder))
                .ToListAsync();

            foreach (var quiz in quizzes) {
                quiz.WithAttempt = await _context.Attempts.AnyAsync(a => a.QuizId == quiz.Id);

                if (user != null && user.Role == Role.Teacher) {
                    quiz.SetTeacherStatus();
                } else {
                    var attempt = _context.Attempts.OrderByDescending(a => a.Start).FirstOrDefault(a => a.QuizId == quiz.Id && a.UserId == user!.Id);
                    if (attempt == null) {
                        quiz.SetStudentStatusWithoutAttempt();

                    } else {
                        quiz.SetStudentStatusWithAttempt(attempt);
                        if (quiz.IsTest && attempt.Finish != null) {
                            var answers = _context.Answers
                                            .Where(a => a.AttemptId == attempt.Id)
                                            .GroupBy(a => a.QuestionId)
                                            .Select(a => a.OrderByDescending(a => a.Timestamp)
                                            .First());

                            var correctAnswersCount = answers.Count(a => a.IsCorrect == true);
                            var totalQuestionsCount = quiz.Questions.Count;
                            quiz.Evaluation = correctAnswersCount * 10 / totalQuestionsCount + "/10";
                        }
                    }
                }
            }
            var res = _mapper.Map<List<QuizDTO>>(quizzes);
            if (user != null && user.Role == Role.Student) {
                foreach (var quiz in res) {
                    var question = await _context.Questions.SingleAsync(q => q.QuizId == quiz.Id && q.QuestionOrder == 1);
                    quiz.FirstQuestionId = question.Id;

                }
            }
            return res;
        }


//Get d'un quiz par questionId pour charger le quiz toutes ses infos pour l'étudiant
        [Authorized(Role.Student)]
        [HttpGet("byQuestion/{questionId}/{newAttempt}")]
        public async Task<ActionResult<QuizDTO>> GetQuizByQuestionId(int questionId, int newAttempt) {
            var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

            var quiz = await _context.Quizes
                .Include(q => q.Database)
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Questions.Any(question => question.Id == questionId));

            if (quiz == null) {
                return NotFound();
            }
            quiz.WithAttempt = await _context.Attempts.OrderByDescending(a => a.Start).AnyAsync(a => a.QuizId == quiz.Id);


            var attempt = _context.Attempts.OrderByDescending(a => a.Start).FirstOrDefault(a => a.QuizId == quiz.Id && a.UserId == user!.Id);

            if (user != null && user.Role == Role.Teacher) {
                quiz.SetTeacherStatus();
            } else {
                if (attempt == null) {
                    quiz.WithAttempt = false;
                    quiz.SetStudentStatusWithoutAttempt();
                } else {
                    quiz.WithAttempt = true;
                    quiz.SetStudentStatusWithAttempt(attempt);
                }
            }
            var quizDTO = _mapper.Map<QuizDTO>(quiz);
            foreach (var question in quizDTO.Questions) {
                if (!quiz.IsTest || quiz.Status == "Terminé") {
                    question.Solutions = _mapper.Map<List<SolutionDTO>>(await _context.Solutions.Where(s => s.QuestionId == question.Id).ToListAsync());
                }
                if (newAttempt == 0) {
                    question.Answer = _mapper.Map<AnswerDTO>(await _context.Answers
                                        .OrderByDescending(s => s.Timestamp)
                                        .FirstOrDefaultAsync(a => a.Attempt.UserId == user!.Id && a.QuestionId == question.Id));
                }
            }
            quizDTO.Attempt = _mapper.Map<AttemptDTO>(attempt);
            return quizDTO;
        }

//Get d'un quiz by quizId pour l'édition du quiz par les teachers
        [Authorized(Role.Teacher)]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<QuizForTeacherDTO>> GetOne(int id) {
            var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

            var quiz = await _context.Quizes
                .Include(q => q.Database)
                .Include(q => q.Questions.OrderBy(q => q.QuestionOrder))
                    .ThenInclude(q => q.Solutions.OrderBy(s => s.SolutionOrder))
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound();

            var attempt = _context.Attempts.OrderByDescending(a => a.Start).FirstOrDefault(a => a.QuizId == quiz.Id && a.UserId == user!.Id);
            quiz.WithAttempt = await _context.Attempts.AnyAsync(a => a.QuizId == quiz.Id);


            if (user != null) {
                if (user.Role == Role.Teacher) {
                    quiz.SetTeacherStatus();
                } else {
                    if (attempt == null) {
                        quiz.SetStudentStatusWithoutAttempt();
                    } else {
                        quiz.SetStudentStatusWithAttempt(attempt);
                    }
                }
            }

            return _mapper.Map<QuizForTeacherDTO>(quiz);
        }


//Creation de quiz
        [Authorized(Role.Teacher)]
        [HttpPost]
        public async Task<ActionResult<QuizDTO>> PostQuiz(QuizForTeacherDTO quizDTO) {
            var newQuiz = _mapper.Map<Quiz>(quizDTO);

            var result = await new QuizValidator(_context).ValidateAsync(newQuiz);
            if (!result.IsValid)
                return BadRequest(result);

            newQuiz.Database = null;

            _context.Quizes.Add(newQuiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }

//Edition de quiz existant
        [Authorized(Role.Teacher)]
        [HttpPut]
        public async Task<IActionResult> PutQuiz(QuizForTeacherDTO quizDTO) {
            var quiz = await _context.Quizes
                                    .Include(q => q.Questions)
                                        .ThenInclude(q => q.Solutions)
                                    .Where(q => q.Id == quizDTO.Id)
                                    .SingleOrDefaultAsync();
            if (quiz == null)
                return NotFound();

            var attempt = _context.Attempts.FirstOrDefault(a => a.QuizId == quiz.Id && a.Quiz!.IsTest);

            _mapper.Map<QuizForTeacherDTO, Quiz>(quizDTO, quiz);
            var result = await new QuizValidator(_context).ValidateAsync(quiz);
            if (!result.IsValid || attempt != null)
                return BadRequest(result);
            await _context.SaveChangesAsync();
            return NoContent();
        }

//Suppression de quiz
        [Authorized(Role.Teacher)]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuiz(int id) {
            var quiz = await _context.Quizes.FindAsync(id);
            if (quiz == null)
                return NotFound();
            _context.Quizes.Remove(quiz);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
