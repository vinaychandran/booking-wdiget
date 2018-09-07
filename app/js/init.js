﻿//This javascript file contains methods used by the booking widget



var MystaysBookingWidget = {
    Common: {
        //The language used 
        SelectedLanguage: '',
        BookingWidgetContainer: '',

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
            //Method to change the date format (IOS cannot read default format)
            Object.prototype.ChangeDateFormat = function () {
                //If it is already a date then ignore
                if (!Date.parse(this)) {
                    return this.replace(/-/g, '/');
                }

                return this;
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
            if (MystaysBookingWidget.Common.SelectedLanguage === 'ja') {
                return typeOfConstant[0];
            }
            else if (MystaysBookingWidget.Common.SelectedLanguage === 'en') {
                return typeOfConstant[1];

            } else if (MystaysBookingWidget.Common.SelectedLanguage === 'zh') {
                return typeOfConstant[2];

            } else if (MystaysBookingWidget.Common.SelectedLanguage === 'tw') {
                return typeOfConstant[3];
            }
            else if (MystaysBookingWidget.Common.SelectedLanguage === 'ko') {
                return typeOfConstant[4];
            }
        },

    },
    //All functionalities related to the booking widget calendar
    BookingCalendar: {

        Constants: {
            //Variable used to store the current active button
            CurrentStatus: '',
            CalendarShown : false,
            //Variable used to identify if the checkout date is manually set to the next day
            CheckNextDaySetManually: false,
            EnglishMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            EnglishMonthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            EnglishDayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            CalendarHeader: ['Japanese Calendar', 'Calendar', 'Chinese Calendar', 'Taiwanese calendar', 'Korean calendar'],
            NightsOfStayDesktop: ['滞在の夜', '({days} Nights)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            NightsOfStayOneNightDesktop: ['滞在の夜', '(1 Night)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            NightsOfStayMobile: ['滞在の夜', 'Ok ({days} Nights)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            NightsOfStayOneNightMobile: ['滞在の夜', 'Ok (1 Night)', 'Chinese Nights', 'Taiwanese Nights', 'Korean Nights'],
            //Selectors
            RangeBubbleContainer: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .mbsc-fr-bubble-bottom';
            },
            IndicatorIcon: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .mbsc-fr-arr';
            },
            CheckinCheckoutContainer: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-checkin-checkout';
            },
            SetButtonContainer: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .mbsc-fr-btn-w .mbsc-fr-btn';
            },
            MystaysSelectedDate: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .mystays-selected-date';
            },
            HoverIntermediate: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .mystays-hover-intermediate';
            },
            DateDisabled: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .mystays-bookingengine-disabled';
            },
            CheckinContainer: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' #calendar-checkindate';
            },
            CheckoutContainer: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' #calendar-checkoutdate';
            },
            CalendarFooter: function () {
                return ' .mystays-calendar-footer';
            },
            CalendarBody: function () {
                return ' .mbsc-cal-body';
            },

            CheckinButtonTitle: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkin .title';
            },
            CheckinButtonDesc: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkin .desc';
            },
            CheckoutButtonTitle: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkout .title';
            },
            CheckoutButtonDesc: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkout .desc';
            },


            DefaultCalendarSelector: function () {
                return ' .mbsc-range-btn-start';
            },
            CustomCalendarSelector: function () {
                return 'mystays-range-selector-header';
            },
            
            MobiscrollDate: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            }


        },
        //Contains methods that alter the HTML of the calendar
        CustomHTML: {
            //Method to reposition the indicator icon based on user selection of start or end date
            RepositionSelectorIndicator: function RepositionSelectorIndicator(IsCheckin) {
                var rangeBubbleContainer = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.RangeBubbleContainer());
                if (rangeBubbleContainer) {
                    var rangeBubbleContainerLeft = rangeBubbleContainer.style.left;
                    var currentRangeLeftPropertyValue = parseInt(rangeBubbleContainerLeft.replace('px', ''));

                    var indicator = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.IndicatorIcon());
                    var indicatorLeftProperty = indicator.style.left;

                    var btncontainer = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckinCheckoutContainer());
                    var currentLeftPropertyValue = parseInt(indicatorLeftProperty.replace('px', ''));


                    //Ensuring that the calendar is always static(To override default mobiscroll logic)
                    if (currentRangeLeftPropertyValue > btncontainer.offsetWidth / 2) {
                        rangeBubbleContainer.style.left = (currentRangeLeftPropertyValue - (btncontainer.offsetWidth / 2)) + "px";
                    }

                    //When checkin button is clicked
                    if (IsCheckin) {
                        //Move indicator to checkin if necessary
                        if (currentLeftPropertyValue > rangeBubbleContainer.offsetWidth / 2) {
                            indicator.style.left = (currentLeftPropertyValue - (btncontainer.offsetWidth / 2)) + "px";
                        }

                    } else {

                        //Move indicator to checkout if necessary
                        if (currentLeftPropertyValue < rangeBubbleContainer.offsetWidth / 2) {
                            indicator.style.left = (currentLeftPropertyValue + (btncontainer.offsetWidth / 2)) + "px";
                        }

                    }
                    //If element is visiable then add class to allow animation on slide
                    if (MystaysBookingWidget.Helper.IsVisiable(rangeBubbleContainer)) {
                        indicator.classList.add('mystays-bookingwidget-animate-slide');
                    }

                }
            },
            UpdateSetButton: function (startdate, enddate) {
                if (MystaysBookingWidget.Helper.IsMobile()) {
                    
                    var dateDifference = MystaysBookingWidget.Helper.GetDays(startdate, enddate);
                    if (dateDifference > 1) {
                        document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.SetButtonContainer()).innerHTML = MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.NightsOfStayMobile).replace('{days}', dateDifference);
                    } else {
                        document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.SetButtonContainer()).innerHTML = MystaysBookingWidget.Helper.GetCustomText(MystaysBookingWidget.BookingCalendar.Constants.NightsOfStayOneNightMobile);
                    }

                }
            },
            //Method to disable previous dates after start date is selected
            DisablePreviousDates: function DisablePreviousDates(dateToCheck) {
                MystaysBookingWidget.BookingCalendar.CustomHTML.EnableAllDates();
                var dateItemList = document.querySelectorAll(MystaysBookingWidget.BookingCalendar.Constants.MystaysSelectedDate());
                dateItemList.forEach(function (element, index) {
                    if (new Date(element.getAttribute('data-full').ChangeDateFormat()) < new Date(dateToCheck)) {
                        element.classList.add('mystays-bookingengine-disabled');
                        element.classList.add('mbsc-disabled');
                        element.classList.add('mbsc-sc-itm-inv');

                    }

                });
            },
            //Method to reenable all the dates again
            EnableAllDates: function EnableAllDates() {
                var dateItemList = document.querySelectorAll(MystaysBookingWidget.BookingCalendar.Constants.DateDisabled());


                dateItemList.forEach(function (element, index) {
                    element.classList.remove('mystays-bookingengine-disabled');
                    element.classList.remove('mbsc-disabled');
                    element.classList.remove('mbsc-sc-itm-inv');

                });
            },
            //Method to set the date to the mystays check in and check out buttons
            SetDateValues: function SetDateValues(mobiScrollInstance) {

                startval = mobiScrollInstance.startVal;
                endval = mobiScrollInstance.endVal;

                document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckinContainer()).setAttribute('data-value', startval);
                document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckoutContainer()).setAttribute('data-value', endval);

                if (startval !== "" && startval) {
                    var startMonth = startval.split('|')[0];
                    var startDate = startval.split('|')[1];
                    var startDay = startval.split('|')[2];

                    var checkinTitle = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckinButtonTitle());
                    checkinTitle.innerHTML = startMonth;

                    var checkinDesc = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckinButtonDesc());
                    checkinDesc.innerHTML = startDate + " " + startDay;
                }

                if (endval !== "" && endval) {
                    var endMonth = endval.split('|')[0];
                    var endDate = endval.split('|')[1];
                    var endDay = endval.split('|')[2];

                    var checkoutTitle = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckoutButtonTitle());
                    checkoutTitle.innerHTML = endMonth;

                    var checkoutDesc = document.querySelector(MystaysBookingWidget.BookingCalendar.Constants.CheckoutButtonDesc());
                    checkoutDesc.innerHTML = endDate + " " + endDay;
                }
            },
            //Method to render the text on the footer
            SetFooterText: function SetFooterText(startval, endval, RenderedElement, IsEndDateADate) {
                if (!MystaysBookingWidget.Helper.IsMobile()) {

                    var calendarContainer = '';

                    if (RenderedElement) {
                        var documentElement = RenderedElement;
                    } else {
                        //Only append MystaysBookingWidget.Common.BookingWidgetContainer if the documentElelment is the document object and not mobiscroll object
                        calendarContainer = MystaysBookingWidget.Common.BookingWidgetContainer;
                        var documentElement = document;
                    }

                    //Removing the footer if it is already present
                    var customcalendarfooter = documentElement.querySelector(calendarContainer + MystaysBookingWidget.BookingCalendar.Constants.CalendarFooter());
                    if (customcalendarfooter) {
                        customcalendarfooter.parentNode.removeChild(customcalendarfooter);
                    }


                    var calendarbody = documentElement.querySelector(calendarContainer + MystaysBookingWidget.BookingCalendar.Constants.CalendarBody());

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

                        //TODO add other languages
                        if (MystaysBookingWidget.Common.SelectedLanguage === 'en') {
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

                var dateListWithInterMediate = document.querySelectorAll(MystaysBookingWidget.BookingCalendar.Constants.HoverIntermediate());

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
                    if ((MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually || MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus === 'end') && new Date(dateList[i].getAttribute('data-full').ChangeDateFormat()) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full').ChangeDateFormat()) <= new Date(element.getAttribute('data-full').ChangeDateFormat())) {
                        dateList[i].classList.add('mystays-hover-intermediate');

                    }
                }

                //Changing footer only when element date is greater than the start date
                if ((MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually || MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus === 'end') && new Date(rangeObject.startVal.split('|')[4]) < new Date(element.getAttribute('data-full').ChangeDateFormat())) {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(rangeObject.startVal, element.getAttribute('data-full').ChangeDateFormat(), null, true);
                }
                //Else setting it to start and end date
                else {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(rangeObject.startVal, rangeObject.endVal, null, false);
                }
            },
            //Alter section heights
            AdjustSectionHeights: function AdjustSectionHeights() {
                if (MystaysBookingWidget.Helper.IsMobile()) {
                    document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer + ' .mbsc-fr-c .mbsc-cal-body').style.height = (window.innerHeight - (document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer + ' .mbsc-range-btn-t').offsetHeight + document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer + ' .mystays-bookingwidget-calendarheader').offsetHeight)) + 'px';
                }
            },
            //Method to create custom selectors for start and end date
            SetCustomSelector: function SetCustomSelector(calendarElement, startval, endval) {
                var calendarContainer = '';
                if (calendarElement) {
                    var updateContainer = calendarElement;
                } else {
                    calendarContainer = MystaysBookingWidget.Common.BookingWidgetContainer;
                    var updateContainer = document;
                }

                //Write logic only when selector is present
                if (updateContainer.querySelector(calendarContainer + MystaysBookingWidget.BookingCalendar.Constants.DefaultCalendarSelector())) {
                    //Removing existing elemtn
                    if (updateContainer.querySelectorAll(calendarContainer + MystaysBookingWidget.BookingCalendar.Constants.DefaultCalendarSelector()).length > 0) {
                        var customSelector = updateContainer.getElementsByClassName(MystaysBookingWidget.BookingCalendar.Constants.CustomCalendarSelector());

                        while (customSelector[0]) {
                            customSelector[0].parentNode.removeChild(customSelector[0]);
                        }
                    }


                    //Start date
                    var startdate = startval.split('|')[0];
                    var startday = startval.split('|')[5];
                    var startmonth = startval.split('|')[1];

                    var checkinDateElement = document.createElement('div');
                    checkinDateElement.className = MystaysBookingWidget.BookingCalendar.Constants.CustomCalendarSelector();
                    checkinDateElement.innerHTML = '<div class="mystays-range-btn-heading">Checkin</div><div class="mystays-range-btn-date"><div class="mystays-bookingwidget-selector-date"><span>{date}</span></div><p><span>{day}</span><span>{month}</span></p></div>'.replace('{date}', startdate).replace('{day}', startday).replace('{month}', startmonth);
                    updateContainer.querySelector(calendarContainer + '.mbsc-range-btn-start .mbsc-range-btn').appendChild(checkinDateElement);


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
                    updateContainer.querySelector(calendarContainer + ' .mbsc-range-btn-end .mbsc-range-btn').appendChild(checkoutDateElement);
                }
            },
            //Added a custom header section to the calendar 
            SetCustomerCalendarHeader: function SetCustomerCalendarHeader(calendarElement) {

                var calendarContainer = '';
                if (calendarElement) {
                    var updateContainer = calendarElement;
                } else {
                    calendarContainer = MystaysBookingWidget.Common.BookingWidgetContainer;
                    var updateContainer = document;
                }

                var calendarheadersection = updateContainer.querySelector('.mbsc-fr-focus');

                //Write logic only when calendar selector is present
                if (calendarheadersection && MystaysBookingWidget.Helper.IsMobile()) {

                    updateContainer.querySelector(calendarContainer + ' .mbsc-fr-persp').style.height = window.innerHeight + 'px';

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

                    var backbutton = updateContainer.querySelector(calendarContainer + ' #mystays-bookingwidget-clr-btn');

                    backbutton.addEventListener('click', function () {
                        MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.AddHideEvent();
                    });
                }
            },
            //Method to set custom header for each month(On mobile when the user scrolls)
            SetCustomMonthHeader: function SetCustomMonthHeader(calendarElement) {

                if (MystaysBookingWidget.Helper.IsMobile()) {
                    var calendarContainer = '';
                    if (calendarElement) {
                        var updateContainer = calendarElement;
                    } else {
                        calendarContainer = MystaysBookingWidget.Common.BookingWidgetContainer;
                        var updateContainer = document;
                    }

                    //Removing the header before adding again
                    if (updateContainer.querySelectorAll(calendarContainer + ' .mystays-bookingwidget-header-month').length > 0) {
                        var customSelector = updateContainer.getElementsByClassName('mystays-bookingwidget-header-month');

                        while (customSelector[0]) {
                            customSelector[0].parentNode.removeChild(customSelector[0]);
                        }
                    }

                    //Looping through each month and adding the custom header
                    for (var i = 0; i < updateContainer.querySelectorAll(calendarContainer + ' .mbsc-cal-day-picker .mbsc-cal-table').length; i++) {
                        //Get the date for the section
                        var sectionContainer = updateContainer.querySelectorAll(calendarContainer + ' .mbsc-cal-day-picker .mbsc-cal-table')[i];
                        var sectionStartDate = sectionContainer.querySelector('[data-full]').getAttribute('data-full').ChangeDateFormat();
                        
                        var sectionStartMonth = new Date(sectionStartDate).getMonth();
                        var sectionStartYear = new Date(sectionStartDate).getFullYear();
                        var headerText = '';
                        //TO add other languages
                        if (MystaysBookingWidget.Common.SelectedLanguage === 'en') {
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
                if (!MystaysBookingWidget.Helper.IsMobile()) {
                    document.addEventListener('click', function (e) {
                        var container = document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer)

                        if ((!(container === e.target) && !MystaysBookingWidget.Helper.IsDescendant(container, e.target))) {

                            if (MystaysRangeObject) {
                                MystaysRangeObject.hide();
                            }
                        }
                    })
                }
            },
            CalendarCustomFunctions: function CalendarCustomFunctions(inst) {
                document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer + MystaysBookingWidget.BookingCalendar.Constants.CalendarBody()).addEventListener('mouseout', function () {
                    MystaysBookingWidget.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetFooterText(inst.startVal, inst.endVal, null, false);
                });
            },
            //Hiding the calendar on back button press
            AddHideEvent: function () {
                MystaysRangeObject.hide();
            },
            //Method to add a hover event to each date which will add an intermediate class('mystays-hover-intermediate') in the 'MystaysBookingWidget.BookingCalendar.CustomHTML.CheckHover' method
            AddIntermediateHoverLogic: function (inst) {

                if (!MystaysBookingWidget.Helper.IsMobile()) {
                var dateList = document.querySelectorAll(MystaysBookingWidget.Common.BookingWidgetContainer + ' .mbsc-cal-slide .mbsc-cal-day:not(.mystays-selected-date):not(.mbsc-disabled):not([aria-hidden="true"])');
                    for (var i = 0; i < dateList.length; i++) {
                        dateList[i].classList.add('mystays-selected-date');
                        
                            dateList[i].addEventListener('mouseover', function (e, args) {
                                MystaysBookingWidget.BookingCalendar.CustomHTML.CheckHover(this, document.querySelectorAll(MystaysBookingWidget.BookingCalendar.Constants.MystaysSelectedDate()), inst);
                            });
                        }
                    }
                
            }
        },
        //method to override mobiscrolls default functionality to set the checkout date to the next day when user selects a checkin day
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
        ///Click Event Handler for the Check in section(The section on the booking widget)
        CheckInButtonHandler: function CheckInButtonHandler(element, args) {
            MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus = 'start';
            MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually = false;
            MystaysBookingWidget.BookingCalendar.CustomHTML.RepositionSelectorIndicator(true);

            //Enabling all dates when user selects checkin date
            MystaysBookingWidget.BookingCalendar.CustomHTML.EnableAllDates();
            //Removing all intermediate hover classes
            MystaysBookingWidget.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
        },
        ///Click Event Handler for the Check out section(The section on the booking widget)
        CheckOutButtonHandler: function CheckOutButtonHandler(element, args) {
            MystaysBookingWidget.BookingCalendar.Constants.CurrentStatus = 'end';
            MystaysBookingWidget.BookingCalendar.CustomHTML.RepositionSelectorIndicator(false);

            //Disabling all dates previous to check in date when user selects checkout date
            MystaysBookingWidget.BookingCalendar.CustomHTML.DisablePreviousDates(MystaysRangeObject.startVal.split('|')[4]);

        },
        CheckInOutButtonHandlers: function () {
            var checkinbtn = document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkin');
            var checkoutbtn = document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkout');

            checkinbtn.addEventListener("click", function () {
                MystaysBookingWidget.BookingCalendar.CheckInButtonHandler();
            });
            checkoutbtn.addEventListener("click", function () {
                MystaysBookingWidget.BookingCalendar.CheckOutButtonHandler();
            });

        },
        //Method to load the mobiscrol range object
        LoadRange: function LoadRange() {
            var selectedLanguage = MystaysBookingWidget.Common.SelectedLanguage;
            if (selectedLanguage === 'tw') {
                selectedLanguage = 'zh';
            }

            var rangeObject = mobiscroll.range(MystaysBookingWidget.Common.BookingWidgetContainer + ' .range-container', {
                theme: 'mobiscroll',
                lang: selectedLanguage,
                display: 'center',
                cssClass: 'mystays-bookingwidget',
                fromText: '',
                toText: '',
                weekDays: 'short',
                context: MystaysBookingWidget.Common.BookingWidgetContainer + ' .calender-render-container',
                dateFormat: 'dd|M|yy|mm/dd/yy|yy/m/d|D',
                controls: ['calendar'],
                startInput: MystaysBookingWidget.Common.BookingWidgetContainer + " #bookingwidget-checkin",
                endInput: MystaysBookingWidget.Common.BookingWidgetContainer + ' #bookingwidget-checkout',
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
                        MystaysBookingWidget.BookingCalendar.CustomHTML.DisablePreviousDates(event.target.getAttribute('data-full').ChangeDateFormat());
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
                    MystaysBookingWidget.BookingCalendar.CalendarShown = true;
                    MystaysBookingWidget.GuestsWidget.DisplayGuestSection();
                    MystaysBookingWidget.Common.ShowOverlayLogic();
                    MystaysBookingWidget.BookingCalendar.CustomHTML.AdjustSectionHeights();
                    MystaysBookingWidget.BookingCalendar.Constants.CheckNextDaySetManually = false;
                    MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.AddIntermediateHoverLogic(inst);
                    MystaysBookingWidget.BookingCalendar.CustomHTMLEvents.CalendarCustomFunctions(inst);
                    MystaysBookingWidget.BookingCalendar.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], inst.endVal.split('|')[4]);

                  
                },
                onClose: function (event, inst) {
                    MystaysBookingWidget.BookingCalendar.CalendarShown = false;
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

                    //if (MystaysBookingWidget.BookingCalendar.CalendarShown) {
                    //    if (event.active === 'start') {
                    //        MystaysBookingWidget.BookingCalendar.CustomHTML.DisablePreviousDates(inst.startVal.split('|')[4]);
                    //    } else {
                    //        MystaysBookingWidget.BookingCalendar.CustomHTML.EnableAllDates();
                    //    }
                    //} else {
                    //    if (event.active === 'start') {
                    //        MystaysBookingWidget.BookingCalendar.CustomHTML.EnableAllDates();
                    //    } else {
                    //        MystaysBookingWidget.BookingCalendar.CustomHTML.DisablePreviousDates(inst.startVal.split('|')[4]);
                    //    }
                    //}
                    var startval = inst.startVal;
                    var endval = inst.endVal;
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetDateValues(inst);
                    MystaysBookingWidget.BookingCalendar.CustomHTML.SetCustomSelector(null, startval, endval);
                }
            });



            return rangeObject;
        },
        //Initial method for booking calendar
        Loaded: function Loaded(selectedLanguage, BookingWidgetContainer) {


            return MystaysBookingWidget.BookingCalendar.LoadRange();
        }

    },
    //Functionalities related to the guests section
    GuestsWidget: {
        Constants: {
            GuestSectionClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
            },
            GuestButtonContainer: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-box.guests .booking-box-wrap';
            },
            GuestButtonClose: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-box.guests .booking-guestselect-close';
            },
            ButtonAdd: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .guest-row .plus';
            },
            ButtonRemove: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .guest-row .minus';
            },
            RoomElement: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect .room';
            },
            AdultElement: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect .adult';
            },
            ChildElement: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-guestselect .child';
            },
            MainGuestsButtonTitle: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .booking-box.guests .input-top-wrap .title';
            },
            MaximumRooms: 9,
            MaximumAdults: 15,
            MaximumChildren: 9,
            ChildAgeList: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .chidren-ages-dropndown';
            },
            ChildAgeInfo: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .child-age-info';
            },
            MaximumChildAge: 12
            //ChildAgeSection='<li><select class="mystays-bookingengine-age"></select></li>'

        },

        CustomHTMLEvents: function CustomHTMLEvents() {
            MystaysBookingWidget.GuestsWidget.GuestButtonContainerClick();
            MystaysBookingWidget.GuestsWidget.GuestButtonCloseClick();
        },

        //Method to show and hide the guest widget
        DisplayGuestSection: function DisplayGuestSection(ShowSection) {
            if (ShowSection) {
                document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestSectionClass()).ShowElement();
                MystaysBookingWidget.Common.ShowOverlayLogic();
            } else {
                document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestSectionClass()).HideElement();
                MystaysBookingWidget.Common.HideOverlayLogic();
            }

        },


        //Hide guest section when user clicks outside the widget
        ClickOutside: function ClickOutside() {

            if (MystaysBookingWidget.Helper.IsMobile()) {
                document.addEventListener('click', function (e) {

                    var container = document.querySelector(MystaysBookingWidget.Common.BookingWidgetContainer);
                    if ((!(container === e.target) && !MystaysBookingWidget.Helper.IsDescendant(container, e.target))) {
                        MystaysBookingWidget.GuestsWidget.DisplayGuestSection(false);

                    }
                })
            }
        },

        //Add new room
        RoomsButtonAdd: function RoomsButtonAdd(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.RoomElement());

            if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.GuestsWidget.Constants.MaximumRooms) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.GuestsWidget.Constants.MaximumRooms) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove()).classList.remove('disabled');
                }


            }



        },

        //Remove room
        RoomsButtonRemove: function RoomsButtonRemove(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.RoomElement());

            if (parseInt(element.children[0].innerHTML) > 1) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == 1) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd()).classList.remove('disabled');
                }
            }
        },

        //Add new adult
        AdultButtonAdd: function ChildButtonAdd(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.AdultElement());


            if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.GuestsWidget.Constants.MaximumAdults) {

                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.GuestsWidget.Constants.MaximumAdults) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove()).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitle = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle());
                MainGuestsButtonTitle.innerHTML = parseInt(MainGuestsButtonTitle.innerHTML) + 1;
                MainGuestsButtonTitle.setAttribute("data-count", (parseInt(MainGuestsButtonTitle.getAttribute("data-count")) + 1));
            }
        },

        //Remove adult
        AdultButtonRemove: function ChildButtonRemove(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.AdultElement());

            if (parseInt(element.children[0].innerHTML) > 1) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == 1) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd()).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitleElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle());
                MainGuestsButtonTitleElement.innerHTML = parseInt(MainGuestsButtonTitleElement.innerHTML) - 1;
                MainGuestsButtonTitleElement.setAttribute("data-count", (parseInt(MainGuestsButtonTitleElement.getAttribute("data-count")) - 1));
            }
        },

        //Method to dynamically generate child age selector
        AddChildAge: function AddChildAge() {
            var ageContainer = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildAgeList());

            var ageListItem = document.createElement('li');
            ageListItem.className = 'mystays-bookingengine-child-age';
            var ageSelectContainer = document.createElement('div');
            var ageSelect = document.createElement('select');
            var ageSelectInfo = document.createElement('i');

            for (var i = 1; i <= MystaysBookingWidget.GuestsWidget.Constants.MaximumChildAge; i++) {
                var ageOption = document.createElement('option');
                ageOption.setAttribute('value', i);
                ageOption.innerHTML = i;
                ageSelect.appendChild(ageOption);
            }

            ageSelectContainer.appendChild(ageSelect);
            ageSelectContainer.appendChild(ageSelectInfo);

            ageListItem.appendChild(ageSelectContainer);
            ageContainer.appendChild(ageListItem);

            //Show age info box
            document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildAgeInfo()).ShowElement();
        },

        //Method to remove child when child count is reduced
        RemoveChildAge: function RemoveChildAge() {
            var ageContainer = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildAgeList());
            ageContainer.removeChild(ageContainer.lastChild);

            //Hide age info box
            if (ageContainer.children.length === 0) {
                document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildAgeInfo()).HideElement();
            }
        },

        //Add child
        ChildButtonAdd: function ChildButtonAdd(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildElement());

            if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.GuestsWidget.Constants.MaximumChildren) {

                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.GuestsWidget.Constants.MaximumChildren) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove()).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitleElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle());
                MainGuestsButtonTitleElement.innerHTML = parseInt(MainGuestsButtonTitleElement.innerHTML) + 1;
                MainGuestsButtonTitleElement.setAttribute("data-count", (parseInt(MainGuestsButtonTitleElement.getAttribute("data-count")) + 1));

                MystaysBookingWidget.GuestsWidget.AddChildAge();
            }
        },

        //Remove child
        ChildButtonRemove: function ChildButtonRemove(event) {
            var element = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildElement());

            if (parseInt(element.children[0].innerHTML) > 0) {
                element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                //Adding disabled class to not allow more button click
                if (parseInt(element.children[0].innerHTML) == 0) {
                    event.target.classList.add('disabled');
                } else {
                    event.target.classList.remove('disabled');
                    event.target.parentNode.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd()).classList.remove('disabled');
                }

                //Updating main guests section
                var MainGuestsButtonTitleElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.MainGuestsButtonTitle());
                MainGuestsButtonTitleElement.innerHTML = parseInt(MainGuestsButtonTitleElement.innerHTML) - 1;
                MainGuestsButtonTitleElement.setAttribute("data-count", (parseInt(MainGuestsButtonTitleElement.getAttribute("data-count")) - 1));

                MystaysBookingWidget.GuestsWidget.RemoveChildAge();
            }
        },


        //Method to bind all the add and remove buttons
        ButtonClick: function ButtonClick() {
            var addbuttons = document.querySelectorAll(MystaysBookingWidget.GuestsWidget.Constants.ButtonAdd());
            var removebuttons = document.querySelectorAll(MystaysBookingWidget.GuestsWidget.Constants.ButtonRemove());

            var roomsElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.RoomElement());
            var AdultElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.AdultElement());
            var ChildElement = document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.ChildElement());

            for (var i = 0; i < addbuttons.length; i++) {

                if (addbuttons[i].parentElement.contains(roomsElement)) {
                    addbuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.RoomsButtonAdd);
                } else if (addbuttons[i].parentElement.contains(AdultElement)) {
                    addbuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.AdultButtonAdd);
                } else if (addbuttons[i].parentElement.contains(ChildElement)) {
                    addbuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.ChildButtonAdd);
                }
            }

            for (var i = 0; i < removebuttons.length; i++) {
                if (removebuttons[i].parentElement.contains(roomsElement)) {
                    removebuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.RoomsButtonRemove);
                } else if (removebuttons[i].parentElement.contains(AdultElement)) {
                    removebuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.AdultButtonRemove);
                } else if (removebuttons[i].parentElement.contains(ChildElement)) {
                    removebuttons[i].addEventListener('click', MystaysBookingWidget.GuestsWidget.ChildButtonRemove);
                }
            }
        },



        //Method invoked when user clicks on the guest button
        GuestButtonContainerClick: function GuestButtonContainerClick() {
            document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestButtonContainer()).addEventListener('click', function () {
                //Hide calendar
                if (MystaysRangeObject) {
                    MystaysRangeObject.hide();
                }
                MystaysBookingWidget.GuestsWidget.DisplayGuestSection(true);
            })
        },

        //Close or back button to close the guest widget
        GuestButtonCloseClick: function () {
            document.querySelector(MystaysBookingWidget.GuestsWidget.Constants.GuestButtonClose()).addEventListener('click', function () {

                MystaysBookingWidget.GuestsWidget.DisplayGuestSection();
            })
        },
        //Method called on document ready to invoke guest wigdget functionality
        Loaded: function Loaded() {
            MystaysBookingWidget.GuestsWidget.CustomHTMLEvents();
            MystaysBookingWidget.GuestsWidget.ClickOutside();
            MystaysBookingWidget.GuestsWidget.ButtonClick();
        }
    },
    //Hotel Search
    HotelSearch: {
        Constants: {
            FilterCities: false,
            SearchInputClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .hotel-search-input';
            },
            SearchInputClass: function () {
                return MystaysBookingWidget.Common.BookingWidgetContainer + ' .hotel-search-input';
            }
        },
        CustomHTMLEvents: {
            HotelSearchFocus: function HotelSearchFocus() {

            }
        },
        GetSearchList: function GetSearchList() {
            var searchList = [];
            searchList.push({
                HotelName: 'Art Hotel Asahikawa',
                HotelSearchNames: 'art hotel asahikawa|アートホテル旭川|art 旭川酒店',
                HotelLink: 'https://www.mystays.com/en-us/hotel-art-hotel-asahikawa-hokkaido/',
                UseTravelClick: true,
                TrvelClickBookingID: 12345,
                RWIthCode: 555,
                City: 'Tokyo'
            });


            searchList.push({
                HotelName: 'Beppu Kamenoi Hotel',
                HotelSearchNames: 'beppu kamenoi hotel|別府亀の井ホテル|别府龟之井温泉酒店|別府龜之井温泉酒店',
                HotelLink: 'https://www.mystays.com/en-us/hotel-beppu-kamenoi-hotel-oita/',
                UseTravelClick: false,
                TrvelClickBookingID: 98765,
                RWIthCode: 666,
                City: 'Osaka'
            });

            return searchList;
        },

        //Method to initialize autocomplete
        InitializeAutocomplete: function () {
            
        },
        Loaded: function () {

            MystaysBookingWidget.HotelSearch.InitializeAutocomplete();

        }
    },

    //Main initialization function
    Loaded: function Loaded(selectedLanguage, BookingWidgetContainer) {
        MystaysBookingWidget.Common.SelectedLanguage = selectedLanguage;

        //Adding additional space(' ') just for safety
        MystaysBookingWidget.Common.BookingWidgetContainer = BookingWidgetContainer + ' ';

        MystaysBookingWidget.Helper.Loaded();
        MystaysRangeObject = MystaysBookingWidget.BookingCalendar.Loaded();
        MystaysBookingWidget.GuestsWidget.Loaded();
        MystaysBookingWidget.HotelSearch.Loaded();
    }
};



document.addEventListener("DOMContentLoaded", function () {
    MystaysBookingWidget.Loaded('en', '#booking-widget-container');
});
