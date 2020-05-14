using System;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace dockerapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlateController : ControllerBase
    {
        private readonly ILogger<PlateController> _logger;
        public PlateController(ILogger<PlateController> logger)
        {
            _logger = logger;
        }

        [HttpPost ("identify")]
        public IActionResult identify([FromBody] ImageObject imageObject)
        {
            // Saving Image on Server 
            SaveImage(imageObject.Image);
            
            try
            {
                // Start process and return logs
                String myData ="";
                myData = StartProcess();

                 // Delete Image from Server 
                DeletFoto();

                return Content(myData, "application/json");

            }
            catch (Exception e)
            {
                 // Create readable error
                string error = CreateError(e);

                return Content(error, "application/json");
            }
        }

        private string StartProcess()
        {
            var myData = "";

            using (var process = new Process())
            {
                string cmd = "/usr/bin/alpr -c eu -p be -j /ImageUploads/plate.jpg";
                var escapedArgs = cmd.Replace("\"", "\\\"");

                
                process.StartInfo.FileName = "sh";
                process.StartInfo.Arguments = $"-c \"{escapedArgs}\"";
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.CreateNoWindow = true;

                process.OutputDataReceived += (sender, data) => myData += data.Data;
                process.ErrorDataReceived += (sender, data) => Console.WriteLine(data.Data);

                process.Start();

                process.BeginOutputReadLine();
                process.BeginErrorReadLine();

                var exited = process.WaitForExit(1000 * 10);     // (optional) wait up to 10 seconds
            }

            return myData;
        }

        private void SaveImage(string base64String)
        {
            byte[] imageBytes = Convert.FromBase64String(base64String);
            var filePath = Path.Combine("/ImageUploads", "plate.jpg");
            System.IO.File.WriteAllBytes(filePath, imageBytes);
        }

        private void DeletFoto()
        {
            string sourceDir = @"/ImageUploads";
            string[] picList = Directory.GetFiles(sourceDir, "*.jpg");

            foreach (string f in picList)
            {
                System.IO.File.Delete(f);
            }
        }

        private string CreateError(Exception e){
                string error ="\nStackTrace:\n";
                error += e.StackTrace.ToString();
                error += "\n\nMessage:\n";
                error += e.Message.ToString();
                error += "\n\nError:\n";
                error += e.ToString();

                return error;
        }
    }
}
