using Microsoft.EntityFrameworkCore;
using Vidyano.Service;
using static AlprApp.Service.Actions.CarActions;
using static AlprApp.Service.Actions.CompanyActions;
using static AlprApp.Service.Actions.MessageActions;
using static AlprApp.Service.Actions.PersonActions;
using static AlprApp.Service.Actions.PersonCarActions;
using static AlprApp.Service.Actions.PremadeMessageActions;

namespace AlprApp.Service
{
    public class AlprAppContext : TargetDbContext
    {
        public AlprAppContext(DbContextOptions<AlprAppContext> options) : base(options)
        { }

        //ENTITYES MAPPEN MET DB (OPDRACHTOCNTEXT)
        public DbSet<Person> Persons { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<PremadeMessage> PremadeMessages { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<PersonCar> PersonCars { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Person>().ToTable("Person");
            modelBuilder.Entity<Company>().ToTable("Company");
            modelBuilder.Entity<PremadeMessage>().ToTable("PremadeMessage");
            modelBuilder.Entity<Car>().ToTable("Car");
            modelBuilder.Entity<PersonCar>().ToTable("PersonCar");
            modelBuilder.Entity<Message>().ToTable("Message");
        }
    }
}
