$(document).ready(function(){    $(".add-to-cart").on("click", function() {        debugger;        var cart = $(".add-cart");        var imgtodrag = $(this).parent(".item").find("img").eq(0);        if (imgtodrag) {            var imgclone = imgtodrag                .clone()                .offset({                    top: imgtodrag.offset().top,                    left: imgtodrag.offset().left                })                .css({                    opacity: "0.5",                    position: "absolute",                    height: "150px",                    width: "150px",                    "z-index": "100"                })                .appendTo($("body"))                .animate(                    {                        top: cart.offset().top + 10,                        left: cart.offset().left + 10,                        width: 75,                        height: 75                    },                    1000                );            imgclone.animate(                {                    width: 0,                    height: 0                },                function() {                    $(this).detach();                }            );        }    });    $("#profile-button").on("click", function() {        $(".cotn_principal").css('display','block');    });    $(".cross-div > a").on("click", function() {        $(".cotn_principal").css('display','none');    });    $(function() {        // contact form animations        $('#mail_us').click(function() {            $('.contactForm').fadeToggle();        })        $(document).mouseup(function (e) {            var container = $(".contactForm");            if (!container.is(e.target) // if the target of the click isn't the container...                && container.has(e.target).length === 0) // ... nor a descendant of the container            {                container.fadeOut();            }        });    });    // $(".add-cart").on("click", function() {    //    window.open("shopping_card.html");    // });});