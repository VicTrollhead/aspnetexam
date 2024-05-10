using v1.Models.Db;

namespace v1.Areas.Testing.Models.Resp
{
    public class MyQuizResultResp
    {
        public string UserName { get; set; }
        public DateTime DateTime { get; set; }
        public string TestTitle { get; set; }
        public int CountCorrectAnswers { get; set; }

    }
}
