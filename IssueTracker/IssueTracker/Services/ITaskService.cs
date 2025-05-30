using IssueTracker.Models;

namespace IssueTracker.Services
{
    public interface ITaskService
    {
        Task<List<Ticket>> GetAllTasksAsync();
        Task<Ticket> GetTaskByIdAsync(string id);
        Task<Ticket> CreateTaskAsync(Ticket newTask);
        Task<bool> UpdateTaskAsync(string id, Ticket updatedTask);
        Task<bool> DeleteTaskAsync(string id);
        Task<List<Ticket>> GetByProjectIdAsync(string projectId);
        Task<List<Ticket>> GetByAssigneeIdAsync(string assigneeId);
        Task<List<Ticket>> GetByStatusAsync(string status);

    }
}
