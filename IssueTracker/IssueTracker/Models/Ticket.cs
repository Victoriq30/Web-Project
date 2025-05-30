using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;
using IssueTracker.Models;

public class Ticket
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }

    public string Status { get; set; }  // Open, In Progress, Closed, Blocked...
    public string Priority { get; set; } // Low, Medium, High...

    [BsonRepresentation(BsonType.ObjectId)]
    public string Assignee { get; set; } // User Id who has to do the task

    [BsonRepresentation(BsonType.ObjectId)]
    public string ProjectId { get; set; } // the project it belongs to

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedBy { get; set; } // User Id who has created the task

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }

    public List<TaskComment> Comments { get; set; } = new List<TaskComment>(); // discussion for task by users

    public TaskMeta Meta { get; set; } = new TaskMeta();
    //TaskMetaid?
}
