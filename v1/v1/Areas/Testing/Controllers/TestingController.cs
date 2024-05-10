using v1.Models.Db;
using v1.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;
using FTCS;
using v1.Models.Import;
using v1.Areas.Testing.Models.Form;
using v1.Areas.Testing.Models.Resp;
using Microsoft.AspNetCore.Authorization;

namespace v1.Testing.Controllers
{
    [Area("Testing")]
    [Route("api/testing")]
    [Authorize]
    public class TestingController : Controller
    {
        private readonly SiteContext _context;
        private readonly UserManager<User> _userManager;
        public TestingController(SiteContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            //LoadQuestion();
        }

        [HttpPost("selectTest")]
        public async Task<List<TestResp>> SelectTest([FromBody] SelectedTest form)
        {
            var test = await _context.Tests.Include(t => t.Questions).ThenInclude(q => q.Answers).FirstAsync(t => t.Title == form.Title);

            List<TestResp> resp = new List<TestResp>();

            foreach (var item in test.Questions)
            {
                TestResp question = new TestResp();
                question.Key = item.Text;

                foreach (var answer in item.Answers)
                {
                    question.Options.Add(answer.Text);
                }

                resp.Add(question);
            }

            return resp;
        }

        [HttpPost("result")]
        public async Task<int> ResultTest([FromBody] QuizResultForm form)
        {
            int correct = 0;

            foreach (var question in form.Answers.Keys)
            {
                var questionWithCorrectAnswers = await _context.Questions
                    .Include(q => q.CorrectAnswer)
                    .FirstOrDefaultAsync(q => q.Text == question);

                if (questionWithCorrectAnswers != null)
                {
                    var correctAnswerTitles = questionWithCorrectAnswers.CorrectAnswer.Select(ca => ca.Title).ToList();

                    var userAnswers = form.Answers[question];

                    bool allUserAnswersCorrect = userAnswers.All(answer => correctAnswerTitles.Contains(answer));

                    bool isCorrect = allUserAnswersCorrect && userAnswers.Count == correctAnswerTitles.Count;

                    if (isCorrect)
                        correct++;
                }
            }

            //string testTitle = "";
            //if(form.QuizName == "SimpleQuestions")
            //{
            //    testTitle = "Test 3";
            //}

            var test = await _context.Tests.FirstAsync(t => t.Title == form.QuizName);
            var user = await _userManager.Users.FirstAsync(u => u.UserName == form.UserName);
            DateTime dateTime = DateTime.Now;

            UserResult userResult = new UserResult();

            userResult.Test = test;
            userResult.User = user;
            userResult.DateTime = dateTime;
            userResult.CountCorrectAnswers = correct;

            _context.Add(userResult);
            await _context.SaveChangesAsync();

            return correct;
        }

        [HttpPost("mystatistic")]
        public async Task<List<MyQuizResultResp>> MyStatistic([FromBody] MyAllQuizResultForm form)
        {
            var quizResults = await _context.UserResults
                 .Where(ur => ur.User.UserName == form.UserName && ur.Test.Title == form.QuizName)
                 .Select(ur => new MyQuizResultResp
                 {
                     UserName = form.UserName,
                     DateTime = ur.DateTime,
                     TestTitle = ur.Test.Title,
                     CountCorrectAnswers = ur.CountCorrectAnswers
                 })
                 .ToListAsync();

            return quizResults;
        }

        [HttpPost("top10statistic")]
        public async Task<List<MyQuizResultResp>> TopStatistic([FromBody] SelectedTest form)
        {
            var topResults = await _context.UserResults
                            .Where(ur => ur.Test.Title == form.Title)
                            .OrderByDescending(ur => ur.CountCorrectAnswers)
                            .Take(10)
                            .Select(ur => new MyQuizResultResp
                            {
                                UserName = ur.User.UserName,
                                DateTime = ur.DateTime,
                                TestTitle = ur.Test.Title,
                                CountCorrectAnswers = ur.CountCorrectAnswers
                            }).ToListAsync();

            return topResults;
        }

        [HttpPost("load")]
        public async void LoadQuestion()
        {
            string directoryPath = "\\Json";
            string curDir = Directory.GetCurrentDirectory();
            string fullDir = curDir + directoryPath;

            List<QuestionImport> questions = new List<QuestionImport>();

            if (!Directory.Exists(fullDir))
            {
                Console.WriteLine($"Directory '{fullDir}' does not exist.");
            }

            try
            {
                string[] jsonFiles = Directory.GetFiles(fullDir, "*.json");

                int temp = 0;

                foreach (string jsonFile in jsonFiles)
                {

                    List<QuestionImport> fileQuestions = JsonSerialization.Load<List<QuestionImport>>(jsonFile);
                    if (fileQuestions != null)
                    {
                        temp++;

                        //var testSection = _context.TestingSections.FirstOrDefault(ts => ts.Id == temp);

                        string titleTest = "";

                        if (temp == 1)
                        {
                            titleTest = "BinarySystem";
                        }
                        else if (temp == 2)
                        {
                            titleTest = "Chemistry";
                        }
                        else
                        {
                            titleTest = "SimpleQuestions";
                        }

                        Test test = new Test();
                        test.Title = titleTest;

                        //test.TestingSection = testSection;

                        foreach (var item in fileQuestions)
                        {
                            Question question = new Question();
                            question.Text = item.Key;

                            foreach (var option in item.Options)
                            {
                                Answer answer = new Answer();
                                answer.Text = option;

                                question.Answers.Add(answer);
                            }

                            foreach (var corAnswer in item.CorrectAnswer)
                            {
                                CorrectAnswer correctAnswer = new CorrectAnswer();
                                correctAnswer.Title = corAnswer;

                                question.CorrectAnswer.Add(correctAnswer);
                            }

                            test.Questions.Add(question);
                        }

                        _context.Add(test);

                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading questions: {ex.Message}");
            }
        }
    }
}