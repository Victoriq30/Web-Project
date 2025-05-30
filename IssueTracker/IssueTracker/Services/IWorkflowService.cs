using IssueTracker.Models;
using Microsoft.AspNetCore.Mvc;

namespace IssueTracker.Services
{
    public interface IWorkflowService
    {
        Task<List<Workflow>> GetWorkflowAsync();
        Task SetWorkflowAsync(List<Workflow> workflows); // ✔ changed from IActionResult
        Task<bool> IsTransitionAllowedAsync(string from, string to);
    }

}
