var MystaysBookingWidget = {

    SetDateValues: function SetDateValues(startval, endval) {
        if (startval !== "" && startval) {
            var startMonth = startval.split('|')[0];
            var startDate = startval.split('|')[1];
            var startDay = startval.split('|')[2];

            var checkinTitle = document.querySelectorAll('#bookingwidget-checkin .title');
            checkinTitle[0].innerHTML = startMonth;

            var checkinDesc = document.querySelectorAll('#bookingwidget-checkin .desc');
            checkinDesc[0].innerHTML = startDate + " " + startDay;
        }

        if (endval !== "" && endval) {
            var endMonth = endval.split('|')[0];
            var endDate = endval.split('|')[1];
            var endDay = endval.split('|')[2];

            var checkoutTitle = document.querySelectorAll('#bookingwidget-checkout .title');
            checkoutTitle[0].innerHTML = endMonth;

            var checkoutDesc = document.querySelectorAll('#bookingwidget-checkout .desc');
            checkoutDesc[0].innerHTML = endDate + " " + endDay;
        }
    },
    IsMobile: function IsMobile() {
        return window.innerWidth < 767;
    },

    InitiateRange: function InitiateRange() {
        var rangeObject = mobiscroll.range('#range-container', {
            theme: 'mobiscroll',
            lang: 'en',
            context: '#calender-render-container',
            dateFormat:'M|dd|D|mm/dd/yy',
            controls: ['calendar'],
            startInput: "#bookingwidget-checkin",
            endInput: '#bookingwidget-checkout',
            buttons: ['set'],
            months: 1,
            calendarScroll: 'vertical',
            min: new Date(),
            showSelector: false,
            closeOnOverlayTap: false,
            responsive: {
                medium: {
                    months: 2,
                    calendarScroll: 'horizontal',
                    focusOnClose: '.booking-box.guests',
                    buttons: []
                }
            },
            yearChange: false,

            //Events
            onInit: function (event, inst) {
                var now = new Date(),
                    range = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0)];
                inst.setVal(range);
            },
            onDayChange: function (event, inst) {
                //Automatically hide widget on selection of end date for non mobile devices
                if (!MystaysBookingWidget.IsMobile() && event.active === 'end') {
                    inst.hide();
                }
            },
            onSet: function (event, inst) {
                var startval = inst.startVal;
                var endval = inst.endVal;

                MystaysBookingWidget.SetDateValues(startval, endval);

               
            },
            onShow: function (event, inst) {

            }

        });
        return rangeObject;
    }
};



document.addEventListener("DOMContentLoaded", function () {   
   myrange = MystaysBookingWidget.InitiateRange();
});