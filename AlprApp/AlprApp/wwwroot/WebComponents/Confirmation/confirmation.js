"use strict";
var AlprApp;
(function (AlprApp) {
    var WebComponents;
    (function (WebComponents) {
        var Confirmation = /** @class */ (function (_super) {
            __extends(Confirmation, _super);
            function Confirmation() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Confirmation.prototype._toHome = function (e) {
                //redirecten
                window.location.replace("/");
            };
            Confirmation = __decorate([
                Vidyano.WebComponents.WebComponent.register({}, "aa")
            ], Confirmation);
            return Confirmation;
        }(Vidyano.WebComponents.WebComponent));
        WebComponents.Confirmation = Confirmation;
    })(WebComponents = AlprApp.WebComponents || (AlprApp.WebComponents = {}));
})(AlprApp || (AlprApp = {}));
