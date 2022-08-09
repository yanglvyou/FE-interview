/**
 * 伪类 + transform实现单条border
 * <body>
    <div class="lines"></div>
</body>
 */

// .lines li{
//     position: relative;
//     border:none;
// }
// .lines li:after{
//     content: '';
//     position: absolute;
//     left: 0;
//     background: #000;
//     width: 100%;
//     height: 1px;
//     -webkit-transform: scaleY(0.5);
//             transform: scaleY(0.5);
//     -webkit-transform-origin: 0 0;
//             transform-origin: 0 0;
// }

/**
 * https://juejin.cn/book/6850413616484040711/section/6850413616580657159
 * 1px 边框
 * <div class="onepx-border normal">1px</div>
   <div class="onepx-border thin">0.5px</div>
 */

//    .onepx-border {
//     width: 200px;
//     height: 80px;
//     cursor: pointer;
//     line-height: 80px;
//     text-align: center;
//     font-weight: bold;
//     font-size: 50px;
//     color: #f66;
//     & + .onepx-border {
//         margin-top: 10px;
//     }
//     &.normal {
//         border: 1px solid #f66;
//     }
//     &.thin {
//         position: relative;
//         &::after {
//             position: absolute;
//             left: 0;
//             top: 0;
//             border: 1px solid #f66;
//             width: 200%;
//             height: 200%;
//             content: "";
//             transform: scale(.5);
//             transform-origin: left top;
//         }
//     }
// }
