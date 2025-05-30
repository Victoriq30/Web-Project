using Microsoft.AspNetCore.Mvc;
using IssueTracker.Models;
using IssueTracker.Services;

namespace IssueTracker.Controllers
{
    [ApiController]
    [Route("api/tasks/{taskId}/meta")]
    public class TaskMetaController : ControllerBase
    {
        private readonly ITaskMetaService _metaService;

        public TaskMetaController(ITaskMetaService metaService)
        {
            _metaService = metaService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string taskId)
        {
            var meta = await _metaService.GetByTaskIdAsync(taskId);
            return meta == null ? NotFound() : Ok(meta);
        }

        [HttpPost]
        public async Task<IActionResult> Create(string taskId, TaskMeta meta)
        {
            meta.TaskId = taskId;
            await _metaService.CreateAsync(meta);
            return Ok(meta);
        }

        [HttpPut]
        public async Task<IActionResult> Update(string taskId, TaskMeta meta)
        {
            meta.TaskId = taskId;
            var result = await _metaService.UpdateAsync(meta);
            return result ? NoContent() : NotFound();
        }
    }
}
