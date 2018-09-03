//This javascript file contains methods used by the booking widget


var MystaysBookingWidget = {
    //The language used 
    SelectedLanguage: '',
    Constants: {
        //Variable used to store the current active button
        CurrentStatus: '',
        //Variable used to identify if the checkout date is manually set to the next day
        CheckNextDaySetManually: false,
        EnglishMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        CalendarHeader: ['Japanese Calendar', 'Calendar', 'Chinese Calendar', 'Taiwanese calendar', 'Korean calendar'],
        NightsOfStayDesktop: ['ëÿç›ÇÃñÈ', '({days} Nights}', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
        NightsOfStayOneNightDesktop: ['ëÿç›ÇÃñÈ', '(1 Night)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
        NightsOfStayMobile: ['ëÿç›ÇÃñÈ', 'Ok ({days} Nights}', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
        NightsOfStayOneNightMobile: ['ëÿç›ÇÃñÈ', 'Ok (1 Night)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights']
    },
    //All helper methods
    HelperMethods: {
        //Method to check if the device is a mobile or not
        IsMobile: function IsMobile() {
            return window.innerWidth < 767;
        },
        GetCustomText: function GetCustomText(typeOfConstant) {
            if (MystaysBookingWidget.SelectedLanguage==='ja') {
                return typeOfConstant[0];
            }
            else if (MystaysBookingWidget.SelectedLanguage === 'en') {
                return typeOfConstant[1];

            } else if (MystaysBookingWidget.SelectedLanguage === 'zh') {
                return typeOfConstant[2];

            } else if (MystaysBookingWidget.SelectedLanguage === 'tw') {
                return typeOfConstant[3];
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
        },
        GetDays: function (startval,endval) {

            var dateDifference = Math.floor((Date.parse(endval) - Date.parse(startval)) / 86400000);

            return dateDifference
        }
    },
    //Contains methods that alter the HTML of the calendar
    CustomHTML: {
        UpdateSetButton: function (startdate, enddate) {
            if (MystaysBookingWidget.HelperMethods.IsMobile()) {

                var dateDifference = MystaysBookingWidget.HelperMethods.GetDays(startdate, enddate);
                if (dateDifference>1) {
                    document.querySelector('.mbsc-fr-btn-w .mbsc-fr-btn').innerHTML = MystaysBookingWidget.HelperMethods.GetCustomText(MystaysBookingWidget.Constants.NightsOfStayMobile).replace('{days}', dateDifference);
                } else {
                    document.querySelector('.mbsc-fr-btn-w .mbsc-fr-btn').innerHTML = MystaysBookingWidget.HelperMethods.GetCustomText(MystaysBookingWidget.Constants.NightsOfStayOneNightMobile);
                }
                
            }
        },
        //Method to disable previous dates after start date is selected
        DisablePreviousDates: function DisablePreviousDates(dateToCheck) {
            MystaysBookingWidget.CustomHTML.EnableAllDates();
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
        SetFooterText: function SetFooterText(startval, endval,  RenderedElement, IsEndDateADate) {

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
            if (!MystaysBookingWidget.HelperMethods.IsMobile()) {

                var calendarbody = documentElement.querySelector('.mbsc-cal-body');
                var dateDifference = MystaysBookingWidget.HelperMethods.GetDays(startval.split('|')[4], endval.split('|')[4]);
                var htmlString = '<p class="mystays-calendar-footer" >{startday}, {startdate} {startmonth} {startyear} - {endday}, {enddate} {endmonth} {endyear} - {NightsOfStay}</p>';
                htmlString = htmlString.replace('{startday}', startval.split('|')[5]);
                htmlString = htmlString.replace('{startdate}', startval.split('|')[0]);
                htmlString = htmlString.replace('{startmonth}', startval.split('|')[1]);
                htmlString = htmlString.replace('{startyear}', startval.split('|')[2]);

                //Not a date (When range end date is passed)
                if (!IsEndDateADate) {
                    htmlString = htmlString.replace('{endday}', endval.split('|')[5]);
                    htmlString = htmlString.replace('{enddate}', endval.split('|')[0]);
                    htmlString = htmlString.replace('{endmonth}', endval.split('|')[1]);
                    htmlString = htmlString.replace('{endyear}', endval.split('|')[2]);
                } else {
                    htmlString = htmlString.replace('{endday}', endval.split('|')[5]);
                    htmlString = htmlString.replace('{enddate}', endval.split('|')[0]);
                    htmlString = htmlString.replace('{endmonth}', endval.split('|')[1]);
                    htmlString = htmlString.replace('{endyear}', endval.split('|')[2]);
                }
                if (dateDifference>1) {
                    htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.HelperMethods.GetCustomText(MystaysBookingWidget.Constants.NightsOfStayDesktop).replace('{days}', dateDifference));
                } else {
                    htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.HelperMethods.GetCustomText(MystaysBookingWidget.Constants.NightsOfStayOneNightDesktop));
                }
                

                calendarbody.insertAdjacentHTML('afterend', htmlString);
            }
        },

        //Method to remove all the intermediate classes
        RemoveIntermediateHoverClass: function RemoveIntermediateHoverClass() {

            var dateListWithInterMediate = document.querySelectorAll('.mystays-hover-intermediate');

            //Remove class from existing elements
            for (var f = 0; f < dateListWithInterMediate.length; f++) {
                dateListWithInterMediate[f].classList.remove('mystays-hover-intermediate');
            }

        },

        //Method to add a custom class on all dates in between a start and end date
        CheckHover: function CheckHover(element, dateList, rangeObject) {
            MystaysBookingWidget.CustomHTML.RemoveIntermediateHoverClass();


            //Adding class from existing elements(rangeObject.endVal === "")
            for (var i = 0; i < dateList.length; i++) {
                if ((MystaysBookingWidget.Constants.CheckNextDaySetManually || MystaysBookingWidget.Constants.CurrentStatus === 'end') && new Date(dateList[i].getAttribute('data-full')) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full')) <= new Date(element.getAttribute('data-full'))) {
                    dateList[i].classList.add('mystays-hover-intermediate');

                }
            }

            //Changing footer only when element date is greater than the start date
            if ((MystaysBookingWidget.Constants.CheckNextDaySetManually || MystaysBookingWidget.Constants.CurrentStatus === 'end') && new Date(rangeObject.startVal.split('|')[4]) < new Date(element.getAttribute('data-full'))) {
                MystaysBookingWidget.CustomHTML.SetFooterText(rangeObject.startVal, element.getAttribute('data-full'), false);
            }
            //Else setting it to start and end date
            else {
                MystaysBookingWidget.CustomHTML.SetFooterText(rangeObject.startVal, rangeObject.endVal.split('|')[4]);
            }
        },
        //Alter section heights
        AdjustSectionHeights: function AdjustSectionHeights() {
            if (MystaysBookingWidget.HelperMethods.IsMobile()) {
                document.querySelector('.mbsc-fr-c .mbsc-cal-body').style.height = (window.innerHeight - (document.querySelector('.mbsc-range-btn-t').offsetHeight + document.querySelector('.mystays-bookingwidget-calendarheader').offsetHeight)) + 'px';
            }
        },
        //Method to create custom selectors for start and end date
        SetCustomSelector: function SetCustomSelector(calendarElement, startval, endval) {

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
                checkinDateElement.className = 'mystays-range-selector-header';
                checkinDateElement.innerHTML = '<div class="mystays-range-btn-heading">Checkin</div><div class="mystays-range-btn-date"><div class="mystays-bookingwidget-selector-date"><span>{date}</span></div><p><span>{day}</span><span>{month}</span></p></div>'.replace('{date}', startdate).replace('{day}', startday).replace('{month}', startmonth);
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
                checkoutDateElement.className = 'mystays-range-selector-header';
                checkoutDateElement.innerHTML = '<div class="mystays-range-btn-heading">Check out</div><div class="mystays-range-btn-date"><div class="mystays-bookingwidget-selector-date"><span>{date}</span></div><p><span>{day}</span><span>{month}</span></p></div>'.replace('{date}', enddate).replace('{day}', endday).replace('{month}', endmonth);;
                updateContainer.querySelector('.mbsc-range-btn-end .mbsc-range-btn').appendChild(checkoutDateElement);
            }
        },
        //Added a header section to the calendar 
        SetCustomerCalendarHeader: function SetCustomerCalendarHeader(calendarElement) {

            if (calendarElement) {
                var updateContainer = calendarElement;
            } else {
                var updateContainer = document;
            }

            var calendarheadersection = updateContainer.querySelector('.mbsc-fr-focus');

            //Write logic only when calendar selector is present
            if (calendarheadersection && MystaysBookingWidget.HelperMethods.IsMobile()) {

                updateContainer.querySelector('.mbsc-fr-persp').style.height = window.outerHeight + 'px';

                var calendarHeader = document.createElement('div');

                var clearButton = document.createElement('span');
                clearButton.id = 'mystays-bookingwidget-clr-btn';
                clearButton.classList.add('mbsc-ic-arrow-left5');
                clearButton.classList.add('mbsc-ic');
                clearButton.addEventListener('click', MystaysBookingWidget.CustomHTMLEvents.AddCancelEvent);
                calendarHeader.appendChild(clearButton);


                var calendarHeaderElement = document.createElement('span');

                calendarHeader.classList = 'mystays-bookingwidget-calendarheader';
                if (MystaysBookingWidget.SelectedLanguage == 'ja') {
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
        //Method to set custom header for each month
        SetCustomMonthHeader: function SetCustomMonthHeader(calendarElement) {

            if (MystaysBookingWidget.HelperMethods.IsMobile()) {

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
        
    },
    CustomHTMLEvents: {
        //Function to close the calendar when the user clicks outside
        ClickOutside: function ClickOutside() {
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
        CalendarCustomFunctions: function CalendarCustomFunctions() {
            document.querySelector('.mbsc-cal-body').addEventListener('mouseout', function () {
                MystaysBookingWidget.CustomHTML.RemoveIntermediateHoverClass();
            });
        },
        AddCancelEvent: function () {
            bookingWidgetRange.clear();
        },
        AddIntermediateHover: function (inst) {

            if (!MystaysBookingWidget.HelperMethods.IsMobile()) {
                var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])');
                for (var i = 0; i < dateList.length; i++) {
                    dateList[i].classList.add('mystays-hover-added');
                    dateList[i].addEventListener('mouseover', function (e, args) {
                        MystaysBookingWidget.CustomHTML.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                    });
                }
            }
        }
    },
    //method to ensure that start and end dates are not the same
    ValidateStartEndDate: function (event, inst) {

        var startvalue = inst.startVal;
        var endvalue = inst.endVal;
        MystaysBookingWidget.Constants.CheckNextDaySetManually = false;

        //If start date is equal to end date then set end date as next day
        if (inst.endVal === "" || (new Date(endvalue.split('|')[4]) <= new Date(startvalue.split('|')[4]))) {
            MystaysBookingWidget.Constants.CheckNextDaySetManually = true;
            var startDate = new Date(inst.startVal.split('|')[4]);
            var nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1, 0, 0);
            inst.setVal([startDate, nextDay], true, true, false);

        }
    },

    //Method to initialize range
    InitiateRange: function InitiateRange() {



        var rangeObject = mobiscroll.range('#range-container', {
            theme: 'mobiscroll',
            lang: MystaysBookingWidget.SelectedLanguage,
            display: 'center',
            cssClass: 'mystays-bookingwidget',
            fromText: '',
            toText: '',
            weekDays: 'short',
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
            animate: 'slidehorizontal',
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
                    buttons: [],
                    calendarWidth: 654,
                    calendarHeight: 250
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
                
                if (event.active === 'end') {
                    //Logic to check only if that end date that is lesser than start date cannot be selected
                    if (event.date < new Date(inst.startVal.split('|')[4])) {
                        inst.setVal([event.date, inst.endVal], true);
                        return true;
                    }
                    //Automatically hide widget on selection of end date for non mobile devices
                    if (!MystaysBookingWidget.HelperMethods.IsMobile()) {
                        inst.hide();
                    } else {
                        MystaysBookingWidget.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], event.date);
                    }
                }

                if (event.active === 'start') {
                    MystaysBookingWidget.CustomHTML.DisablePreviousDates(event.target.getAttribute('data-full'));
                }
            },
            onMarkupReady: function (event, inst) {
                MystaysBookingWidget.CustomHTML.SetCustomerCalendarHeader(event.target);
                MystaysBookingWidget.CustomHTML.SetCustomSelector(event.target, inst.startVal, inst.endVal);
                MystaysBookingWidget.CustomHTMLEvents.ClickOutside();
                MystaysBookingWidget.CustomHTML.SetFooterText(inst.startVal, inst.endVal,  event.target);
                MystaysBookingWidget.CustomHTML.SetCustomMonthHeader(event.target);
            },
            onSet: function (event, inst) {
                MystaysBookingWidget.ValidateStartEndDate(event, inst);
                
            },
            onShow: function (event, inst) {
                MystaysBookingWidget.CustomHTML.AdjustSectionHeights();
                MystaysBookingWidget.Constants.CheckNextDaySetManually = false;
                MystaysBookingWidget.CustomHTMLEvents.AddIntermediateHover(inst);
                MystaysBookingWidget.CustomHTMLEvents.CalendarCustomFunctions();
                MystaysBookingWidget.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], inst.endVal.split('|')[4]);
            }, onPageChange: function (event, inst) {
                MystaysBookingWidget.CustomHTMLEvents.AddIntermediateHover(inst);
            }, onClose: function (event, inst) {
                MystaysBookingWidget.ValidateStartEndDate(event, inst);
            },
            onPageLoaded: function (event, inst) {
                MystaysBookingWidget.CustomHTML.SetCustomMonthHeader();
            },
            onSetDate: function (event, inst) {
                //A variable to check which date is currently active(start or end)

                MystaysBookingWidget.Constants.CurrentStatus = event.active;

                if (event.active === 'start') {
                    MystaysBookingWidget.CustomHTML.RemoveIntermediateHoverClass();
                }


                var startval = inst.startVal;
                var endval = inst.endVal;
                MystaysBookingWidget.CustomHTML.SetDateValues(inst);
                MystaysBookingWidget.CustomHTML.SetCustomSelector(null, startval, endval);
            }
        });



        return rangeObject;
    }
};



document.addEventListener("DOMContentLoaded", function () {
    MystaysBookingWidget.SelectedLanguage = 'en';
    bookingWidgetRange = MystaysBookingWidget.InitiateRange();
});