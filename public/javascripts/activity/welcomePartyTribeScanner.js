const app = (() => {

    const video = document.createElement("video");
    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");
    const loadingMessage = document.getElementById("loadingMessage");
    const outputContainer = document.getElementById("output");
    const outputMessage = document.getElementById("outputMessage");
    const outputData = document.getElementById("outputData");

    const submitButton = document.getElementById("submit");
    const tribeSelection = document.getElementById("tribeName");
    const passwordInput = document.getElementById("inputPassword");

    let api = undefined;
    let tribeName = undefined;
    let password = undefined;

    let sendingPool = [];

    function removeItemOnce(arr, value) {
        let index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    function sendRequest(uid) {
        fetch(api, {
            body: JSON.stringify({
                uid: uid,
                stage: tribeName,
                password: password
            }),
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
            'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'same-origin'
        })
        .then(async res => {
            let resBody = await res.json();
            if(res.status === 401) {
                removeItemOnce(sendingPool, uid);
                throw Error("密碼錯誤");
            }
            if(res.status >= 400) {
                removeItemOnce(sendingPool, uid);
                throw Error(resBody.msg);
            }
            if(res.status === 200) {
                alert("掃描成功，訊息：" + resBody.msg);
            }
        })
        .catch(err => alert("掃描失敗，錯誤訊息：" + err));
    }

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    function tick() {
        loadingMessage.innerText = "⌛ Loading video..."
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.remove();
            canvasElement.hidden = false;
            outputContainer.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                outputMessage.hidden = true;
                outputData.parentElement.hidden = false;
                outputData.innerText = code.data;
                if (!sendingPool.includes(code.data)) {
                    sendingPool.push(code.data);
                    sendRequest(code.data, undefined);
                }
            } else {
                outputMessage.hidden = false;
                outputData.parentElement.hidden = true;
            }
        }
        requestAnimationFrame(tick);
    }

    function startCamera() {
        // Use facingMode: environment to attemt to get the front camera on phones
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        });
    }

    function getConfiguration() {
        tribeName = tribeSelection.options[tribeSelection.selectedIndex].value;
        password = passwordInput.value;
        // Check value
        if (!["醫療嗡嗡部落", "運動動茲部落", "法律圈圈部落", "文創饗饗部落", "花園水水部落", "凹豆球球部落", "兌獎部落"].includes(tribeName)) {
            alert("請選擇部落名稱！");
            return;
        }

        if(password.replace(" ", "") === "") {
            alert("請輸入密碼");
            return;
        }

        api = (tribeName === "兌獎部落") ? "/api/drawed" : "/api/checkpoint";

        tribeSelection.setAttribute("disabled", true);
        passwordInput.setAttribute("disabled", true);
        loadingMessage.innerHTML = "🎥 無法取得相機影像，請確認允許相機存取權限";
        startCamera();
    }

    function init() {
        submitButton.addEventListener('click', () => {
            getConfiguration();
        })
    }

    return {
        init
    };
})();
