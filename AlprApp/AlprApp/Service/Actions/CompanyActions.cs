using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static AlprApp.Service.Actions.CarActions;

namespace AlprApp.Service.Actions
{

    public class CompanyActions : PersistentObjectActionsReference<AlprAppContext, object>
    {

        public CompanyActions(AlprAppContext context) : base(context)
        {
        }

        public class Company
        {
            [Key]
            public int CompanyID { get; set; }
            public string Name { get; set; }
            public string Street { get; set; }
            public string Number { get; set; }
            public string PostalCode { get; set; }

            public virtual ICollection<Car> Cars { get; set; }
        }
    }
}