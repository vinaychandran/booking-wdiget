

var MystaysBookingWidget = {
    Constants: {

    },
    HelperMethods: {
        GetNightsOfStayString: function () {
            if (SelectedLanguage === 'en') {
                return 'Nights Of Stay'
            }
            else if (SelectedLanguage === 'ja') {
                return 'ëÿç›ÇÃñÈ'
            }
        }
    },
    SetDateValues: function SetDateValues(startval, endval) {

        document.getElementById('calendar-checkindate').setAttribute('data-value', startval);
        document.getElementById('calendar-checkoutdate').setAttribute('data-value', endval);

        if (startval !== "" && startval) {
            var startMonth = startval.split('|')[0];
            var startDate = startval.split('|')[1];
            var startDay = startval.split('|')[2];

            var checkinTitle = document.querySelector('#bookingwidget-checkin .title');
            checkinTitle.innerHTML = startMonth;

            var checkinDesc = document.querySelector('#bookingwidget-checkin .desc');
            checkinDesc.innerHTML = startDate + " " + startDay;
        }

        if (endval !== "" && endval) {
            var endMonth = endval.split('|')[0];
            var endDate = endval.split('|')[1];
            var endDay = endval.split('|')[2];

            var checkoutTitle = document.querySelector('#bookingwidget-checkout .title');
            checkoutTitle.innerHTML = endMonth;

            var checkoutDesc = document.querySelector('#bookingwidget-checkout .desc');
            checkoutDesc.innerHTML = endDate + " " + endDay;
        }
    },
    SetFooterText: function SetFooterText(startval, endval) {
        var calendarbody = document.querySelector('.mbsc-cal-body');

        //Removing the footer if it is already present
        var customcalendarfooter = document.querySelector('.mystays-calendar-footer');
        if (customcalendarfooter) {
            customcalendarfooter.parentNode.removeChild(customcalendarfooter);
        }


        var htmlString = '<p class="mystays-calendar-footer" >{startdate} - {enddateformat} - {NightsOfStay} {days}</p>';

        var dateDifference = Math.floor((Date.parse(endval) - Date.parse(startval)) / 86400000);

        htmlString = htmlString.replace('{startdate}', startval);
        htmlString = htmlString.replace('{enddateformat}', endval);
        htmlString = htmlString.replace('{days}', dateDifference);
        htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.HelperMethods.GetNightsOfStayString());

        calendarbody.insertAdjacentHTML('afterend', htmlString);

    },
    IsMobile: function IsMobile() {
        return window.innerWidth < 767;
    },

    CheckHover: function checkHover(element, dateList, rangeObject) {


        var dateListWithInterMediate = document.querySelectorAll('.mystays-hover-intermediate');

        //Remove class from existing elements
        for (var f = 0; f < dateListWithInterMediate.length; f++) {
            dateListWithInterMediate[f].classList.remove('mystays-hover-intermediate');
        }


        //Adding class from existing elements
        for (var i = 0; i < dateList.length; i++) {
            if (rangeObject.endVal === "" && new Date(dateList[i].getAttribute('data-full')) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full')) <= new Date(element.getAttribute('data-full'))) {
                dateList[i].classList.add('mystays-hover-intermediate');

            }
        }

        //Changing footer only when enddate is not set
        if (rangeObject.endVal === "") {
            MystaysBookingWidget.SetFooterText(rangeObject.startVal.split('|')[4], element.getAttribute('data-full'));
        }
    },
    InitiateRange: function InitiateRange() {

        var rangeObject = mobiscroll.range('#range-container', {
            theme: 'mobiscroll',
            lang: SelectedLanguage,
            context: '#calender-render-container',
            dateFormat: 'dd|M|yy|mm/dd/yy|yy-m-d',
            controls: ['calendar'],
            startInput: "#bookingwidget-checkin",
            endInput: '#bookingwidget-checkout',
            buttons: ['set'],
            months: 1,
            minRange: 1,
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
                var startval = inst.startVal;
                var endval = inst.endVal;



                MystaysBookingWidget.SetDateValues(startval, endval);
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

                MystaysBookingWidget.SetFooterText(inst.startVal.split('|')[4], inst.endVal.split('|')[4]);

                var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])')

                for (var i = 0; i < dateList.length; i++) {
                    dateList[i].classList.add('mystays-hover-added');
                    dateList[i].addEventListener('mouseover', function (e, args) {
                        MystaysBookingWidget.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                    })
                }
            }, onPageChange: function (event, inst) {
                var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])')
                for (var i = 0; i < dateList.length; i++) {
                    dateList[i].classList.add('mystays-hover-added');
                    dateList[i].addEventListener('mouseover', function (e, args) {
                        MystaysBookingWidget.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                    })
                }
            }
        });
        return rangeObject;
    }
};



document.addEventListener("DOMContentLoaded", function () {
    SelectedLanguage = 'en';
    myrange = MystaysBookingWidget.InitiateRange();
});