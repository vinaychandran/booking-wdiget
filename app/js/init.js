

//function delegate(el, evt, sel, handler) {
//    el.addEventListener(evt, function (event) {
//        var t = event.target;
//        while (t && t !== this) {
//            if (t.matches(sel)) {
//                handler.call(t, event);
//            }
//            t = t.parentNode;
//        }
//    });
//}


//delegate(document, "mouseover", ".mbsc-cal-cell", function (event) {
    
//});

var MystaysBookingWidget = {
    Constants: {
        //Variable used to store the current active button
        CurrentStatus: '',
        //Variable used to identify if the checkout date is manually set to the next day
        CheckNextDaySetManually:false
    },
    HelperMethods: {
        GetNightsOfStayString: function () {
            if (SelectedLanguage === 'en') {
                return 'Nights Of Stay';
            }
            else if (SelectedLanguage === 'ja') {
                return 'ëÿç›ÇÃñÈ';
            }
        }
    },
    //Method to disable previous dates after start date is selected
    DisablePreviousDates: function DisablePreviousDates(dateToCheck) {
        MystaysBookingWidget.EnableAllDates();
        var dateItemList = document.querySelectorAll('.mystays-hover-added');
        dateItemList.forEach(function (element, index) {
            if (new Date(element.getAttribute('data-full')) < new Date(dateToCheck)) {
                element.classList.add('mystays-bookingengine-disabled');
            }

        });
    },
    //Method to reenable all the dates again
    EnableAllDates: function EnableAllDates() {
        var dateItemList = document.querySelectorAll('.mystays-bookingengine-disabled');


        dateItemList.forEach(function (element, index) {
            element.classList.remove('mystays-bookingengine-disabled');
        });
    },
    SetDateValues: function SetDateValues(mobiScrollInstance) {

        startval = mobiScrollInstance.startVal;
        endval = mobiScrollInstance.endVal;

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


        //Adding class from existing elements(rangeObject.endVal === "")
        for (var i = 0; i < dateList.length; i++) {
            if ((MystaysBookingWidget.Constants.CheckNextDaySetManually || MystaysBookingWidget.Constants.CurrentStatus==='end') && new Date(dateList[i].getAttribute('data-full')) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full')) <= new Date(element.getAttribute('data-full'))) {
                dateList[i].classList.add('mystays-hover-intermediate');
                
            }
        }

        //Changing footer only when element date is greater than the start date
        if ((MystaysBookingWidget.Constants.CheckNextDaySetManually || MystaysBookingWidget.Constants.CurrentStatus === 'end') && new Date(rangeObject.startVal.split('|')[4]) < new Date(element.getAttribute('data-full'))) {
            MystaysBookingWidget.SetFooterText(rangeObject.startVal.split('|')[4], element.getAttribute('data-full'));
        }
        //Else setting it to start and end date
        else {
            MystaysBookingWidget.SetFooterText(rangeObject.startVal.split('|')[4], rangeObject.endVal.split('|')[4]);
        }
    },
    InitiateRange: function InitiateRange() {

        var rangeObject = mobiscroll.range('#range-container', {
            theme: 'mobiscroll',
            lang: SelectedLanguage,
            cssClass:'mystays-bookingwidget',
            context: '#calender-render-container',
            dateFormat: 'dd|M|yy|mm/dd/yy|yy-m-d',
            controls: ['calendar'],
            startInput: "#bookingwidget-checkin",
            endInput: '#bookingwidget-checkout',
            buttons: ['set'],
            months: 1,
            minRange: 86400000,
            calendarScroll: 'vertical',
            min: new Date(),
            //showSelector: false,
            closeOnOverlayTap: true,
            responsive: {
                medium: {
                    layout: 'fixed',
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
                inst.setVal(range,true, true, false);
                var startval = inst.startVal;
                var endval = inst.endVal;
            },
            onDayChange: function (event, inst) {

                console.log('onDayChange - status - ' + MystaysBookingWidget.Constants.CurrentStatus);

                //Logic to check only if that end date that is lesser than start date cannot be selected
                if (event.active === 'end') {
                    if (event.date < new Date(inst.startVal.split('|')[4])) {
                        inst.setVal([event.date, inst.endVal], true);
                        return true;
                    }
                }

                //Automatically hide widget on selection of end date for non mobile devices
                if (!MystaysBookingWidget.IsMobile() && event.active === 'end') {

                    inst.hide();
                }

                if (event.active === 'start') {
                    MystaysBookingWidget.DisablePreviousDates(event.target.getAttribute('data-full'));
                }
            },
            onSet: function (event, inst) {
                var startvalue = inst.startVal;
                var endvalue = inst.endVal;
                MystaysBookingWidget.Constants.CheckNextDaySetManually = false;

                //If start date is equal to end date then set end date as next day
                if ((new Date(endvalue.split('|')[4]) <= new Date(startvalue.split('|')[4])) || inst.endVal == '') {
                    MystaysBookingWidget.Constants.CheckNextDaySetManually = true;
                    var startDate = new Date(inst.startVal.split('|')[4]);
                    var nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1, 0, 0);
                    inst.setVal([startDate, nextDay], true, true, false);

                }
            },
            onShow: function (event, inst) {
                MystaysBookingWidget.Constants.CheckNextDaySetManually = false;
                console.log('onShow - status - ' + MystaysBookingWidget.Constants.CurrentStatus);
                MystaysBookingWidget.SetFooterText(inst.startVal.split('|')[4], inst.endVal.split('|')[4]);
                var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])');

                for (var i = 0; i < dateList.length; i++) {
                    dateList[i].classList.add('mystays-hover-added');
                    dateList[i].addEventListener('mouseover', function (e, args) {
                        MystaysBookingWidget.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                    });
                }
            }, onPageChange: function (event, inst) {
                var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])');
                for (var i = 0; i < dateList.length; i++) {
                    dateList[i].classList.add('mystays-hover-added');
                    dateList[i].addEventListener('mouseover', function (e, args) {
                        MystaysBookingWidget.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                    });
                }

            }, onClose: function (event, inst) {
                var startval = inst.startVal;
                var endval = inst.endVal;

                if (startval != "" && (endval == "" || (new Date(startval.split('|')[4]) > new Date(endval.split('|')[4])))) {
                    var startDate = new Date(startval.split('|')[4]);
                    var nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1, 0, 0);
                    inst.setVal([startDate, nextDay]);
                }

            },
            onSetDate: function (event, inst) {
                //A variable to check which date is currently active(start or end)
                if (event.active==='start') {
                    MystaysBookingWidget.Constants.CurrentStatus = 'start';
                } else if (event.active === 'end') {
                    MystaysBookingWidget.Constants.CurrentStatus = 'end';
                }

                
                console.log('onSetDate - status - ' + MystaysBookingWidget.Constants.CurrentStatus);
                var startval = inst.startVal;
                var endval = inst.endVal;
                MystaysBookingWidget.SetDateValues(inst);
            }
        });
        return rangeObject;
    }
};



document.addEventListener("DOMContentLoaded", function () {
    SelectedLanguage = 'en';
    myrange = MystaysBookingWidget.InitiateRange();
});