namespace v1.Models.Db
{
	public class Question
	{
		public int Id { get; set; }
		public string Text { get; set; }		
		public virtual Test Test { get; set; }
		public virtual ICollection<Answer>? Answers { get; set; } = new List<Answer>();
		public virtual ICollection<CorrectAnswer>? CorrectAnswer { get; set; } = new List<CorrectAnswer>();
    }
}
