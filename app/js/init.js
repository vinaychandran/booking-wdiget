
var MystaysBookingWidget = {
    SelectedLanguage:'',
    Constants: {
        //Variable used to store the current active button
        CurrentStatus: '',
        //Variable used to identify if the checkout date is manually set to the next day
        CheckNextDaySetManually: false,
        EnglishMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        CalendarHeader:['Japanese Calendar','English Calendar','Chinese Calendar','Taiwanese calendar','Korean calendar']

    },
    HelperMethods: {
        GetNightsOfStayString: function () {
            if (MystaysBookingWidget.SelectedLanguage  === 'en') {
                return 'Nights Of Stay';
            }
            else if (MystaysBookingWidget.SelectedLanguage  === 'ja') {
                return 'ëÿç›ÇÃñÈ';
            }
        },
        IsDescendant: function IsDescendant(parent, child) {
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
    },
    //Function to trigger click out event
    ClickOutside: function clickOutside() {

        document.addEventListener('click', function (e) {
            var container = document.getElementById('calender-render-container');
            var checkinContainer = document.getElementById('bookingwidget-checkin');
            var checkoutContainer = document.getElementById('bookingwidget-checkout');
            if ((!(container === e.target) && !MystaysBookingWidget.HelperMethods.IsDescendant(container, e.target)) && (!(checkinContainer === e.target) && !MystaysBookingWidget.HelperMethods.IsDescendant(checkinContainer, e.target)) && (!(checkoutContainer === e.target) && !MystaysBookingWidget.HelperMethods.IsDescendant(checkoutContainer, e.target))) {

                if (bookingWidgetRange) {
                    bookingWidgetRange.hide();
                }
            }
        })
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
    //Method to render the text on the footer
    SetFooterText: function SetFooterText(startval, endval, increaseHeight, RenderedElement) {

        if (RenderedElement) {
            var documentElement = RenderedElement;
        } else {
            var documentElement = document;
        }

        //Removing the footer if it is already present
        var customcalendarfooter = documentElement.querySelector('.mystays-calendar-footer');
        if (customcalendarfooter) {
            customcalendarfooter.parentNode.removeChild(customcalendarfooter);
        }
        if (!MystaysBookingWidget.IsMobile()) {


            //if (increaseHeight) {
            //    //Increasing height of calendar to accomodate dynamic footer
            //    var perspective = documentElement.querySelector('.mbsc-fr-persp');
            //    perspective.style.height = (perspective.offsetHeight + 50) + "px";


            //}

            var calendarbody = documentElement.querySelector('.mbsc-cal-body');
            var htmlString = '<p class="mystays-calendar-footer" >{startdate} - {enddateformat} - {NightsOfStay} {days}</p>';

            var dateDifference = Math.floor((Date.parse(endval) - Date.parse(startval)) / 86400000);

            htmlString = htmlString.replace('{startdate}', startval);
            htmlString = htmlString.replace('{enddateformat}', endval);
            htmlString = htmlString.replace('{days}', dateDifference);
            htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.HelperMethods.GetNightsOfStayString());

            calendarbody.insertAdjacentHTML('afterend', htmlString);
        }
    },
    IsMobile: function IsMobile() {
        return window.innerWidth < 767;
    },
    CheckHover: function CheckHover(element, dateList, rangeObject) {
        MystaysBookingWidget.RemoveIntermediateHoverClass();


        //Adding class from existing elements(rangeObject.endVal === "")
        for (var i = 0; i < dateList.length; i++) {
            if ((MystaysBookingWidget.Constants.CheckNextDaySetManually || MystaysBookingWidget.Constants.CurrentStatus === 'end') && new Date(dateList[i].getAttribute('data-full')) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full')) <= new Date(element.getAttribute('data-full'))) {
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

    RemoveIntermediateHoverClass: function RemoveIntermediateHoverClass() {

        var dateListWithInterMediate = document.querySelectorAll('.mystays-hover-intermediate');

        //Remove class from existing elements
        for (var f = 0; f < dateListWithInterMediate.length; f++) {
            dateListWithInterMediate[f].classList.remove('mystays-hover-intermediate');
        }

    },
    CalendarCustomFunctions: function CalendarCustomFunctions() {
        document.querySelector('.mbsc-cal-body').addEventListener('mouseout', function () {
            MystaysBookingWidget.RemoveIntermediateHoverClass();
        });
    },
    AddCancelEvent: function () {
        bookingWidgetRange.clear();
    },
    AdjustSectionHeights: function () {
        document.querySelector('.mbsc-fr-c .mbsc-cal-body').style.height = (window.innerHeight - (document.querySelector('.mbsc-range-btn-t').offsetHeight + document.querySelector('.mystays-bookingwidget-calendarheader').offsetHeight + 100)) + 'px';
    },
    //Method to create custom selectors for start and end date
    SetCustomSelector: function (calendarElement, startval, endval) {

        if (calendarElement) {
            var updateContainer = calendarElement;
        } else {
            var updateContainer = document;
        }

        //Write logic only when selector is present
        if (updateContainer.querySelector('.mbsc-range-btn-start')) {
            //Removing existing elemtn
            if (updateContainer.querySelectorAll('.mystays-range-selector-header').length > 0) {
                var customSelector = updateContainer.getElementsByClassName("mystays-range-selector-header");

                while (customSelector[0]) {
                    customSelector[0].parentNode.removeChild(customSelector[0]);
                }
            }


            //Start date
            var startdate = startval.split('|')[0];
            var startday = startval.split('|')[5];
            var startmonth = startval.split('|')[1];

            var checkinDateElement = document.createElement('div');
            checkinDateElement.innerHTML = '<div class="mystays-range-selector-header" ><div class="mystays-range-btn-heading">Checkin</div><div class="mystays-range-btn-date"><span>{date}</span><span>{day}</span><span>{month}</span></div></div>'.replace('{date}', startdate).replace('{day}', startday).replace('{month}', startmonth);
            updateContainer.querySelector('.mbsc-range-btn-start .mbsc-range-btn').appendChild(checkinDateElement);


            //End date
            if (endval === '') {
                var enddate = '';
                var endday = '';
                var endmonth = '';
            } else {
                var enddate = endval.split('|')[0];
                var endday = endval.split('|')[5];
                var endmonth = endval.split('|')[1];
            }

            var checkoutDateElement = document.createElement('div');
            checkoutDateElement.innerHTML = '<div class="mystays-range-selector-header" ><div class="mystays-range-btn-heading">Check out</div><div class="mystays-range-btn-date"><span>{date}</span><span>{day}</span><span>{month}</span></div></div>'.replace('{date}', enddate).replace('{day}', endday).replace('{month}', endmonth);;
            updateContainer.querySelector('.mbsc-range-btn-end .mbsc-range-btn').appendChild(checkoutDateElement);
        }
    },
    //Added a header section to the calendar 
    SetCustomerCalendarHeader: function (calendarElement) {

        if (calendarElement) {
            var updateContainer = calendarElement;
        } else {
            var updateContainer = document;
        }

        var calendarheadersection = updateContainer.querySelector('.mbsc-fr-focus');

        //Write logic only when selector is present
        if (calendarheadersection && MystaysBookingWidget.IsMobile()) {

            updateContainer.querySelector('.mbsc-fr-persp').style.height = window.outerHeight + 'px';

            var calendarHeader = document.createElement('div');

            var clearButton = document.createElement('span');
            clearButton.innerHTML = '<';
            clearButton.id = 'mystays-bookingwidget-clr-btn';
            clearButton.addEventListener('click', MystaysBookingWidget.AddCancelEvent);
            calendarHeader.appendChild(clearButton);


            var calendarHeaderElement = document.createElement('span');

            calendarHeader.classList = 'mystays-bookingwidget-calendarheader';
            if (MystaysBookingWidget.SelectedLanguage=='ja') {
                calendarHeaderElement.innerHTML = MystaysBookingWidget.Constants.CalendarHeader[0];
            } else if (MystaysBookingWidget.SelectedLanguage == 'en') {
                calendarHeaderElement.innerHTML = MystaysBookingWidget.Constants.CalendarHeader[1];
            } else if (MystaysBookingWidget.SelectedLanguage == 'zh') {
                calendarHeaderElement.innerHTML = MystaysBookingWidget.Constants.CalendarHeader[2];
            } else if (MystaysBookingWidget.SelectedLanguage == 'ja') {
                calendarHeaderElement.innerHTML = MystaysBookingWidget.Constants.CalendarHeader[3];
            }

            calendarHeader.appendChild(calendarHeaderElement);
        
            calendarheadersection.insertAdjacentHTML('beforebegin', calendarHeader.outerHTML);

            

        }
    },
    CheckStartEndDay: function (event, inst) {
        
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
    //Method to set custom header for each month
    SetCustomMonthHeader: function (calendarElement) {

        if (MystaysBookingWidget.IsMobile()) {

            if (calendarElement) {
                var updateContainer = calendarElement;
            } else {
                var updateContainer = document;
            }

            //Removing the header before adding again
            if (updateContainer.querySelectorAll('.mystays-bookingwidget-header-month').length > 0) {
                var customSelector = updateContainer.getElementsByClassName("mystays-bookingwidget-header-month");

                while (customSelector[0]) {
                    customSelector[0].parentNode.removeChild(customSelector[0]);
                }
            }

            //Looping through each month and dding the custom header
            for (var i = 0; i < updateContainer.querySelectorAll('.mbsc-cal-day-picker .mbsc-cal-table').length; i++) {
                //Get the date for the section
                var sectionContainer = updateContainer.querySelectorAll('.mbsc-cal-day-picker .mbsc-cal-table')[i];
                var sectionStartDate = sectionContainer.querySelector('[data-full]').getAttribute('data-full');
                var sectionStartMonth = new Date(sectionStartDate).getMonth();
                var sectionStartYear = new Date(sectionStartDate).getFullYear();
                var headerText = '';
                if (MystaysBookingWidget.SelectedLanguage === 'en') {
                    headerText = MystaysBookingWidget.Constants.EnglishMonthNames[sectionStartMonth] + ' ' + sectionStartYear;
                }

                var sectionheader = document.createElement('div');
                sectionheader.className = 'mystays-bookingwidget-header-month';
                sectionheader.innerHTML = headerText;
                sectionContainer.insertAdjacentHTML('beforebegin', sectionheader.outerHTML);


            }
            
        }
    },
    InitiateRange: function InitiateRange() {

        

        var rangeObject = mobiscroll.range('#range-container', {
            theme: 'mobiscroll',
            lang: MystaysBookingWidget.SelectedLanguage,
            display:'center',
            cssClass: 'mystays-bookingwidget',
            context: '#calender-render-container',
            dateFormat: 'dd|M|yy|mm/dd/yy|yy-m-d|D',
            controls: ['calendar'],
            startInput: "#bookingwidget-checkin",
            endInput: '#bookingwidget-checkout',
            buttons: [
                'set'
            ],
            months: 1,
            minRange: 86400000,
            outerMonthChange: false,
            calendarScroll: 'vertical',
            min: new Date(),
            layout: 'liquid',
            showSelector: true,
            animate:'slidehorizontal',
            closeOnOverlayTap: true,
            responsive: {
                medium: {
                    months: 2,
                    showSelector: false,
                    animate: 'pop',
                    display: 'bubble',
                    layout: 'fixed',
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
                inst.setVal(range, true, true, false);
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
            onMarkupReady: function (event, inst) {
                MystaysBookingWidget.SetCustomerCalendarHeader(event.target);
                MystaysBookingWidget.SetCustomSelector(event.target, inst.startVal, inst.endVal);
                MystaysBookingWidget.ClickOutside();
                MystaysBookingWidget.SetFooterText(inst.startVal.split('|')[4], inst.endVal.split('|')[4], true, event.target);
                MystaysBookingWidget.SetCustomMonthHeader(event.target);
            },
            onSet: function (event, inst) {
                MystaysBookingWidget.CheckStartEndDay(event, inst);
            },
            onShow: function (event, inst) {
                MystaysBookingWidget.AdjustSectionHeights();
                MystaysBookingWidget.Constants.CheckNextDaySetManually = false;
                console.log('onShow - status - ' + MystaysBookingWidget.Constants.CurrentStatus);


                if (!MystaysBookingWidget.IsMobile()) {
                    var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])');
                    for (var i = 0; i < dateList.length; i++) {
                        dateList[i].classList.add('mystays-hover-added');
                        dateList[i].addEventListener('mouseover', function (e, args) {
                            MystaysBookingWidget.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                        });
                    }
                }

                MystaysBookingWidget.CalendarCustomFunctions();
            }, onPageChange: function (event, inst) {

                if (!MystaysBookingWidget.IsMobile()) {
                    var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])');
                    for (var i = 0; i < dateList.length; i++) {
                        dateList[i].classList.add('mystays-hover-added');
                        dateList[i].addEventListener('mouseover', function (e, args) {
                            MystaysBookingWidget.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                        });
                    }
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
            onPageLoaded: function (event, inst) {
                MystaysBookingWidget.SetCustomMonthHeader();
            },
            onSetDate: function (event, inst) {
                //A variable to check which date is currently active(start or end)

                MystaysBookingWidget.Constants.CurrentStatus = event.active;

                if (event.active === 'start') {
                    //Removing all the intermediate hover when user is selecting start date
                    var dateListWithInterMediate = document.querySelectorAll('.mystays-hover-intermediate');
                    //Remove class from existing elements
                    for (var f = 0; f < dateListWithInterMediate.length; f++) {
                        dateListWithInterMediate[f].classList.remove('mystays-hover-intermediate');
                    }
                }

                console.log('onSetDate - status - ' + MystaysBookingWidget.Constants.CurrentStatus);
                var startval = inst.startVal;
                var endval = inst.endVal;
                MystaysBookingWidget.SetDateValues(inst);
                MystaysBookingWidget.SetCustomSelector(null, startval, endval);
            }
        });

        

        return rangeObject;
    }
};



document.addEventListener("DOMContentLoaded", function () {
    MystaysBookingWidget.SelectedLanguage = 'en';
    bookingWidgetRange = MystaysBookingWidget.InitiateRange();
});