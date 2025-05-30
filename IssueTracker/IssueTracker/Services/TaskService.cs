using IssueTracker.Data;
using IssueTracker.Models;
using MongoDB.Driver;

namespace IssueTracker.Services
{
    public class TaskService : ITaskService
    {
        private readonly IMongoCollection<Ticket> _tasks;

        public TaskService(DbContext dbContext)
        {
            _tasks = dbContext.Tasks;
        }

        public async Task<List<Ticket>> GetAllTasksAsync() =>
            await _tasks.Find(_ => true).ToListAsync();

        public async Task<Ticket> GetTaskByIdAsync(string id) =>
            await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();

        public async Task<Ticket> CreateTaskAsync(Ticket newTask)
        {
            await _tasks.InsertOneAsync(newTask);
            return newTask;
        }

        public async Task<bool> UpdateTaskAsync(string id, Ticket updatedTask)
        {
            var result = await _tasks.ReplaceOneAsync(t => t.Id == id, updatedTask);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteTaskAsync(string id)
        {
            var result = await _tasks.DeleteOneAsync(t => t.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
        public async Task<List<Ticket>> GetByProjectIdAsync(string projectId)
        {
            return await _tasks.Find(t => t.ProjectId == projectId).ToListAsync();
        }
        public async Task<List<Ticket>> GetByAssigneeIdAsync(string assigneeId)
        {
            return await _tasks.Find(t => t.Assignee == assigneeId).ToListAsync();
        }
        public async Task<List<Ticket>> GetByStatusAsync(string status)
        {
            return await _tasks.Find(t => t.Status == status).ToListAsync();
        }
    }
}
