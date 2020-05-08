using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static AlprApp.Service.Actions.CarActions;
using static AlprApp.Service.Actions.MessageActions;
using static AlprApp.Service.Actions.PersonActions;

namespace AlprApp.Service.Actions
{

    public class PersonCarActions : PersistentObjectActionsReference<AlprAppContext, object>
    {

        public PersonCarActions(AlprAppContext context) : base(context)
        {
        }

        public class PersonCar
        {
            [Key]
            public int PersonCarID { get; set; }
            public int PersonID { get; set; }
            public int CarID { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }

            [ForeignKey("PersonID")]
            public virtual Person Person { get; set; }

            [ForeignKey("CarID")]
            public virtual Car Car { get; set; }

            public virtual ICollection<Message> Messages { get; set; }
        }
    }
}