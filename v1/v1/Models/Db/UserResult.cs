namespace v1.Models.Db
{
    public class UserResult
    {
        public int Id { get; set; }
        public virtual User User { get; set; }
        public DateTime DateTime { get; set; }
        public virtual Test Test { get; set; }
        public int CountCorrectAnswers { get; set; }

    }
}
