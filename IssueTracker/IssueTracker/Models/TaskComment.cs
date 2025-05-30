using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using IssueTracker.Entities;

namespace IssueTracker.Models
{
    public class TaskComment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public User Author { get; set; } //comment creator
        public string TaskId { get; set; }
        public string Text { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
