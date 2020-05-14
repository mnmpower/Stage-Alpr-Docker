"use strict";
var AlprApp;
(function (AlprApp) {
    var WebComponents;
    (function (WebComponents) {
        var AlprData = /** @class */ (function (_super) {
            __extends(AlprData, _super);
            function AlprData() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.selectedOption = 0;
                _this.capturingImage = false;
                _this.klicked = false;
                return _this;
            }
            AlprData.prototype.attached = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, messageArray, messagesString, messagesMetID, i, splitsen, message;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _super.prototype.attached.call(this);
                                _a = this._setAlprDataPo;
                                return [4 /*yield*/, this.app.service.getPersistentObject(null, "AlprApp.AlprData", null)];
                            case 1:
                                _a.apply(this, [_b.sent()]);
                                this._setCandidates([]);
                                this._setWriteOwnMessage(true);
                                this._setMessageEmptyAfterSend(false);
                                this._setPlateEmptyAfterSend(false);
                                messageArray = [];
                                messagesString = this.alprDataPo.getAttributeValue("Messages");
                                messagesMetID = messagesString.split(';');
                                // String splitsen en omzetten naar Object
                                for (i = 0; i < messagesMetID.length - 1; i++) {
                                    splitsen = messagesMetID[i].split(':');
                                    message = {
                                        id: splitsen[0],
                                        text: splitsen[1]
                                    };
                                    // Object toevoegen aan Array
                                    messageArray.push(message);
                                }
                                // Array zetten als property
                                this._setMessages(messageArray);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AlprData.prototype._sendForm = function (e) {
                return __awaiter(this, void 0, void 0, function () {
                    var optionOfMessage, textarea, dropdown, m, premadeMessageId, plate;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                optionOfMessage = "";
                                textarea = (document.getElementById("inputSelfWrittenMelding"));
                                dropdown = (document.getElementById("problemDropdown"));
                                //chekcen of ze een voorgemaakte message hebben of niet
                                if (this.selectedOption == 0) {
                                    m = this.alprDataPo.getAttributeValue("Message");
                                    if (m === "") {
                                        //foutmelding tonen lege melding
                                        this._setMessageEmptyAfterSend(true);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        //foutmelding verbergen van lege melding
                                        this._setMessageEmptyAfterSend(false);
                                        //message zetten op PO
                                        this.alprDataPo.setAttributeValue("Message", textarea.value);
                                        optionOfMessage = textarea.value;
                                    }
                                }
                                else {
                                    premadeMessageId = dropdown.options[this.selectedOption].value;
                                    optionOfMessage = premadeMessageId;
                                    //message zetten op PO
                                    this.alprDataPo.setAttributeValue("Message", premadeMessageId);
                                }
                                plate = this.alprDataPo.getAttributeValue("LicensePlate");
                                if (plate != null) {
                                    if (plate === "null" || plate === "" || plate.length > 18) {
                                        this._setPlateEmptyAfterSend(true);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        this._setPlateEmptyAfterSend(false);
                                    }
                                }
                                else {
                                    this._setPlateEmptyAfterSend(true);
                                    return [2 /*return*/];
                                }
                                //Indien een geldige message en geldige nummerplaat:
                                return [4 /*yield*/, this.alprDataPo.getAction("SendMessage").execute()];
                            case 1:
                                //Indien een geldige message en geldige nummerplaat:
                                _a.sent();
                                //redirecten
                                window.location.replace("/Confirmation");
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AlprData.prototype._setValueDropdown = function () {
                // Dropdown selecteren
                var e = (document.getElementById("problemDropdown"));
                // value opvragen van selected option
                this.selectedOption = e.selectedIndex;
                // Boolean aanpassen om textarea te tonen
                this._writeOwnMessage();
            };
            AlprData.prototype._writeOwnMessage = function () {
                //Hier value checken van dropdown;
                if (this.selectedOption === 0) {
                    this._setWriteOwnMessage(true);
                }
                else {
                    this._setWriteOwnMessage(false);
                }
            };
            // waarde van het zelfgeschreven berichtopslagen in het PO
            AlprData.prototype._setMessage = function () {
                this.alprDataPo.beginEdit();
                var textarea = (document.getElementById("inputSelfWrittenMelding"));
                this.alprDataPo.setAttributeValue("Message", textarea.value);
                this._ValidateTextArea(textarea.value);
            };
            // nakijken of er een melding geschreven is en deze niet gewoon een spatie is.
            AlprData.prototype._ValidateTextArea = function (value) {
                if (value === "" || value === " ") {
                    this._setMessageEmptyAfterSend(true);
                    return;
                }
                else {
                    this._setMessageEmptyAfterSend(false);
                }
            };
            // nakeijken of de plaat een nummerplaat terug geeft of een error melding + het juist zetten van de booleans om validatie te tonen.
            AlprData.prototype._isPlateValide = function () {
                var value = this.alprDataPo.getAttributeValue("LicensePlate");
                if (value == null) {
                    this._setPlateEmptyAfterSend(true);
                    this._setShowCandidates(false);
                    return false;
                }
                if (value === "" || value.length > 10) {
                    this._setPlateEmptyAfterSend(true);
                    this._setShowCandidates(false);
                    return false;
                }
                this._setPlateEmptyAfterSend(false);
                this._setShowCandidates(true);
                return true;
            };
            //plate wisselen met een candidaat.
            AlprData.prototype._setPlate = function (event) {
                var item = event.target.dataset.item;
                this.alprDataPo.setAttributeValue("LicensePlate", item);
                this.$$("#licensePlate").innerText = item;
            };
            // na drukken op neem een foto
            AlprData.prototype._videoCaptured = function (e) {
                var _this = this;
                this._setTrueAfterPictureUpload(true);
                var tempThis = this;
                if (this.klicked) {
                    return;
                }
                else {
                    this.klicked = true;
                }
                //Declaraties
                var video = document.querySelector('video');
                var canvas = document.createElement('canvas');
                var mainLoopId;
                // foto nemen van de camera en tonen in de html.
                function _screenshotVideo() {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    document.getElementById("screenshot").setAttribute('src', canvas.toDataURL("image/jpeg"));
                    tempThis.imageFromCamera = canvas.toDataURL("image/jpeg");
                }
                //Permissions vragen voor cameras
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true, video: true })];
                            case 1:
                                _a.sent();
                                console.log("NA DE AWAIT");
                                console.log('na de na de await');
                                //Environment camera aanspreken indien aanwezig
                                navigator.mediaDevices.enumerateDevices()
                                    .then(function (devices) {
                                    console.log("voor camera de device logs ");
                                    var videoDevices = [];
                                    var videoDeviceID = "";
                                    devices.forEach(function (device) {
                                        console.log(device.kind + ": " + device.label +
                                            " id = " + device.deviceId);
                                        console.log("WTF?");
                                        if (device.kind == "videoinput") {
                                            videoDevices.push(device.deviceId);
                                        }
                                    });
                                    console.log("voor camera aansprken ");
                                    if (videoDevices.length == 1) {
                                        videoDeviceID = videoDevices[0];
                                    }
                                    else if (videoDevices.length == 2) {
                                        videoDeviceID = videoDevices[1];
                                    }
                                    console.log("na camera aanspreken");
                                    var constraints = {
                                        width: { ideal: 480, max: 3120, },
                                        height: { ideal: 640, max: 4160 },
                                        deviceId: { exact: videoDeviceID }
                                    };
                                    console.log("na constraints");
                                    return navigator.mediaDevices.getUserMedia({ video: constraints });
                                    console.log("na return ");
                                }) //promise zetten op pas door te gaan als de camera actief is
                                    .then(function (stream) { video.srcObject = stream; return new Promise(function (resolve) { return video.onplaying = resolve; }); })
                                    .then(function () { return mainLoopId = setInterval(_screenshotVideo, 500); }) // foto interval starten
                                    .catch(function (e) { return console.error(e); });
                                console.log("2");
                                this.alprDataPo.beginEdit();
                                return [2 /*return*/];
                        }
                    });
                }); })();
                console.log('na de async functie die niet awaited is');
                //functie aanroepen als de foto wordt veranderd
                document.getElementById("screenshot").addEventListener("load", function _sendImageToAPI() {
                    return __awaiter(this, void 0, void 0, function () {
                        var returnedPO, candidatesString, candidates;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("3");
                                    //stoppen met nieuwe fotos te nemen
                                    clearInterval(mainLoopId);
                                    console.log("4");
                                    //image op PO zetten
                                    return [4 /*yield*/, tempThis.alprDataPo.setAttributeValue("ImageData", tempThis.imageFromCamera)];
                                case 1:
                                    //image op PO zetten
                                    _a.sent();
                                    console.log("5");
                                    return [4 /*yield*/, tempThis.alprDataPo.getAction("ProcessImage").execute()];
                                case 2:
                                    returnedPO = _a.sent();
                                    console.log("6");
                                    //waardes terug ophalen van de custiom action
                                    tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate");
                                    tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));
                                    console.log("7");
                                    //indien plate niet valie is nieuwe foto maken en deze functie stoppen
                                    if (!tempThis._isPlateValide()) {
                                        mainLoopId = setInterval(_screenshotVideo, 500);
                                        return [2 /*return*/];
                                    }
                                    tempThis.alprDataPo.setAttributeValue("InDB", returnedPO.getAttributeValue("InDB"));
                                    candidatesString = returnedPO.getAttributeValue("Candidates");
                                    candidates = candidatesString.split(';');
                                    tempThis._setCandidates(candidates);
                                    tempThis.klicked = false;
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            };
            AlprData = __decorate([
                Vidyano.WebComponents.WebComponent.register({
                    properties: {
                        //voorgemaakteMeldingen: Object,
                        alprDataPo: {
                            type: Object,
                            readOnly: true
                        },
                        messages: {
                            type: Array,
                            readOnly: true
                        },
                        candidates: {
                            type: Array,
                            readOnly: true
                        },
                        writeOwnMessage: {
                            type: Boolean,
                            readOnly: true
                        },
                        messageEmptyAfterSend: {
                            type: Boolean,
                            readOnly: true
                        },
                        plateEmptyAfterSend: {
                            type: Boolean,
                            readOnly: true
                        },
                        trueAfterPictureUpload: {
                            type: Boolean,
                            readOnly: true
                        },
                        showCandidates: {
                            type: Boolean,
                            readOnly: true
                        }
                    }
                }, "aa")
            ], AlprData);
            return AlprData;
        }(Vidyano.WebComponents.WebComponent));
        WebComponents.AlprData = AlprData;
    })(WebComponents = AlprApp.WebComponents || (AlprApp.WebComponents = {}));
})(AlprApp || (AlprApp = {}));
