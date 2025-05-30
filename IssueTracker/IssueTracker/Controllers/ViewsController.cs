using Microsoft.AspNetCore.Mvc;
using IssueTracker.Services;

namespace IssueTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViewsController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public ViewsController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("by-project/{projectId}")]
        public async Task<IActionResult> GetByProject(string projectId)
        {
            var tasks = await _taskService.GetByProjectIdAsync(projectId);
            return Ok(tasks);
        }

        [HttpGet("by-assignee/{userId}")]
        public async Task<IActionResult> GetByAssignee(string userId)
        {
            var tasks = await _taskService.GetByAssigneeIdAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("by-status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            var tasks = await _taskService.GetByStatusAsync(status);
            return Ok(tasks);
        }
    }
}