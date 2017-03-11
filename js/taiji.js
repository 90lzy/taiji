/**
 * Created by lzy on 2017/3/8.
 */

$(function () {
    // 手指提示动画
    var guideMove = function () {
        var guide = $(".guide");
        // 恢复到初始位置
        guide.css({bottom: 0, right: 0});
        // 向右移动
        guide.animate({
            right: "-1rem"
        }, 1500);
    };
    guideMove();

    // 循环播放手指动画，直到 touchstart
    if (guideMoveTimer) {
        clearInterval(guideMoveTimer);
    }
    var guideMoveTimer = setInterval(guideMove, 2000);

    // 记录正在拖拽元素的信息
    var dragging = {
        ready: false,// 有元素准备拖拽
        triggerPiece: null,// 触发拖拽的太极碎片
        dragPiece: null, // 要拖拽的太极碎片，比触发区域大
        destination: null, // 拖拽的目的区域，对应的太极凹槽
        showPiece: null, // 拖拽成功后要显示的太极碎片
        touchX: 0,// 触屏位置
        touchY: 0,
        pieceX: 0,//被拖拽碎片的起始位置
        pieceY: 0,
        completed: 0 // 已完成碎片数量
    };

    // 五个太极碎片各自对应的触发、拖拽、目的地、最终结果元素，12345逆时针标记
    var pieceMap = {
        1: {
            trigger: ".trigger-drag-1",
            drag: ".taiji-drag-piece-1",
            destination: ".drag-destination-1",
            show: ".taiji-piece-1"
        },
        2: {
            trigger: ".trigger-drag-2",
            drag: ".taiji-drag-piece-2",
            destination: ".drag-destination-2",
            show: ".taiji-piece-2"
        },
        3: {
            trigger: ".trigger-drag-3",
            drag: ".taiji-drag-piece-3",
            destination: ".drag-destination-3",
            show: ".taiji-piece-3"
        },
        4: {
            trigger: ".trigger-drag-4",
            drag: ".taiji-drag-piece-4",
            destination: ".drag-destination-4",
            show: ".taiji-piece-4"
        },
        5: {
            trigger: ".trigger-drag-5",
            drag: ".taiji-drag-piece-5",
            destination: ".drag-destination-5",
            show: ".taiji-piece-5"
        }
    };

    // 给触发拖拽的元素绑定触屏事件
    $(".trigger-drag").each(function (index, obj) {
        index = index + 1;
        $(obj).on("touchstart", function (e) {
            if (guideMoveTimer) {
                // 停止手指动画，并隐藏
                clearInterval(guideMoveTimer);
                $(".guide").addClass("hide");
            }

            // 不处理多个手指同时触摸事件
            if (e.originalEvent.touches.length !== 1) {
                return
            }

            // 记录当前拖拽碎片的信息
            dragging.triggerPiece = $(pieceMap[index].trigger);
            dragging.dragPiece = $(pieceMap[index].drag);
            dragging.showPiece = $(pieceMap[index].show);
            dragging.destination = $(pieceMap[index].destination);
            e = e.originalEvent.touches[0];
            dragging.touchX = e.clientX;
            dragging.touchY = e.clientY;
            dragging.pieceX = dragging.dragPiece.offset().left;
            dragging.pieceY = dragging.dragPiece.offset().top;
            dragging.ready = true;
        });
    });

    // 手指在屏幕移动事件
    $(".container").on("touchmove", function (e) {
        if (!dragging.ready) {
            return;
        }
        dragging.showPiece.addClass("destination-guide");
        e.preventDefault();
        e = e.originalEvent.changedTouches[0];
        var movedX = e.clientX - dragging.touchX;
        var movedY = e.clientY - dragging.touchY;

        dragging.dragPiece.offset({"left": dragging.pieceX + movedX, "top": dragging.pieceY + movedY});
    });

    // 触摸停止事件
    $(".container").on("touchend", function (e) {
        // 没有准备拖拽碎片直接返回
        if (!dragging.ready) {
            return;
        }
        // 移除目的地提示标记
        dragging.showPiece.removeClass("destination-guide");
        // 根据触发元素和目的地元素是否重合判断是否到达
        if (isOverlap(dragging.triggerPiece, dragging.destination)) {
            // 显示结果碎片
            dragging.showPiece.removeClass("hide");
            // 隐藏刚被拖拽的碎片，使其不可用
            dragging.dragPiece.addClass("hide");
            dragging.ready = false;
            // 完成碎片加1
            dragging.completed++;
            if (dragging.completed === 5) {
                openGate();
            }
        } else {
            // 回到原位
            dragging.dragPiece.offset({"left": dragging.pieceX, "top": dragging.pieceY});
        }

    });

    function isOverlap(objOne, objTwo) {
        var offsetOne = objOne.offset();
        var offsetTwo = objTwo.offset();
        var x1 = offsetOne.left;
        var y1 = offsetOne.top;
        var x2 = x1 + objOne.width();
        var y2 = y1 + objOne.height();

        var x3 = offsetTwo.left;
        var y3 = offsetTwo.top;
        var x4 = x3 + objTwo.width();
        var y4 = y3 + objTwo.height();

        var zx = Math.abs(x1 + x2 - x3 - x4);
        var x = Math.abs(x1 - x2) + Math.abs(x3 - x4);
        var zy = Math.abs(y1 + y2 - y3 - y4);
        var y = Math.abs(y1 - y2) + Math.abs(y3 - y4);
        return (zx <= x && zy <= y);
    }

    function openGate() {
        $(".taiji-whole").addClass("hide");
        $(".taiji-seat").addClass("hide");
        $(".gate").removeClass("hide");
        $(".taiji-drag-pieces").addClass("hide");
        $(".gate-left").animate({
            left: "-4.2rem"
        }, 1000, function () {
            $(".gate-left").addClass("hide");
        });
        $(".gate-right").animate({
            right: "-4.2rem"
        }, 1000, function () {
            $(".gate-right").addClass("hide");
        });
    }

});