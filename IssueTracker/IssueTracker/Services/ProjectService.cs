using IssueTracker.Data;
using IssueTracker.Models;
using MongoDB.Driver;

namespace IssueTracker.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IMongoCollection<Project> _projects;

        public ProjectService(DbContext dbContext)
        {
            _projects = dbContext.Projects;
        }

        public async Task<List<Project>> GetAllAsync() =>
            await _projects.Find(_ => true).ToListAsync();

        public async Task<Project?> GetByIdAsync(string id) =>
            await _projects.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Project project) =>
            await _projects.InsertOneAsync(project);

        public async Task<bool> UpdateAsync(string id, Project project)
        {
            var result = await _projects.ReplaceOneAsync(p => p.Id == id, project);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _projects.DeleteOneAsync(p => p.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
