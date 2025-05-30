using Microsoft.AspNetCore.Mvc;
using IssueTracker.Models;
using IssueTracker.Services;

namespace IssueTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkflowsController : ControllerBase
    {
        private readonly IWorkflowService _workflowService;

        public WorkflowsController(IWorkflowService workflowService)
        {
            _workflowService = workflowService;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _workflowService.GetWorkflowAsync());

        [HttpPost]
        public async Task<IActionResult> Set(List<Workflow> workflow)
        {
            await _workflowService.SetWorkflowAsync(workflow);
            return NoContent();
        }

        [HttpGet("validate-transition")]
        public async Task<IActionResult> Validate([FromQuery] string from, [FromQuery] string to)
        {
            var valid = await _workflowService.IsTransitionAllowedAsync(from, to);
            return Ok(new { valid });
        }
    }
}