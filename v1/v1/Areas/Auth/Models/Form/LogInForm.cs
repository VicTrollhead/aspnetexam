using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace v1.Areas.Auth.Models.Forms;

public class LogInForm
{  
    public string Login { get; set; }    
    public string Password { get; set; }    
}