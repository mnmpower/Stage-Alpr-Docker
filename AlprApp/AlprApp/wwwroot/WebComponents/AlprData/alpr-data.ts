namespace AlprApp.WebComponents {
    @Vidyano.WebComponents.WebComponent.register({
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
    export class AlprData extends Vidyano.WebComponents.WebComponent {
        readonly alprDataPo: Vidyano.PersistentObject;
        readonly messages: { id: number, text: string }[];
        readonly candidates: string[];
        readonly writeOwnMessage: boolean;
        readonly messageEmptyAfterSend: boolean;
        readonly plateEmptyAfterSend: boolean;
        readonly trueAfterPictureUpload: boolean;
        readonly showCandidates: boolean;

        private _setAlprDataPo: (value: Vidyano.PersistentObject) => void;
        private _setMessages: (value: Array<{ id: number, text: string }>) => void;
        private _setCandidates: (value: Array<string>) => void;
        private _setWriteOwnMessage: (value: boolean) => void;
        private _setMessageEmptyAfterSend: (value: boolean) => void;
        private _setPlateEmptyAfterSend: (value: boolean) => void;
        private _setTrueAfterPictureUpload: (value: boolean) => void;
        private _setShowCandidates: (value: boolean) => void;

        public input;
        public selectedOption = 0;

        public imageFromCamera;
        public capturingImage = false;
        public klicked = false;



        async attached() {
            super.attached();
            this._setAlprDataPo(await this.app.service.getPersistentObject(null, "AlprApp.AlprData", null));
            this._setCandidates([]);
            this._setWriteOwnMessage(true);
            this._setMessageEmptyAfterSend(false);
            this._setPlateEmptyAfterSend(false);

            // ObjectArray declareren
            let messageArray: { id: number, text: string }[] = [];

            // Samengestelde string 1:DDD;2:DDDD;...
            let messagesString = this.alprDataPo.getAttributeValue("Messages");

            // Array met string 1:DDD, string 2:DDDD ...
            let messagesMetID = messagesString.split(';');

            // String splitsen en omzetten naar Object
            for (var i = 0; i < messagesMetID.length - 1; i++) {
                var splitsen = messagesMetID[i].split(':');
                var message = {
                    id: splitsen[0],
                    text: splitsen[1]
                }
                // Object toevoegen aan Array
                messageArray.push(message);
            }

            // Array zetten als property
            this._setMessages(messageArray);
        }


        private async _sendForm(e: Event) {
            console.log("1");
            // Hier iets doen als ze op verzenden klikken.
            var optionOfMessage = ""
            var textarea = (document.getElementById("inputSelfWrittenMelding")) as HTMLSelectElement;
            var dropdown = (document.getElementById("problemDropdown")) as HTMLSelectElement;

            //chekcen of ze een voorgemaakte message hebben of niet
            if (this.selectedOption == 0) {

                //message ophalen en kijken of ze niet leeg is
                var m = this.alprDataPo.getAttributeValue("Message");

                if (m === "") {
                    //foutmelding tonen lege melding
                    this._setMessageEmptyAfterSend(true);
                    return;
                } else {
                    //foutmelding verbergen van lege melding
                    this._setMessageEmptyAfterSend(false);

                    //message zetten op PO
                    this.alprDataPo.setAttributeValue("Message", textarea.value);
                    optionOfMessage = textarea.value;
                }
            } else {
                //Value ophalen van de dropdownbox (is de voorgemaakteMessageID)
                var premadeMessageId = dropdown.options[this.selectedOption].value;
                optionOfMessage = premadeMessageId;

                //message zetten op PO
                this.alprDataPo.setAttributeValue("Message", premadeMessageId);
            }


            //Checken of een plaat gevonden is in een foto
            var plate = this.alprDataPo.getAttributeValue("LicensePlate");
            if (plate != null) {
                if (plate === "null" || plate === "" || plate.length > 18) {
                    this._setPlateEmptyAfterSend(true);
                    return;
                } else {
                    this._setPlateEmptyAfterSend(false);
                }
            } else {
                this._setPlateEmptyAfterSend(true);
                return
            }

            //Indien een geldige message en geldige nummerplaat:
            await this.alprDataPo.getAction("SendMessage").execute();

            //redirecten
            window.location.replace("/Confirmation");
        }

        private _setValueDropdown() {
            // Dropdown selecteren
            var e = (document.getElementById("problemDropdown")) as HTMLSelectElement;

            // value opvragen van selected option
            this.selectedOption = e.selectedIndex;

            // Boolean aanpassen om textarea te tonen
            this._writeOwnMessage();
        }

        private _writeOwnMessage() {
            //Hier value checken van dropdown;
            if (this.selectedOption === 0) {
                this._setWriteOwnMessage(true);
            } else {
                this._setWriteOwnMessage(false);
            }

        }

        // waarde van het zelfgeschreven berichtopslagen in het PO
        private _setMessage() {
            this.alprDataPo.beginEdit();
            var textarea = (document.getElementById("inputSelfWrittenMelding")) as HTMLSelectElement;
            this.alprDataPo.setAttributeValue("Message", textarea.value + "");

            this._ValidateTextArea(textarea.value);
        }

        // nakijken of er een melding geschreven is en deze niet gewoon een spatie is.
        private _ValidateTextArea(value: string) {
            if (value === "" || value === " ") {
                this._setMessageEmptyAfterSend(true);
                return;
            } else {
                this._setMessageEmptyAfterSend(false);
            }
        }

        // nakeijken of de plaat een nummerplaat terug geeft of een error melding + het juist zetten van de booleans om validatie te tonen.
        private _isPlateValide() {
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
        }

        //plate wisselen met een candidaat.
        private _setPlate(event) {
            const item = event.target.dataset.item;
            this.alprDataPo.setAttributeValue("LicensePlate", item);
            this.$$("#licensePlate").innerText = item;
        }
        
        // na drukken op neem een foto
        private _videoCaptured(e: Event) {
            this._setTrueAfterPictureUpload(true);
            var tempThis = this;
            if (this.klicked) {
                return;
            } else {
                this.klicked = true;
            }

            //Declaraties
            let video = document.querySelector('video');
            const canvas = document.createElement('canvas');
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
            (async () => {
                await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
           
                //Environment camera aanspreken indien aanwezig
                navigator.mediaDevices.enumerateDevices()
                    .then(devices => {
                    
                        let videoDevices = [];
                        let videoDeviceID = "";
                        devices.forEach(device => {
                            console.log(device.kind + ": " + device.label +
                                " id = " + device.deviceId);
                            if (device.kind == "videoinput") {
                                videoDevices.push(device.deviceId);
                            }
                        });
                        if (videoDevices.length == 1) {
                            videoDeviceID = videoDevices[0]
                        } else if (videoDevices.length == 2) {
                            videoDeviceID = videoDevices[1]
                        }

                        const constraints = {
                            width: { ideal: 480, max: 3120, },
                            height: { ideal: 640, max: 4160 },
                            deviceId: { exact: videoDeviceID }
                        };
                        return navigator.mediaDevices.getUserMedia({ video: constraints });
                    }) //promise zetten op pas door te gaan als de camera actief is
                    .then((stream) => { video.srcObject = stream; return new Promise(resolve => video.onplaying = resolve); }) 
                    .then(() => mainLoopId = setInterval(_screenshotVideo, 500)) // foto interval starten
                    .catch(e => console.error(e));
                    this.alprDataPo.beginEdit();
                })();
            //functie aanroepen als de foto wordt veranderd
            document.getElementById("screenshot").addEventListener(
                "load",
                async function _sendImageToAPI() {
                    //stoppen met nieuwe fotos te nemen
                    clearInterval(mainLoopId);

                    //image op PO zetten
                    await tempThis.alprDataPo.setAttributeValue("ImageData", tempThis.imageFromCamera);

                    //custom action aanroepen
                    var returnedPO = await tempThis.alprDataPo.getAction("ProcessImage").execute();

                    //waardes terug ophalen van de custiom action
                    tempThis.$$("#licensePlate").innerText = returnedPO.getAttributeValue("LicensePlate") as string;
                    tempThis.alprDataPo.setAttributeValue("LicensePlate", returnedPO.getAttributeValue("LicensePlate"));

                    //indien plate niet valie is nieuwe foto maken en deze functie stoppen
                    if (!tempThis._isPlateValide()) {
                        mainLoopId = setInterval(_screenshotVideo, 500)
                        return
                    }

                    // CAMERA STOPPEN???
                    console.log("stap1");
                    (<MediaStream>video.srcObject).getTracks().forEach( stream => 
                        stream.stop(),
                        console.log("stopped stream")
                    );
                    
                    console.log("stap2");
                    video.srcObject = null;
                    

                    console.log("stap3");

                    tempThis.alprDataPo.setAttributeValue("InDB", returnedPO.getAttributeValue("InDB"));
                    var candidatesString = returnedPO.getAttributeValue("Candidates") as string;
                    var candidates = candidatesString.split(';');
                    tempThis._setCandidates(candidates);
                    tempThis.klicked = false;
                })
        }
    }
}