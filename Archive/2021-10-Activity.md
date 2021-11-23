# 2021-10-活動回顧

## Overview

10/30 這天我們舉辦了我們第一個大型活動「瑞光島 登島慶典：冒險啟程」，詳細活動內容參照[粉絲專頁貼文](https://www.facebook.com/RuiGuangIsland/posts/142343394783934)，有超強的視覺設計、搭配超給力隱藏血汗公關與整個青創團隊的努力，終於孵出這一個活動，我們在這個活動推廣、並使用客製化電子集點方式，來吸引民眾目光並從而加入 Line@ 帳號

## Spotlight

這次主要推出活動資訊客製化電子集點功能，讓使用者可以選擇使用紙本或電子的集點卡進行活動闖關，使用者可以透過出示 LIFF 所產生的識別碼 QR Code 提供給關主使用網頁進行掃描 (Develope by @TMineCola)，並將掃描結果以 API POST 回給 Express Server 進行處理，並將結果寫入 MongoDB，以便後續兌獎完成度比對，然而圖片產生的方式會以使用者識別碼 (UID) 儲存於伺服器，並於每次闖關時將該關卡的章合成至該圖片中，因此每次查詢都是最新的狀態，如此一來也可以降低動態產生的負擔 (Develope by @CJYang)

* 活動資訊

<img src="/Archive/images/2021-10/activity_flex.png" width="100">

* 顯示集點卡 (我的闖關卡)

<img src="/Archive/images/2021-10/getpoint.jpg" width="100">

* 集點 QRCode (我要蓋闖關印章)

<img src="/Archive/images/2021-10/qrcode_display.png" width="100">

* 關主掃描集點

<img src="/Archive/images/2021-10/qrcode_scanner.jpg" width="100">

* 推播集點成功

<img src="/Archive/images/2021-10/pushpoint.jpg" width="100">

## Mind road

原先最一開始的構想是於結果流程相反，想要使用者以 LIFF 開啟相機去掃描各關卡固定的 QRCode，並且觸發使用者自動發送「我的集點卡」來顯示蓋完章的卡片，因為如此一來就不需要浪費免費的訊息推播 Quota，但直到看到了這張圖：

<img src="/Archive/images/2021-10/liff_support.jpg" width="100">

發現我們很難掌控使用者端的版本及OS，因此評估完後就決定用前段的方法了

## Reference

* [npm - sharp](https://www.npmjs.com/package/sharp) - 提供圖片合成功能

