using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AlprApp.Service;


namespace AlprApp.Models
{
    public static class PrepDB
    {
        public static void PrepareDB(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                SeedData(serviceScope.ServiceProvider.GetService<AlprAppContext>());
            }
        }

        public static void SeedData(AlprAppContext context)
        {
            System.Console.WriteLine("Aplying Migrations...");

            // context.Database.Migrate();

            System.Console.WriteLine("Migrations done...");

            System.Console.WriteLine("Checking completed...");

        }


    }
}
