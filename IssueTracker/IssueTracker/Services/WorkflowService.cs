using IssueTracker.Data;
using IssueTracker.Models;
using MongoDB.Driver;

namespace IssueTracker.Services
{
    public class WorkflowService : IWorkflowService
    {
        private readonly IMongoCollection<Workflow> _workflow;

        public WorkflowService(DbContext dbContext)
        {
            _workflow = dbContext.Workflows;
        }

        public async Task<List<Workflow>> GetWorkflowAsync() =>
            await _workflow.Find(_ => true).ToListAsync();

        public async Task SetWorkflowAsync(List<Workflow> workflows)
        {
            await _workflow.DeleteManyAsync(_ => true);
            await _workflow.InsertManyAsync(workflows);
        }

        public async Task<bool> IsTransitionAllowedAsync(string from, string to)
        {
            var workflow = await _workflow.Find(_ => true).FirstOrDefaultAsync(); // вземаме първия (или текущия активен)

            if (workflow == null || !workflow.AllowedTransitions.ContainsKey(from))
                return false;

            return workflow.AllowedTransitions[from].Contains(to);
        }

    }
}
