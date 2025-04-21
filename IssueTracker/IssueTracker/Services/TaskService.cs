using IssueTracker.Data;
using IssueTracker.Models;
using MongoDB.Driver;

namespace IssueTracker.Services
{
    public class TaskService : ITaskService
    {
        private readonly IMongoCollection<Task> _tasks;

        public TaskService(DbContext dbContext)
        {
            _tasks = dbContext.Tasks;
        }

        public async Task<List<Task>> GetAllTasksAsync() =>
            await _tasks.Find(_ => true).ToListAsync();

        public async Task<Task> GetTaskByIdAsync(string id) =>
            await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();

        public async Task<Task> CreateTaskAsync(Task newTask)
        {
            await _tasks.InsertOneAsync(newTask);
            return newTask;
        }

        public async Task<bool> UpdateTaskAsync(string id, Task updatedTask)
        {
            var result = await _tasks.ReplaceOneAsync(t => t.Id == id, updatedTask);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteTaskAsync(string id)
        {
            var result = await _tasks.DeleteOneAsync(t => t.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
