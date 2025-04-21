using IssueTracker.Models;

namespace IssueTracker.Services
{
    public interface ITaskService
    {
        Task<List<Task>> GetAllTasksAsync();
        Task<Task> GetTaskByIdAsync(string id);
        Task<Task> CreateTaskAsync(Task newTask);
        Task<bool> UpdateTaskAsync(string id, Task updatedTask);
        Task<bool> DeleteTaskAsync(string id);
    }
}
