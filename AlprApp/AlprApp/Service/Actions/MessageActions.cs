using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static AlprApp.Service.Actions.PersonCarActions;
using static AlprApp.Service.Actions.PremadeMessageActions;

namespace AlprApp.Service.Actions
{

    public class MessageActions : PersistentObjectActionsReference<AlprAppContext, object>
    {

        public MessageActions(AlprAppContext context) : base(context)
        {
        }

        public class Message
        {
            [Key]
            public int MessageID { get; set; }
            public int PersonCarID { get; set; }
            public int? PremadeMessageID { get; set; }
            public string Text { get; set; }

            [ForeignKey("PersonCarID")]
            public virtual PersonCar PersonCar { get; set; }

            [ForeignKey("PremadeMessageID")]
            public virtual PremadeMessage PremadeMessage { get; set; }
        }
    }
}