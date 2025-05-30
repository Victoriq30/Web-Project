using IssueTracker.Models;

namespace IssueTracker.Services
{
    public interface ITaskCommentService
    {
        Task<List<TaskComment>> GetByTaskIdAsync(string taskId);
        Task CreateAsync(TaskComment comment);
        Task<bool> DeleteAsync(string id);
    }
}
