using Microsoft.AspNetCore.Mvc;
using IssueTracker.Models;
using IssueTracker.Services;

namespace IssueTracker.Controllers
{
    [ApiController]
    [Route("api/tasks/{taskId}/comments")]
    public class TaskCommentsController : ControllerBase
    {
        private readonly ITaskCommentService _commentService;

        public TaskCommentsController(ITaskCommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(string taskId) => Ok(await _commentService.GetByTaskIdAsync(taskId));

        [HttpPost]
        public async Task<IActionResult> Create(string taskId, TaskComment comment)
        {
            comment.TaskId = taskId;
            await _commentService.CreateAsync(comment);
            return Ok(comment);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(string commentId)
        {
            var result = await _commentService.DeleteAsync(commentId);
            return result ? NoContent() : NotFound();
        }
    }
}