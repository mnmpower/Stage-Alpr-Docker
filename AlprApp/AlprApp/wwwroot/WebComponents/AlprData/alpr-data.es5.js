"use strict";
var AlprApp;
(function (AlprApp) {
    var WebComponents;
    (function (WebComponents) {
        var AlprData = /** @class */(function (_super) {
            __extends(AlprData, _super);
            function AlprData() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AlprData.prototype.attached = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _super.prototype.attached.call(this);
                                _a = this._setAlprDataPo;
                                return [4 /*yield*/, this.app.service.getPersistentObject(null, "AlprApp.AlprData", null)];
                            case 1:
                                _a.apply(this, [_b.sent()]);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AlprData.prototype._imageCaptured = function (e) {
                this.input = e.target;
                if (this.input.files && this.input.files[0]) {
                    var reader = new FileReader();
                    this.alprDataPo.beginEdit();
                    var tempThis = this;
                    reader.addEventListener("load", function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var img, imageHolder, src, returnedPO;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        img = document.createElement('img');
                                        img.setAttribute('src', reader.result.toString());
                                        img.setAttribute('class', "thumb-image img-fluid");
                                        imageHolder = document.getElementById("image-holder");
                                        imageHolder.innerHTML = "";
                                        imageHolder.appendChild(img);
                                        src = reader.result;
                                        return [4 /*yield*/, tempThis.alprDataPo.setAttributeValue("ImageData", src)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, tempThis.alprDataPo.getAction("ProcessImage").execute()];
                                    case 2:
                                        returnedPO = _a.sent();
                                        tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate");
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, false);
                    reader.readAsDataURL(this.input.files[0]);
                }
            };
            AlprData = __decorate([Vidyano.WebComponents.WebComponent.register({
                properties: {
                    //voorgemaakteMeldingen: Object,
                    alprDataPo: {
                        type: Object,
                        readOnly: true
                    }
                }
            }, "aa")], AlprData);
            return AlprData;
        })(Vidyano.WebComponents.WebComponent);
        WebComponents.AlprData = AlprData;
    })(WebComponents = AlprApp.WebComponents || (AlprApp.WebComponents = {}));
})(AlprApp || (AlprApp = {}));

