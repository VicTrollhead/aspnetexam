using v1.Models.Db;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using v1.Areas.Auth.Models.Forms;
using v1.Areas.Auth.Models.Resp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using v1.Areas.GeneralModels.Models.Resp;

namespace v1.Areas.Auth.Controllers
{
    [Area("Auth")]
    [Route("api/auth")]

    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AccountController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<Resp> Register([FromBody] RegisterForm form)
        {
            var existingUser = await _userManager.FindByNameAsync(form.Login);
            if (existingUser != null)
            {
                return new Resp { Respon = "Такой пользователь существует" };
            }

            var user = new User
            {
                UserName = form.Login,
                DateOfBirth = form.DateOfBirth
            };

            var result = await _userManager.CreateAsync(user, form.Password);

            if (!result.Succeeded)
            {
                return new Resp { Respon = "Ошибка создания пользователя, попробуйте еще раз" };
            }

            return new Resp { Respon = "Пользователь успешно создан" };
        }

        [HttpPost("login")]
        public async Task<LoginResp> Login([FromBody] LogInForm form)
        {
            var user = await _userManager.FindByNameAsync(form.Login);
            if (user == null)
            {
                return new LoginResp { Message = "Користувача з таким логіном не існує", Token = null };
            }

            if (!await _userManager.CheckPasswordAsync(user, form.Password))
            {
                return new LoginResp { Message = "Невірний пароль", Token = null };
            }

            return new LoginResp { 
                Message = null, 
                Token = GenerateJwtToken(user),
                Username = user.UserName,
                DateOfBirth = user.DateOfBirth
            };
        }





        private string GenerateJwtToken(User user)
        {
            var jwtHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes("my-secret-codemy-secret-codemy-secret-codemy-secret-code");

            var jwtDescriptor = new SecurityTokenDescriptor { 
                Subject = new ClaimsIdentity(new[] { 
                    new Claim("Id", user.Id.ToString()), 
                    new Claim(JwtRegisteredClaimNames.Name, user.UserName),                    
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) }), 
                Expires = DateTime.Now.AddDays(7), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature) };

            var token = jwtHandler.CreateToken(jwtDescriptor); 
            var jwtToken = jwtHandler.WriteToken(token);

            return jwtToken;
        }



    }
}