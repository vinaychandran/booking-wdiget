//This javascript file contains methods used by the booking widget


var MystaysBookingWidget = {
    Common: {
        //Method to add custom logic when the calendar is shown
        ShowOverlayLogic: function ShowOverlayLogic() {
            document.getElementById('booking-widget-overlay').ShowElement();
            document.getElementById('booking-widget-module').classList.add('mystays-bookingwidget-visible');
        },
        //Method to add custom logic when the calendar is hidden
        HideOverlayLogic: function HideOverlayLogic() {
            document.getElementById('booking-widget-overlay').HideElement();
            document.getElementById('booking-widget-module').classList.remove('mystays-bookingwidget-visible');
        }
    },

    //All generic helper methods
    Helper: {
        
        Loaded: function Loaded() {
            MystaysBookingWidget.Helper.LoadExtensions();
        },
        //Method to add extension methods
        LoadExtensions: function LoadExtensions() {
            HTMLElement.prototype.ShowElement = function () {
                
                    this.classList.add('show');
                    this.classList.remove('hide');
                
            };
            HTMLElement.prototype.HideElement = function () {
                
                    this.classList.add('hide');
                    this.classList.remove('show');
                
            };
            NodeList.prototype.ShowElement = function () {
                this.forEach(el => el.ShowElement())
            };
            NodeList.prototype.HideElement = function () {
                this.forEach(el => el.HideElement())
            };
        },
        //Method to check if the device is a mobile or not
        IsMobile: function IsMobile() {
            return window.innerWidth < 767;
        },
        //Check if element is visible
        IsVisiable: function (element) {
            return (element.offsetParent != null)
        },
        //Method to check if an element is a Descendant of an item
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
        GetDays: function GetDays(startval, endval) {
            var dateDifference = Math.floor((Date.parse(endval) - Date.parse(startval)) / 86400000);
            return dateDifference
        },
        //Method to get the corresponding language item from an array
        //0 - Japanese
        //1 - English
        //2 - Chinese
        //3 - Taiwanese
        //4 - Korean
        GetCustomText: function GetCustomText(typeOfConstant) {
            if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'ja') {
                return typeOfConstant[0];
            }
            else if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'en') {
                return typeOfConstant[1];

            } else if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'zh') {
                return typeOfConstant[2];

            } else if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'tw') {
                return typeOfConstant[3];
            }
            else if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'ko') {
                return typeOfConstant[4];
            }
        },

    },
    //All functionalities related to the booking widget calendar
    BookingCalendar: {
        //The language used 
        SelectedLanguage: '',
        Constants: {
            //Variable used to store the current active button
            CurrentStatus: '',
            //Variable used to identify if the checkout date is manually set to the next day
            CheckNextDaySetManually: false,
            EnglishMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            EnglishMonthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            EnglishDayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            CalendarHeader: ['Japanese Calendar', 'Calendar', 'Chinese Calendar', 'Taiwanese calendar', 'Korean calendar'],
            NightsOfStayDesktop: ['‘ØÝ‚Ì–é', '({days} Nights)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            NightsOfStayOneNightDesktop: ['‘ØÝ‚Ì–é', '(1 Night)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            NightsOfStayMobile: ['‘ØÝ‚Ì–é', 'Ok ({days} Nights)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            NightsOfStayOneNightMobile: ['‘ØÝ‚Ì–é', 'Ok (1 Night)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights']
        },
        //Contains methods that alter the HTML of the calendar
        CustomHTML: {
            //Method to reposition the indicator icon based on user selection of start or end date
            RepositionSelectorIndicator: function RepositionSelectorIndicator(IsCheckin) {
                var rangeBubbleContainer = document.querySelector('.mbsc-fr-bubble-bottom');
                if (rangeBubbleContainer) {

                    
                    var rangeLeftProperty = document.querySelector('.mbsc-fr-bubble-bottom').style.left;
                    var btncontainer = document.querySelector('.booking-checkin-checkout');
                    var currentLeftPropertyValue = parseInt(rangeLeftProperty.replace('px', ''));

                    if (currentLeftPropertyValue > btncontainer.offsetWidth / 2) {
                        rangeBubbleContainer.style.left = (currentLeftPropertyValue - (btncontainer.offsetWidth / 2)) + "px";
                    }

                    //When checkin button is clicked
                    if (IsCheckin) {
                        
                        
                    } else {

                        

                    }
                    //If element is visiable then add class to allow animation on slide
                    if (MystaysBookingWidget.Helper.IsVisiable(rangeBubbleContainer)) {
                        rangeBubbleContainer.classList.add('mystays-bookingwidget-animate-slide');
                    }
                    
                }
            },
            UpdateSetButton: function (startdate, enddate) {
                if (MystaysBookingWidget.Helper.IsMobile()) {

                    var dateDifference = MystaysBookingWidget.Helper.GetDays(startdate, enddate);
                    if (dateDifference > 1) {
                        document.querySelector('.mbsc-fr-btn-w .mbsc-fr-btn').innerHTML = MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.NightsOfStayMobile).replace('{days}', dateDifference);
                    } else {
                        document.querySelector('.mbsc-fr-btn-w .mbsc-fr-btn').innerHTML = MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.NightsOfStayOneNightMobile);
                    }

                }
            },
            //Method to disable previous dates after start date is selected
            DisablePreviousDates: function DisablePreviousDates(dateToCheck) {
                MystaysBookingWidget.BookingCalendar.CustomHTML.EnableAllDates();
                var dateItemList = document.querySelectorAll('.mystays-hover-added');
                dateItemList.forEach(function (element, index) {
                    if (new Date(element.getAttribute('data-full')) < new Date(dateToCheck)) {
                        element.classList.add('mystays-bookingengine-disabled');
                        //element.classList.add('mbsc-disabled');
                        element.classList.add('mbsc-sc-itm-inv');

                    }

                });
            },
            //Method to reenable all the dates again
            EnableAllDates: function EnableAllDates() {
                var dateItemList = document.querySelectorAll('.mystays-bookingengine-disabled');


                dateItemList.forEach(function (element, index) {
                    element.classList.remove('mystays-bookingengine-disabled');
                    //element.classList.remove('mbsc-disabled');
                    element.classList.remove('mbsc-sc-itm-inv');

                });
            },
            //Method to set the date to the mystays check in and check out buttons
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
            SetFooterText: function SetFooterText(startval, endval, RenderedElement, IsEndDateADate) {
                if (!MystaysBookingWidget.Helper.IsMobile()) {
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


                    var calendarbody = documentElement.querySelector('.mbsc-cal-body');

                    if (!IsEndDateADate) {
                        var dateDifference = MystaysBookingWidget.Helper.GetDays(startval.split('|')[4], endval.split('|')[4]);
                    } else {
                        var dateDifference = MystaysBookingWidget.Helper.GetDays(startval.split('|')[4], endval);
                    }

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
                    }
                    //When a date is passed for endval(When hovering over dates in desktop)
                    else {

                        var endDate = new Date(endval);

                        if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'en') {
                            htmlString = htmlString.replace('{endday}', MystaysBookingWidget.BookingCalendar.Constants.EnglishDayNamesShort[endDate.getDay()]);
                            htmlString = htmlString.replace('{enddate}', ('0' + endDate.getDate()).slice(-2));
                            htmlString = htmlString.replace('{endmonth}', MystaysBookingWidget.BookingCalendar.Constants.EnglishMonthNamesShort[endDate.getDay()]);
                            htmlString = htmlString.replace('{endyear}', endDate.getFullYear());
                        }
                        htmlString = htmlString.replace('{endday}', endval.split('|')[5]);
                        htmlString = htmlString.replace('{enddate}', endval.split('|')[0]);
                        htmlString = htmlString.replace('{endmonth}', endval.split('|')[1]);
                        htmlString = htmlString.replace('{endyear}', endval.split('|')[2]);
                    }
                    if (dateDifference > 1) {
                        htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.NightsOfStayDesktop).replace('{days}', dateDifference));
                    } else {
                        htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.NightsOfStayOneNightDesktop));
                    }


                    calendarbody.insertAdjacentHTML('afterend', htmlString);
                }
            },

            //Method to remove all the intermediate classes
            RemoveIntermediateHoverLogic: function RemoveIntermediateHoverLogic() {

                var dateListWithInterMediate = document.querySelectorAll('.mystays-hover-intermediate');

                //Remove class from existing elements
                for (var f = 0; f < dateListWithInterMediate.length; f++) {
                    dateListWithInterMediate[f].classList.remove('mystays-hover-intermediate');
                }

            },

            //Method to add a custom class on all dates in between a start and end date
            CheckHover: function CheckHover(element, dateList, rangeObject) {
                MystaysBookingWidget.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();


                //Adding class from existing elements(rangeObject.endVal === "")
                for (var i = 0; i < dateList.length; i++) {
                    if ((MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually || MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus === 'end') && new Date(dateList[i].getAttribute('data-full')) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full')) <= new Date(element.getAttribute('data-full'))) {
                        dateList[i].classList.add('mystays-hover-intermediate');

                    }
                }

                //Changing footer only when element date is greater than the start date
                if ((MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually || MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus === 'end') && new Date(rangeObject.startVal.split('|')[4]) < new Date(element.getAttribute('data-full'))) {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(rangeObject.startVal, element.getAttribute('data-full'), null, true);
                }
                //Else setting it to start and end date
                else {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(rangeObject.startVal, rangeObject.endVal, null, false);
                }
            },
            //Alter section heights
            AdjustSectionHeights: function AdjustSectionHeights() {
                if (MystaysBookingWidget.Helper.IsMobile()) {
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
                if (calendarheadersection && MystaysBookingWidget.Helper.IsMobile()) {

                    updateContainer.querySelector('.mbsc-fr-persp').style.height = window.outerHeight + 'px';

                    var calendarHeader = document.createElement('div');

                    var clearButton = document.createElement('span');
                    clearButton.id = 'mystays-bookingwidget-clr-btn';
                    clearButton.classList.add('mbsc-ic-arrow-left5');
                    clearButton.classList.add('mbsc-ic');
                    calendarHeader.appendChild(clearButton);


                    var calendarHeaderElement = document.createElement('span');

                    calendarHeader.classList = 'mystays-bookingwidget-calendarheader';

                    calendarHeaderElement.innerHTML = MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.CalendarHeader);


                    calendarHeader.appendChild(calendarHeaderElement);

                    calendarheadersection.insertAdjacentHTML('beforebegin', calendarHeader.outerHTML);

                    var backbutton = updateContainer.querySelector('#mystays-bookingwidget-clr-btn');

                    backbutton.addEventListener('click', function () {
                        MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.AddHideEvent();
                    });
                }
            },
            //Method to set custom header for each month
            SetCustomMonthHeader: function SetCustomMonthHeader(calendarElement) {

                if (MystaysBookingWidget.Helper.IsMobile()) {

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
                        if (MystaysBookingWidget.BookingCalendar.SelectedLanguage === 'en') {
                            headerText = MystaysBookingWidget.BookingCalendar.Constants.EnglishMonthNames[sectionStartMonth] + ' ' + sectionStartYear;
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
                    var container = document.querySelector('#booking-widget-container')
                    
                    if ((!(container === e.target) && !MystaysBookingWidget.Helper.IsDescendant(container, e.target)) ) {

                        if (MystaysRangeObject) {
                            MystaysRangeObject.hide();
                        }
                    }
                })
            },
            CalendarCustomFunctions: function CalendarCustomFunctions(inst) {
                document.querySelector('.mbsc-cal-body').addEventListener('mouseout', function () {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(inst.startVal, inst.endVal, null, false);
                });
            },
            //Hiding the calendar on back button press
            AddHideEvent: function () {
                MystaysRangeObject.hide();
            },
            AddIntermediateHoverLogic: function (inst) {

                if (!MystaysBookingWidget.Helper.IsMobile()) {
                    var dateList = document.querySelectorAll('.mbsc-cal-slide .mbsc-cal-day:not(.mystays-hover-added):not(.mbsc-disabled):not([aria-hidden="true"])');
                    for (var i = 0; i < dateList.length; i++) {
                        dateList[i].classList.add('mystays-hover-added');
                        dateList[i].addEventListener('mouseover', function (e, args) {
                            MystaysBookingWidget.BookingCalendar.CustomHTML.CheckHover(this, document.querySelectorAll('.mystays-hover-added'), inst);
                        });
                    }
                }
            }
        },
        //method to ensure that start and end dates are not the same
        ValidateStartEndDate: function (event, inst) {

            var startvalue = inst.startVal;
            var endvalue = inst.endVal;
            MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually = false;

            //If start date is equal to end date then set end date as next day
            if (inst.endVal === "" || (new Date(endvalue.split('|')[4]) <= new Date(startvalue.split('|')[4]))) {
                MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually = true;
                var startDate = new Date(inst.startVal.split('|')[4]);
                var nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1, 0, 0);
                inst.setVal([startDate, nextDay], true, true, false);

            }
        },
        ///Click Event Handler for the Check in section
        CheckInButtonHandler: function CheckInButtonHandler(element, args) {
            MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus = 'start';
            MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually = false;
            MystaysBookingWidget.BookingCalendar.CustomHTML.RepositionSelectorIndicator(true);

            MystaysBookingWidget.BookingCalendar.CustomHTML.EnableAllDates();

            //Removing all intermediate hover classes
            MystaysBookingWidget.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
        },
        ///Click Event Handler for the Check out section
        CheckOutButtonHandler: function CheckOutButtonHandler(element, args) {
            MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus = 'end';
            MystaysBookingWidget.BookingCalendar.CustomHTML.RepositionSelectorIndicator(false);

        },
        CheckInOutButtonHandlers: function () {
            var checkinbtn = document.getElementById('bookingwidget-checkin');
            var checkoutbtn = document.getElementById('bookingwidget-checkout');

            checkinbtn.addEventListener("click", function () {
                MystaysBookingWidget.BookingCalendar.CheckInButtonHandler();
            });
            checkoutbtn.addEventListener("click", function () {
                MystaysBookingWidget.BookingCalendar.CheckOutButtonHandler();
            });

        },
        //Method to load the mobiscrol range object
        LoadRange: function LoadRange() {
            var selectedLanguage = MystaysBookingWidget.BookingCalendar.SelectedLanguage;
            if (selectedLanguage === 'tw') {
                selectedLanguage = 'zh';
            }

            var rangeObject = mobiscroll.range('#range-container', {
                theme: 'mobiscroll',
                lang: selectedLanguage,
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
                        calendarWidth: 654
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

                    MystaysBookingWidget.BookingCalendar.CheckInOutButtonHandlers();
                },
                onDayChange: function (event, inst) {

                    if (event.active === 'end') {
                        //Logic to check only if that end date that is lesser than start date cannot be selected
                        if (event.date < new Date(inst.startVal.split('|')[4])) {
                            inst.setVal([event.date, inst.endVal], true);
                            return true;
                        }
                        //Automatically hide widget on selection of end date for non mobile devices
                        if (!MystaysBookingWidget.Helper.IsMobile()) {
                            inst.hide();
                            MystaysBookingWidget.GuestsWidget.DisplayGuestSection(true);
                        } else {
                            MystaysBookingWidget.BookingCalendar.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], event.date);
                        }

                    }

                    if (event.active === 'start') {
                        MystaysBookingWidget.BookingCalendar.CustomHTML.DisablePreviousDates(event.target.getAttribute('data-full'));
                        MystaysBookingWidget.BookingCalendar.CustomHTML.RepositionSelectorIndicator(false);
                    }
                },
                onMarkupReady: function (event, inst) {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetCustomerCalendarHeader(event.target);
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetCustomSelector(event.target, inst.startVal, inst.endVal);
                    MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.ClickOutside();
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(inst.startVal, inst.endVal, event.target);
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetCustomMonthHeader(event.target);
                },
                onSet: function (event, inst) {
                    MystaysBookingWidget.BookingCalendar.ValidateStartEndDate(event, inst);


                },
                onShow: function (event, inst) {
                    MystaysBookingWidget.GuestsWidget.DisplayGuestSection();
                    MystaysBookingWidget.Common.ShowOverlayLogic();
                    MystaysBookingWidget.BookingCalendar.CustomHTML.AdjustSectionHeights();
                    MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually = false;
                    MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.AddIntermediateHoverLogic(inst);
                    MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.CalendarCustomFunctions(inst);
                    MystaysBookingWidget.BookingCalendar.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], inst.endVal.split('|')[4]);
                },
                onClose: function (event, inst) {
                    MystaysBookingWidget.BookingCalendar.ValidateStartEndDate(event, inst);

                    MystaysBookingWidget.Common.HideOverlayLogic();
                },
                onPageChange: function (event, inst) {
                    MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.AddIntermediateHoverLogic(inst);
                },
                onPageLoaded: function (event, inst) {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetCustomMonthHeader();
                },
                onSetDate: function (event, inst) {
                    //A variable to check which date is currently active(start or end)

                    MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus = event.active;

                    if (event.active === 'start') {
                        MystaysBookingWidget.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
                    }
                    var startval = inst.startVal;
                    var endval = inst.endVal;
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetDateValues(inst);
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetCustomSelector(null, startval, endval);
                }
            });



            return rangeObject;
        },
        //Initial method for booking calendar
        Loaded: function Loaded(selectedLanguage) {

            MystaysBookingWidget.BookingCalendar.SelectedLanguage = selectedLanguage;
            return MystaysBookingWidget.BookingCalendar.LoadRange();
        }

    },
    //Functionalities related to the guests section
    GuestsWidget: {
        Constants: {
            GuestSectionClass: '.booking-guestselect-wrap',
            GuestButtonContainer: '.booking-box.guests .booking-box-wrap',
            ButtonAdd: '.guest-row .plus',
            ButtonRemove: '.guest-row .minus',
            RoomElement: '.booking-guestselect .room',
            AdultElement: '.booking-guestselect .adult',
            ChildElement: '.booking-guestselect .child',
            MainGuestsButtonTitle: '.booking-box.guests .input-top-wrap .title',
            MaximumRooms: 9,
            MaximumAdults: 15,
            MaximumChildren: 9,
            ChildAgeList:'.chidren-ages-dropndown'
            //ChildAgeSection='<li><select class="mystays-bookingengine-age"></select></li>'

        },

        CustomHTMLEvents: function CustomHTMLEvents() {
            MystaysBookingWidget.GuestsWidget.GuestButtonContainerClick();
        },

        //Method to show and hide the guest widget
        DisplayGuestSection: function DisplayGuestSection(ShowSection) {
            if (ShowSection) {
                document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestSectionClass).ShowElement();
                MystaysBookingWidget.Common.ShowOverlayLogic();
            } else {
                document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestSectionClass).HideElement();
                MystaysBookingWidget.Common.HideOverlayLogic();
            }
            
        },


        //Hide guest section when user clicks outside the widget
        ClickOutside: function ClickOutside() {
            document.addEventListener('click', function (e) {
                
                var container = document.querySelector('#booking-widget-container');
                if ((!(container === e.target) && !MystaysBookingWidget.Helper.IsDescendant(container, e.target))) {
                    MystaysBookingWidget.GuestsWidget.DisplayGuestSection(false);
                    
                }
            })
        },

        //Add new room
        RoomsButtonAdd: function RoomsButtonAdd(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.RoomElement);

            if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.GuestsWidget.Constants.MaximumRooms) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.GuestsWidget.Constants.MaximumRooms) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove).classList.remove('disabled');
                }


            }
            

            
        },

        //Remove room
        RoomsButtonRemove: function RoomsButtonRemove(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.RoomElement);

            if (parseInt(element.children[0].innerHTML) > 1) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == 1) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd).classList.remove('disabled');
                }
            }
        },

        //Add new adult
        AdultButtonAdd: function ChildButtonAdd(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.AdultElement);


            if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.GuestsWidget.Constants.MaximumAdults) {

                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.GuestsWidget.Constants.MaximumAdults) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitle = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle);
                MainGuestsButtonTitle.innerHTML = parseInt(MainGuestsButtonTitle.innerHTML) + 1;
                MainGuestsButtonTitle.setAttribute("data-count", (parseInt(MainGuestsButtonTitle.getAttribute("data-count")) + 1));
            }
        },

        //Remove adult
        AdultButtonRemove: function ChildButtonRemove(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.AdultElement);

            if (parseInt(element.children[0].innerHTML) > 1) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == 1) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitle = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle);
                MainGuestsButtonTitle.innerHTML = parseInt(MainGuestsButtonTitle.innerHTML) - 1;
                MainGuestsButtonTitle.setAttribute("data-count", (parseInt(MainGuestsButtonTitle.getAttribute("data-count")) - 1));
            }
        },

        //Method to dynamically generate child age selector
        AddChildAge: function AddChildAge() {
            var ageContainer = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildAgeList);

            var ageListItem = document.createElement('li');
            ageListItem.className = 'mystays-bookingengine-child-age';

            var ageSelectList = document.createElement('select');
            

            for (var i = 1; i <= 17; i++) {
                var ageOption = document.createElement('option');
                ageOption.setAttribute('value', i);
                ageOption.innerHTML = i;
                ageSelectList.appendChild(ageOption);
            }

            ageListItem.appendChild(ageSelectList);

            ageContainer.appendChild(ageListItem);
        },

        //Method to remove child when child count is reduced
        RemoveChildAge: function RemoveChildAge() {
            var ageContainer = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildAgeList);
            ageContainer.removeChild(ageContainer.lastChild);
        },

        //Add child
        ChildButtonAdd: function ChildButtonAdd(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildElement);

            if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.GuestsWidget.Constants.MaximumChildren) {

                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.GuestsWidget.Constants.MaximumChildren) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitle = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle);
                MainGuestsButtonTitle.innerHTML = parseInt(MainGuestsButtonTitle.innerHTML) + 1;
                MainGuestsButtonTitle.setAttribute("data-count", (parseInt(MainGuestsButtonTitle.getAttribute("data-count")) + 1));

                MystaysBookingWidget.GuestsWidget.AddChildAge();
            }
        },

        //Remove child
        ChildButtonRemove: function ChildButtonRemove(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildElement);

            if (parseInt(element.children[0].innerHTML) > 0) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == 0) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitle = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle);
                MainGuestsButtonTitle.innerHTML = parseInt(MainGuestsButtonTitle.innerHTML) - 1;
                MainGuestsButtonTitle.setAttribute("data-count", (parseInt(MainGuestsButtonTitle.getAttribute("data-count")) - 1));

                MystaysBookingWidget.GuestsWidget.RemoveChildAge();
            }
        },


        //Method to bind all the add and remove buttons
        ButtonClick: function ButtonClick() {
            var addbuttons = document.querySelectorAll(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd);
            var removebuttons = document.querySelectorAll(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove);

            var roomsElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.RoomElement);
            var adultElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.AdultElement);
            var childElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildElement);

            for (var i = 0; i < addbuttons.length; i++) {

                if (addbuttons[i].parentElement.contains(roomsElement)) {
                    addbuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.RoomsButtonAdd);
                } else if (addbuttons[i].parentElement.contains(adultElement)) {
                    addbuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.AdultButtonAdd);
                } else if (addbuttons[i].parentElement.contains(childElement)) {
                    addbuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.ChildButtonAdd);
                }
            }

            for (var i = 0; i < removebuttons.length; i++) {
                if (removebuttons[i].parentElement.contains(roomsElement)) {
                    removebuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.RoomsButtonRemove);
                } else if (removebuttons[i].parentElement.contains(adultElement)) {
                    removebuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.AdultButtonRemove);
                } else if (removebuttons[i].parentElement.contains(childElement)) {
                    removebuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.ChildButtonRemove);
                }
            }
        },

        

        //Method invoked when user clicks on the guest button
        GuestButtonContainerClick: function GuestButtonContainerClick() {
            document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestButtonContainer).addEventListener('click', function () {
                //Hide calendar
                if (MystaysRangeObject) {
                    MystaysRangeObject.hide();
                }
                MystaysBookingWidget.GuestsWidget.DisplayGuestSection(true);
            })
        },
        //Method called on document ready to invoke guest wigdget functionality
        Loaded: function Loaded() {
            MystaysBookingWidget.GuestsWidget.CustomHTMLEvents();
            MystaysBookingWidget.GuestsWidget.ClickOutside();
            MystaysBookingWidget.GuestsWidget.ButtonClick();
        }
    },
    Loaded: function (selectedLanguage) {
        MystaysBookingWidget.Helper.Loaded();
        MystaysRangeObject = MystaysBookingWidget.BookingCalendar.Loaded(selectedLanguage);
        MystaysBookingWidget.GuestsWidget.Loaded();
    }
};



document.addEventListener("DOMContentLoaded", function () {

    MystaysBookingWidget.Loaded('en');

});
