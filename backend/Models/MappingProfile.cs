using AutoMapper;

namespace prid_2324_a13.Models;

public class MappingProfile : Profile
{
	private readonly MyContext _context;

	public MappingProfile(MyContext context)
	{
		_context = context;

		CreateMap<User, UserDTO>();
		CreateMap<UserDTO, User>();

        CreateMap<User, UserLoginDTO>();
        CreateMap<UserLoginDTO, User>();

		CreateMap<User, UserWithPasswordDTO>();
		CreateMap<UserWithPasswordDTO, User>();

        CreateMap<Quiz, QuizDTO>();
        CreateMap<QuizDTO, Quiz>();

        CreateMap<Quiz, QuizForTeacherDTO>();
        CreateMap<QuizForTeacherDTO, Quiz>();

        CreateMap<Database, DatabaseDTO>();
        CreateMap<DatabaseDTO, Database>();

        CreateMap<Question, QuestionDTO>();
        CreateMap<QuestionDTO, Question>();

        CreateMap<Solution, SolutionDTO>();
        CreateMap<SolutionDTO, Solution>();

        CreateMap<Question, QuestionWithSolutionDTO>();
        CreateMap<QuestionWithSolutionDTO, Question>();

        CreateMap<Question, QuestionOrderDTO>();
        CreateMap<QuestionOrderDTO, Question>();

        CreateMap<Question, QuestionWithStudentAnswerDTO>();
        CreateMap<QuestionWithStudentAnswerDTO, Question>();

        CreateMap<Answer, AnswerDTO>();
        CreateMap<AnswerDTO, Answer>();

        CreateMap<Attempt, AttemptDTO>();
        CreateMap<AttemptDTO, Attempt>();
	}
}