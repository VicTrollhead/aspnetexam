using v1.Models.Db;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace v1.Services
{
    public class SiteContext : IdentityDbContext<User, IdentityRole<int>, int>
	{
        public DbSet<Test> Tests { get; set; } = default!;
        public DbSet<Question> Questions { get; set; } = default!;
        public DbSet<Answer> Answers { get; set; } = default!;
        public DbSet<CorrectAnswer> CorrectAnswers { get; set; } = default!; 
        public DbSet<UserResult> UserResults { get; set; } = default!;
        public SiteContext() : base() { }

        public SiteContext(DbContextOptions<SiteContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
                        
            modelBuilder.Entity<IdentityRole<int>>().HasData(
                new IdentityRole<int> { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole<int> { Id = 2, Name = "Teacher", NormalizedName = "TEACHER" },
                new IdentityRole<int> { Id = 3, Name = "Student", NormalizedName = "STUDENT" },
                new IdentityRole<int> { Id = 4, Name = "Guest", NormalizedName = "GUEST" }
            );
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {                
                string connStr = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ASPfrontAPItesting;Integrated Security=True;";
                optionsBuilder.UseSqlServer(connStr);
            }
        }        
    }
}