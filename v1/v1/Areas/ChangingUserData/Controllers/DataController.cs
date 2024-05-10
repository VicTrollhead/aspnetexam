using v1.Areas.Auth.Models.Forms;
using v1.Models.Db;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using v1.Areas.ChangingUserData.Models.Form;
using v1.Areas.GeneralModels.Models.Resp;

namespace v1.Areas.ChangingUserData.Controllers
{
    [Area("ChangingUserData")]
    [Route("api/changingdata")]
    [Authorize]

    public class DataController
    {
        private readonly UserManager<User> _userManager;
        public DataController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("password")]
        public async Task<Resp> Register([FromBody] PassForm form)
        {
            var existingUser = await _userManager.FindByNameAsync(form.Login);
            if (existingUser == null)
            {
                return new Resp { Respon = "Такого пользователя не существует" };
            }            

            var result = await _userManager.ChangePasswordAsync(existingUser, form.CurrentPassword, form.NewPassword);

            if (!result.Succeeded)
            {
                return new Resp { Respon = "Ошибка при смене пароля, попробуйте еще раз" };
            }

            return new Resp { Respon = "Пароль успешно изменен" };
        }

        [HttpPost("dob")]
        public async Task<Resp> ChengeDob([FromBody] DobForm form)
        {
            var existingUser = await _userManager.FindByNameAsync(form.Login);
            if (existingUser == null)
            {
                return new Resp { Respon = "Такого пользователя не существует" };
            }

            existingUser.DateOfBirth = form.Dob;
            await _userManager.UpdateAsync(existingUser);

            return new Resp { Respon = "Пароль успешно изменен" };
        }

        


    }
}
