namespace v1.Models.Db
{
	public class Test
	{
		public int Id { get; set; }
		public string Title { get; set; }		
		public virtual ICollection<Question>? Questions { get; set; } = new List<Question>();
	}
}
