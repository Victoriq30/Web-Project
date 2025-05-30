using IssueTracker.Data;
using IssueTracker.Models;
using MongoDB.Driver;

namespace IssueTracker.Services
{
    public class TaskCommentService : ITaskCommentService
    {
        private readonly IMongoCollection<TaskComment> _comments;

        public TaskCommentService(DbContext dbContext)
        {
            _comments = dbContext.TaskComments;
        }

        public async Task<List<TaskComment>> GetByTaskIdAsync(string taskId) =>
            await _comments.Find(c => c.TaskId == taskId).ToListAsync();

        public async Task CreateAsync(TaskComment comment) =>
            await _comments.InsertOneAsync(comment);

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _comments.DeleteOneAsync(c => c.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
