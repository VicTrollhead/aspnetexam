namespace v1.Areas.Testing.Models.Form
{
    public class QuizResultForm
    {
        public string UserName { get; set; }
        public string QuizName { get; set; }
        public Dictionary<string, List<string>> Answers { get; set; }
    }
}
