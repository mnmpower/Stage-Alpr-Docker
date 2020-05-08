using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Vidyano.Service.Repository;
using AlprApp.Models;
using System.Linq;
using AlprApp.Service.Actions;
using System.IO;
using System.Drawing;
using static AlprApp.Service.Actions.CarActions;

namespace AlprApp.Service.CustomActions
{
    public class ProcessImage : CustomAction<AlprAppContext>
    {
        static HttpClient client = new HttpClient();
        public Boolean plateInDB;



        public override PersistentObject Execute(CustomActionArgs e)
        {
            //declaration objects
            AlprReturn alprReturn = new AlprReturn();
            AlprWithHeader alprWithHeader = new AlprWithHeader();
            string lisencePlate = "";

            var po = e.Parent;
            var imageData = po.GetAttributeValue("ImageData").ToString();

            //creating Base64String from imageData
            string base64String = imageData.Split(',')[1];

            //image rescalen
            base64String = RescaleImage(base64String);

            // Call AlprAPI...
            if (client.BaseAddress == null)
            {
                //client.BaseAddress = new Uri("http://localhost:8001/");
                client.BaseAddress = new Uri("http://192.168.99.100:5000/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }

            try
            {
                // Create a new alprData
                AlprData alprData = new AlprData();

                //setting data in object
                alprData.image = base64String;

                //creating JsonString
                string JsonString = JsonConvert.SerializeObject(alprData);

                //making API call
                var content = new StringContent(JsonString, Encoding.UTF8, "application/json");
                //var result = client.PostAsync("http://192.168.99.100:5000/plate/identify", content).Result;
                var result = client.PostAsync("http://plate-api:5000/plate/identify", content).Result;


                //reading result out as string.
                var responseContent = result.Content.ReadAsStringAsync().Result;

                //putting result back in object
                alprWithHeader = JsonConvert.DeserializeObject<AlprWithHeader>(responseContent);

            }
            catch (Exception)
            {

                // Set value in LicensePlate from Persistant Object + Creating visable error for user
                po.SetAttributeValue("LicensePlate", "Er ging iets mis.\nProbeer opnieuw!\nAPI  niet gevonden.");
                po.SetAttributeValue("InDB", "NOT IN DB");
                po.SetAttributeValue("Candidates", ";");

                // Return answer
                return po;
            }

            //checking if API returned an object 
            if (alprWithHeader == null || alprWithHeader.results.Length == 0)
            {
                // Set value in LicensePlate from Persistant Object + Creating visable error for user
                po.SetAttributeValue("LicensePlate", "Geen plaat gevonden.\n Probeer opnieuw aub!");

                // Return answer
                return po;
            }
            else
            {
                //save plate from API in variable
                lisencePlate = alprWithHeader.results[0].plate;
            }

            //Check if the plate is in the Database and save as boolean
            plateInDB = checkIfPlateIsInDatabaseAsync(lisencePlate);

            if (plateInDB)
            {
                //Save the DB info in attribute
                po.SetAttributeValue("InDB", "IN DB");

            }
            else
            {
                po.SetAttributeValue("InDB", "NOT IN DB");
            }
            // Set value in LicensePlate from Persistant Object
            po.SetAttributeValue("LicensePlate", lisencePlate);

            // Saving other options for plate in var.
            var canditdates = alprWithHeader.results[0].candidates;

            //converting candidates to a string.
            string candidatesString = createString(canditdates);

            // Set value in Candidates from Persistant Object
            po.SetAttributeValue("Candidates", candidatesString);

            // Return answer
            return po;

        }

        private string RescaleImage(string imageData)
        {
            // negeer de opwarming van de API
            if (!imageData.Equals("1"))
            {
                //converten naar byte array
                byte[] data = Convert.FromBase64String(imageData);

                using (var ms = new MemoryStream(data))
                {
                    //omzetten naar image in c#
                    var image = Image.FromStream(ms);
                    //OUde afmetingen ophalen
                    var oldWidth = image.Width;
                    var oldHeight = image.Height;

                    //Verhouding berekenen voor de herschaling
                    var ratioX = (double)480 / image.Width;
                    var ratioY = (double)640 / image.Height;
                    var ratio = Math.Min(ratioX, ratioY);

                    //Bereknen van nieuwe hoogte en breedte
                    int newWidth;
                    int newHeigt;
                    if (oldWidth < oldHeight)
                    {
                        //Portreit mode: fixed height, rescaling width
                        newWidth = (int)(image.Width * ratio);
                        newHeigt = 640;
                    }
                    else
                    {
                        //landscape mode : fixed width, rescalig heigth
                        newWidth = 480;
                        newHeigt = (int)(image.Height * ratio);
                    }

                    //nieuwe image opstellen
                    var newImage = new Bitmap(newWidth, newHeigt);
                    Graphics.FromImage(newImage).DrawImage(image, 0, 0, newWidth, newHeigt);
                    Bitmap bmp = new Bitmap(newImage);

                    //image converten naar data[]
                    ImageConverter converter = new ImageConverter();
                    data = (byte[])converter.ConvertTo(bmp, typeof(byte[]));

                    //Byte[] omzetten naar Base64String en returnen
                    return Convert.ToBase64String(data);
                }
            }
            return "1,1";
        }

        private string createString(PlateObject[] canditdates)
        {
            string r = "";

            foreach (var item in canditdates)
            {
                r += item.plate + ";";
            }
            r = r.Remove(r.Length - 1);



            return r;
        }

        private bool checkIfPlateIsInDatabaseAsync(string plate)
        {
            Car car = (Car)Context.Cars.Where(c => c.LicensePlate == plate).FirstOrDefault();

            if (car == null)
            {
                return false;
            }

            return true;
        }
    }
}