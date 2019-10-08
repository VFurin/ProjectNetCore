using Microsoft.EntityFrameworkCore;
using ProEvents.WebApi.Model;

namespace ProEvents.WebApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base (options) {}
        public DbSet<Evento>Eventos { get; set; }

    }
}