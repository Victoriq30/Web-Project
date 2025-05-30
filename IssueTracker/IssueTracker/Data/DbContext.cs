using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using IssueTracker.Entities;
using IssueTracker.Models;
using System.Net.Sockets;

namespace IssueTracker.Data
{
    public class DbContext
    {
        private readonly IMongoDatabase _database;

        public DbContext(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            _database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Project> Projects => _database.GetCollection<Project>("Projects");
        public IMongoCollection<Ticket> Tasks => _database.GetCollection<Ticket>("Tasks");
        public IMongoCollection<TaskComment> TaskComments => _database.GetCollection<TaskComment>("TaskComments");
        public IMongoCollection<TaskMeta> TaskMetas => _database.GetCollection<TaskMeta>("TaskMetas");
        public IMongoCollection<Workflow> Workflows => _database.GetCollection<Workflow>("Workflows");
    }
}
