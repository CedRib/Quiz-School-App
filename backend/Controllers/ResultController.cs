using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a13.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using MySql.Data.MySqlClient;
using System.Data;
using prid_2324_a13.Helpers;

namespace prid_2324.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ResultController : ControllerBase
{
    private readonly MyContext _context;
    private readonly IMapper _mapper;

    public ResultController(MyContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    
    [Authorized(Role.Teacher, Role.Student)]
    [HttpGet("{questionId:int}")]
    public async Task<ActionResult<Result>> CheckQuery(int questionId) {
        Result result = new();
        Result expectedResult = new();
        var question = await _context.Questions.Include(q => q.Quiz)
                                                .ThenInclude(q => q.Database).SingleOrDefaultAsync(q => q.Id == questionId);
        if (question == null) {
            return NotFound();
        }
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == User.Identity!.Name);
        var solution = await _context.Solutions.FirstOrDefaultAsync(s => s.QuestionId == questionId);


        var attempt = await _context.Attempts.Include(a => a.Answers)
                                .OrderByDescending(a => a.Start)
                                .FirstOrDefaultAsync(a => a.UserId == user!.Id && a.QuizId == question.QuizId);

        var studentAnswer = attempt!.Answers.OrderByDescending(a => a.Timestamp)
                                            .FirstOrDefault(a => a.QuestionId == questionId);

        var database = question.Quiz.Database!.Name;

        using MySqlConnection connection = new($"server=localhost;database=" + database + ";uid=root;password=root");
        DataTable table;
        try {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + studentAnswer!.Sql, connection);
            MySqlDataAdapter adapter = new MySqlDataAdapter(command);
            table = new DataTable();
            adapter.Fill(table);
            CreateData(result, table);

            command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + solution!.Sql, connection);
            adapter = new MySqlDataAdapter(command);
            table = new DataTable();
            adapter.Fill(table);
            CreateData(expectedResult, table);

        } catch (MySqlException ErrorSql) {
            result.WrongQuery = ErrorSql.Message;
            return result;

        } catch (Exception e) {
            StatusCode(500, new { Error = e.Message });
        }

        result.CompareData(expectedResult);
        result.IsCorrect = result.ErrorList?.Count == 0;
        studentAnswer!.IsCorrect = result.IsCorrect;
        await _context.SaveChangesAsync();
        return result;
    }

    private void CreateData(Result data, DataTable table) {


        data.Row = table.Rows.Count;
        data.ColumnsLabel = new string[table.Columns.Count];
        for (int i = 0; i < table.Columns.Count; ++i)
            data.ColumnsLabel[i] = table.Columns[i].ColumnName;

        data.Data = new string[table.Rows.Count][];
        for (int j = 0; j < table.Rows.Count; ++j) {
            data.Data[j] = new string[table.Columns.Count];
            for (int i = 0; i < table.Columns.Count; ++i) {
                object value = table.Rows[j][i];
                string str;
                if (value == null)
                    str = "NULL";
                else {
                    if (value is DateTime d) {
                        if (d.TimeOfDay == TimeSpan.Zero)
                            str = d.ToString("yyyy-MM-dd");
                        else
                            str = d.ToString("yyyy-MM-dd hh:mm:ss");
                    } else
                        str = value?.ToString() ?? "";
                }
                data.Data[j][i] = str;
            }
        }


    }
}