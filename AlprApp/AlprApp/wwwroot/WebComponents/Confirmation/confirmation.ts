namespace AlprApp.WebComponents {
    @Vidyano.WebComponents.WebComponent.register({
    }, "aa")
    export class Confirmation extends Vidyano.WebComponents.WebComponent {

        private _toHome(e: Event) {
            //redirecten
            window.location.replace("/");
        }
    }
}