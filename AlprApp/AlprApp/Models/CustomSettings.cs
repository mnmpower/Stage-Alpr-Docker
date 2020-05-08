using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlprApp.Models
{
    public class SmtpSettings
    {
        public string SmtpClient { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpEmail { get; set; }
        public string SmtpPwd { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
        public string Logo { get; set; }
    }
}
