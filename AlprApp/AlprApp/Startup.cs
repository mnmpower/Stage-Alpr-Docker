using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Vidyano.Service;
using Vidyano.Service.EntityFrameworkCore;
using AlprApp.Service;
using AlprApp.Models;

namespace AlprApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddJsonFile($"CustomSettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            var server = Configuration["DBServer"] ?? "192.168.99.100";
            var port = Configuration["DBPort"] ?? "1433";
            var user = Configuration["DBUser"] ?? "SA";
            var password = Configuration["DBPassword"] ?? "rR1234-56!";
            var database = Configuration["Database"] ?? "AlprApp";

            var connectionstring =$"Server={server},{port}; Initial Catalog={database};User ID={user};Password={password}";

            string jsonString = File.ReadAllText("appsettings.json");
            JObject jObject = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonString) as JObject;
            JToken jTokenVidyano = jObject.SelectToken("ConnectionStrings.Vidyano");
            JToken jTokenAlprAppContext = jObject.SelectToken("ConnectionStrings.AlprAppContext");
            jTokenVidyano.Replace(connectionstring);
            jTokenAlprAppContext.Replace(connectionstring);
            string updatedJsonString = jObject.ToString();
            File.WriteAllText("appsettings.json", updatedJsonString);


            
            // Configuration = configuration;
        }

        public IConfiguration Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddVidyanoEntityFrameworkCore(Configuration);
            // ------------OOSPRONGEKLIJKE DB CONNECTIE--------------
            // services.AddDbContext<AlprAppContext>(options =>
            // {
            //     options.UseLazyLoadingProxies();
            //     options.UseSqlServer(Configuration.GetConnectionString("AlprAppContext"));

            // });

            // ------------NIEUWE DB CONNECTIE--------------
            var server = Configuration["DBServer"] ?? "192.168.99.100";
            var port = Configuration["DBPort"] ?? "1433";
            var user = Configuration["DBUser"] ?? "SA";
            var password = Configuration["DBPassword"] ?? "rR1234-56!";
            var database = Configuration["Database"] ?? "AlprApp";

            services.AddDbContext<AlprAppContext>(opt => 
            
            opt.UseSqlServer($"Server={server},{port}; Initial Catalog={database};User ID={user};Password={password}"));



            services.AddTransient<RequestScopeProvider<AlprAppContext>>();

            // Add framework services.
            services.Configure<SmtpSettings>(SmtpSettings => Configuration.GetSection("SmtpSettings").Bind(SmtpSettings));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseVidyano(env, Configuration);

            PrepDB.PrepareDB(app);
        }
    }
}
