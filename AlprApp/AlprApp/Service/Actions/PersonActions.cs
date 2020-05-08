using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static AlprApp.Service.Actions.PersonCarActions;

namespace AlprApp.Service.Actions
{

    public class PersonActions : PersistentObjectActionsReference<AlprAppContext, object>
    {

        public PersonActions(AlprAppContext context) : base(context)
        {
        }

        public class Person
        {
            [Key]
            public int PersonID { get; set; }
            public string FristName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }

            public virtual ICollection<PersonCar> PersonCar { get; set; }
        }
    }
}