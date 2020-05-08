using AlprApp.Service.Actions;
using System.Collections.Generic;
using System.Linq;
using Vidyano.Service.Repository;
using static AlprApp.Service.Actions.PremadeMessageActions;

namespace AlprApp.Service
{
    public class AlprDataActions : PersistentObjectActionsReference<AlprAppContext, object>
    {
        public AlprDataActions(AlprAppContext context) : base(context)
        {
        }

        public override void OnNew(PersistentObject obj, PersistentObject parent, Query query, Dictionary<string, string> parameters)
        {

            base.OnNew(obj, parent, query, parameters);


        }

        public override void OnLoad(PersistentObject obj, PersistentObject parent)
        {
            base.OnLoad(obj, parent);

            string messagesString = "";
            List<PremadeMessage> messagesList = Context.PremadeMessages.ToList();

            foreach (var premadeMessage in messagesList)
            {
                messagesString += premadeMessage.PremadeMessageID;
                messagesString += ":";
                messagesString += premadeMessage.Text;
                messagesString += ";";

            }

            obj.SetAttributeValue("Messages", messagesString);
            obj.SetAttributeValue("Message", "");


        }

    }
}