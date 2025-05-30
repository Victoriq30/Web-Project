using IssueTracker.Models;

namespace IssueTracker.Services
{
    public interface IProjectService
    {
        Task<List<Project>> GetAllAsync();
        Task<Project?> GetByIdAsync(string id);
        Task CreateAsync(Project project);
        Task<bool> UpdateAsync(string id, Project project);
        Task<bool> DeleteAsync(string id);
    }
}
