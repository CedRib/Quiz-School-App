using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace prid_2324_a13.Models;

public class QuizDTO
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsPublished { get; set; }
    public bool IsClosed { get; set; }
    public bool IsTest { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public int DatabaseId { get; set; }
    public DatabaseDTO? Database { get; set; }
    public string? Status { get; set; } = null;
    public AttemptDTO? Attempt { get; set; }
    public int FirstQuestionId { get; set; }
    public bool WithAttempt { get; set; }
    public string? Evaluation { get; set; }
    public bool? WithOpenAttempt { get; set; }

    public ICollection<QuestionWithStudentAnswerDTO> Questions { get; set; } = new HashSet<QuestionWithStudentAnswerDTO>();

}

public class QuizForTeacherDTO
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsPublished { get; set; }
    public bool IsClosed { get; set; }
    public bool IsTest { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public int DatabaseId { get; set; }
    public DatabaseDTO? Database { get; set; }
    public string? Status { get; set; } = null;
    public AttemptDTO? Attempt { get; set; }
    public bool WithAttempt { get; set; }

    public ICollection<QuestionWithSolutionDTO> Questions { get; set; } = new HashSet<QuestionWithSolutionDTO>();

}
