using IssueTracker.Data;
using IssueTracker.Models;
using MongoDB.Driver;

namespace IssueTracker.Services
{
    public class TaskMetaService : ITaskMetaService
    {
        private readonly IMongoCollection<TaskMeta> _meta;

        public TaskMetaService(DbContext dbContext)
        {
            _meta = dbContext.TaskMetas;
        }

        public async Task<TaskMeta?> GetByTaskIdAsync(string taskId) =>
            await _meta.Find(m => m.TaskId == taskId).FirstOrDefaultAsync();

        public async Task CreateAsync(TaskMeta meta) =>
            await _meta.InsertOneAsync(meta);

        public async Task<bool> UpdateAsync(TaskMeta meta)
        {
            var result = await _meta.ReplaceOneAsync(m => m.TaskId == meta.TaskId, meta);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
    }
}
