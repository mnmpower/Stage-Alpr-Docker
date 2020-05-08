using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static AlprApp.Service.Actions.CompanyActions;
using static AlprApp.Service.Actions.PersonCarActions;

namespace AlprApp.Service.Actions
{

    public class CarActions : PersistentObjectActionsReference<AlprAppContext, object>
    {

        public CarActions(AlprAppContext context) : base(context)
        {
        }

        public class Car
        {
            [Key]
            public int CarID { get; set; }
            public int CompanyID { get; set; }
            public string LicensePlate { get; set; }

            [ForeignKey("CompanyID")]
            public virtual Company Company { get; set; }
        
            public virtual ICollection<PersonCar> PersonCars { get; set; }
        }
    }
}