using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlprApp.Models
{
    public class PlateObject
    {
        public string plate { get; set; }
        public float confidence { get; set; }
        public int matches_template { get; set; }
    }
}