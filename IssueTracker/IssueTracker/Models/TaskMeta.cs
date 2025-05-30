namespace IssueTracker.Models
{
    public class TaskMeta
    {
        public List<string> Tags { get; set; } = new List<string>();
        public List<string> Attachments { get; set; } = new List<string>();
        public string TaskId { get; set; }
    }
}
