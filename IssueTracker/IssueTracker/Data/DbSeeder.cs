using MongoDB.Driver;
using IssueTracker.Entities;
using IssueTracker.Models;

namespace IssueTracker.Data
{
    public class DatabaseSeeder
    {
        private readonly DbContext _dbContext;

        public DatabaseSeeder(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Seed()
        {
            // check if db has users
            if (_dbContext.Users.CountDocuments(_ => true) == 0)
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Users.InsertOne(adminUser);
            }

            // check if db has Workflow
            if (_dbContext.Workflows.CountDocuments(_ => true) == 0)
            {
                var defaultWorkflow = new Workflow
                {
                    Name = "Default Workflow",
                    AllowedTransitions = new Dictionary<string, List<string>>
                    {
                        { "Open", new List<string> { "In Progress", "Closed" } },
                        { "In Progress", new List<string> { "Blocked", "Closed" } },
                        { "Blocked", new List<string> { "In Progress" } },
                        { "Closed", new List<string>() }
                    },
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Workflows.InsertOne(defaultWorkflow);
            }
            var userAdmin = _dbContext.Users.Find(u => u.Username == "admin").FirstOrDefault();
            if (_dbContext.Projects.CountDocuments(_ => true) == 0)
            {
                var project = new Project
                {
                    Name = "Sample Project",
                    Description = "This is a sample project for Issue Tracker.",
                    CreatedBy = userAdmin.Id,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Projects.InsertOne(project);
            }
            var projectSample = _dbContext.Projects.Find(p => p.Name == "Sample Project").FirstOrDefault();
            if (_dbContext.Tasks.CountDocuments(_ => true) == 0)
            {
                var task = new Ticket
                {
                    Title = "Sample Task",
                    Description = "This is a sample task description.",
                    Status = "Open",
                    Priority = "Medium",
                    Assignee = userAdmin.Id, 
                    ProjectId = projectSample.Id, 
                    CreatedBy = userAdmin.Id, 
                    DueDate = DateTime.UtcNow.AddDays(7),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                _dbContext.Tasks.InsertOne(task);
            }
            
            if (_dbContext.TaskComments.CountDocuments(_ => true) == 0)
            {
                var taskComment = new TaskComment
                {
                    Author = userAdmin,
                    Text = "This is a comment on the task.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _dbContext.TaskComments.InsertOne(taskComment);
            }

            if (_dbContext.TaskMetas.CountDocuments(_ => true) == 0)
            {
                var taskMeta = new TaskMeta
                {
                    Tags = new List<string> { "Bug", "Priority", "Frontend" },
                    Attachments = new List<string> { "attachment1.png", "attachment2.pdf" }
                };

                _dbContext.TaskMetas.InsertOne(taskMeta);
            }
        }
    }
}
