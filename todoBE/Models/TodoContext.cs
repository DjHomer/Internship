using Microsoft.EntityFrameworkCore;

namespace todoBE.Models;

public class TodoContext : DbContext
{
    public required DbSet<Employee> Employees {get; set;}

    public required DbSet<List> Lists {get; set;}
    public required DbSet<TodoItem> TodoItems { get; set; }

    public required DbSet<SharedList> SharedLists {get; set;}

    public required DbSet<CollaborativeListInvitation> CollaborativeListInvitations { get; set; }

    public TodoContext(DbContextOptions options) : base(options)
    {

    }

     protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           

            modelBuilder.Entity<CollaborativeListInvitation>()
                .HasOne(cli => cli.Employee)
                .WithMany(e => e.Invitations)
                .HasForeignKey(cli => cli.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CollaborativeListInvitation>()
                .HasOne(cli => cli.List)
                .WithMany(l => l.Invitations)
                .HasForeignKey(cli => cli.ListId)
                .OnDelete(DeleteBehavior.Restrict);

                



           

            modelBuilder.Entity<SharedList>()
                .HasOne(cli => cli.Employee)
                .WithMany(e => e.SharedLists)
                .HasForeignKey(cli => cli.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SharedList>()
                .HasOne(cli => cli.List)
                .WithMany(l => l.SharedLists)
                .HasForeignKey(cli => cli.ListId)
                .OnDelete(DeleteBehavior.Restrict);




            modelBuilder.Entity<TodoItem>()
                .HasOne(cli => cli.DoneBy)
                .WithMany(e => e.TodoItems)
                .HasForeignKey(cli => cli.DoneById)
                .IsRequired(false) // Set DoneById to be nullable
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<TodoItem>()
                .HasOne(cli => cli.List)
                .WithMany(l => l.TodoItems)
                .HasForeignKey(cli => cli.ListId)
                .OnDelete(DeleteBehavior.Restrict);

            // Add any other configurations you need here...

            base.OnModelCreating(modelBuilder);

        }
}