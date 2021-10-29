const app = (() => {

    const liffID = '1656571159-4DRjeenr';
    let pageWidth = undefined;
    let qrcode = undefined;

    function removeWaitingAnimation() {
        let waitingAnimation = document.getElementById("pac-man-home");
        waitingAnimation.remove();
    }

    function createQRCode(userId) {
        qrcode = new QRious({
            element: document.querySelector('canvas'),
            size: pageWidth * 0.5,
            backgroundAlpha: 0,
            value: userId
        });
    }

    function getUserId() {
        return new Promise((rs, rj) => {
            liff.getProfile()
            .then(profile => {
                rs(profile.userId);
            })
            .catch((err) => {
                err.customMsg = "取得使用者 ID 發生錯誤，請檢查是否同意存取權限"
                rj(err)
            });
        })
    }

    function liffInit() {
        return new Promise((rs,rj) => {
            liff.init({
                liffId: liffID
            }).then(() => {
                if (liff.getOS() == "web") throw new Error();
                rs();
            }).catch((err) => {
                err.customMsg = "LIFF 初始化失敗，請確認使用 LINE 開啟本服務"
                rj(err);
            });
        });
    }

    function eventBinding() {
        document.getElementById('closeBtn').addEventListener('click', () => {
            liff.closeWindow();
        });
    }

    function getClientEnvironment() {
        pageWidth = document.body.clientWidth;
    }

    function init() {
        // 取得螢幕寬度
        getClientEnvironment();
        // 綁定關閉按鈕事件
        eventBinding();
        // 取得使用者資訊並產生 QRCode
        liffInit()
        .then(() => {
            return getUserId();
        })
        .then((userId) => {
            removeWaitingAnimation();
            return createQRCode(userId);
        })
        .catch((err) => {
            if (!err.customMsg) err.customMsg = "發生未知錯誤：" + err;
            alert("顯示功能異常，請洽兌獎處資訊服務人員協助。錯誤訊息：" + err.customMsg);
        })
    }

    return {
        init
    };
})();
