using Microsoft.AspNetCore.Identity;

namespace v1.Models.Db
{
	public class User : IdentityUser<int>
	{
        public DateTime DateOfBirth { get; set; }
    }
}
