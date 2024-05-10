namespace v1.Areas.Auth.Models.Resp
{
    public class LoginResp
    {
        public string? Message { get; set; } 
        public string? Token { get; set; }
        public string? Username { get; set;}
        public DateTime? DateOfBirth { get; set; }
    }
}
