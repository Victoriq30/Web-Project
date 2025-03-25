using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace IssueTracker.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }  // "admin", "developer", "manager"...
        public string avatarUrl { get; set; } //do we need user picture??

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}