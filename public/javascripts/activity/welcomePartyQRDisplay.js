const app = (() => {

    const liffID = '1656454740-7kk6amy4';
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
                rj(err)
            });
        })
    }

    function liffInit() {
        return new Promise((rs,rj) => {
            liff.init({
                liffId: liffID
            }).then(() => {
                rs();
            }).catch((error) => {
                rj(error);
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
            alert(err);
        })
    }

    return {
        init
    };
})();
