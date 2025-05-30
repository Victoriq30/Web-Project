using IssueTracker.Models;

namespace IssueTracker.Services
{
    public interface ITaskMetaService
    {
        Task<TaskMeta?> GetByTaskIdAsync(string taskId);
        Task CreateAsync(TaskMeta meta);
        Task<bool> UpdateAsync(TaskMeta meta);
    }
}
