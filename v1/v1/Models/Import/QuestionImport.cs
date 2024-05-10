namespace v1.Models.Import
{
    public class QuestionImport
    {
        public string Key { get; set; }
        public List<string> Options { get; set; }
        public List<string> CorrectAnswer { get; set; }
    }
}
