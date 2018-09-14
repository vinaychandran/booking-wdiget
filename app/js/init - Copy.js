﻿//This javascript file contains methods used by the booking widget



class MystaysBookingWidget {

    constructor() {

        //The language used 
        this._SelectedLanguage = '';
        this._BookingWidgetContainer = '';

        SelectedLanguage: function() {
            return this._SelectedLanguage;
        };

        BookingWidgetContainer: function() {
            return this._BookingWidgetContainer;
        };
        


            MystaysBookingWidget.prototype.Common = {

                BookingWidgetContainerElement: function BookingWidgetContainerElement() {
                    if (BookingWidgetContainer === '') {
                        return document;
                    }
                    return document.getElementById(MystaysBookingWidget.prototype.Common.BookingWidgetContainer.replace('#', '').replace(' ', ''));
                },

                //Method to add custom logic when the calendar is shown
                ShowOverlayLogic: function ShowOverlayLogic() {
                    if (!MystaysBookingWidget.prototype.Helper.IsMobile()) {
                        document.getElementById('booking-widget-overlay').ShowElement();
                        document.getElementById('booking-widget-module').classList.add('mystays-bookingwidget-visible');
                    }
                },
                //Method to add custom logic when the calendar is hidden
                HideOverlayLogic: function HideOverlayLogic() {
                    if (!MystaysBookingWidget.prototype.Helper.IsMobile()) {
                        document.getElementById('booking-widget-overlay').HideElement();
                        document.getElementById('booking-widget-module').classList.remove('mystays-bookingwidget-visible');
                    }
                },
                //Function to make an ajax call
                AjaxCall: function AjaxCall(url, data, method, synchronous, successCallBack, failureCallBack) {
                    if (window.XMLHttpRequest) {
                        // code for modern browsers
                        var xmlhttpReq = new XMLHttpRequest();
                    } else {
                        // code for old IE browsers
                        var xmlhttpReq = new ActiveXObject("Microsoft.XMLHTTP");
                    }


                    //xmlhttpReq.addEventListener("load", successCallBack);
                    xmlhttpReq.addEventListener("error", failureCallBack);

                    xmlhttpReq.onreadystatechange = function () {
                        if (xmlhttpReq.readyState == XMLHttpRequest.DONE) {
                            //alert(xhr.responseText);
                            successCallBack(xmlhttpReq.responseText)
                        }
                    }
                    xmlhttpReq.open(method, url, !synchronous);

                    if (data) {
                        xmlhttpReq.send(data);
                    } else {
                        xmlhttpReq.send();
                    }

                }
            },
            //All generic helper methods
            MystaysBookingWidget.prototype.Helper = {

                Loaded: function Loaded() {
                    MystaysBookingWidget.prototype.Helper.LoadExtensions();
                    MystaysBookingWidget.prototype.Helper.ShowOverlayConatiner();
                    MystaysBookingWidget.prototype.Helper.ClickOutside();
                    
                },

                //Function to show overlay conatiner when selecting each of the booking boxes
                ShowOverlayConatiner: function ShowOverlayConatiner() {
                    var bookingBoxes = document.querySelectorAll(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box');

                    for (var i = 0; i < bookingBoxes.length; i++) {
                        bookingBoxes[i].addEventListener('click', function () {
                            MystaysBookingWidget.prototype.Common.ShowOverlayLogic();
                        })
                    }


                },
                //Function to close the calendar when the user clicks outside
                ClickOutside: function ClickOutside() {
                    if (!MystaysBookingWidget.prototype.Helper.IsMobile()) {
                        document.addEventListener('click', function (e) {
                            var container = document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer);
                            //var bookingBoxes = document.querySelectorAll(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box');
                            var promocontainer = document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box.promocode');
                            var booknowbuttoncontainer = document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box.search-button');

                            //Check if user selected promobox or button click
                            var IsPromoCodeBookNowContainer = ((((promocontainer === e.target) || MystaysBookingWidget.prototype.Helper.IsDescendant(promocontainer, e.target))) || (((booknowbuttoncontainer === e.target) || MystaysBookingWidget.prototype.Helper.IsDescendant(booknowbuttoncontainer, e.target))));
                            if ((!(container === e.target) && !MystaysBookingWidget.prototype.Helper.IsDescendant(container, e.target)) || IsPromoCodeBookNowContainer) {
                                if (MystaysBookingWidget.prototype.MystaysRangeObject) {
                                    MystaysBookingWidget.prototype.MystaysRangeObject.hide();
                                }
                                MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(false);
                                MystaysBookingWidget.prototype.HotelSearch.ShowHotelList(false);
                                if (!IsPromoCodeBookNowContainer) {
                                    MystaysBookingWidget.prototype.Common.HideOverlayLogic();
                                }
                            }
                        })
                    }
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
                    if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'ja') {
                        return typeOfConstant[0];
                    }
                    else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'en') {
                        return typeOfConstant[1];

                    } else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'zh') {
                        return typeOfConstant[2];

                    } else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'tw') {
                        return typeOfConstant[3];
                    }
                    else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'ko') {
                        return typeOfConstant[4];
                    }
                },
                //Method to check if a node has a class
                HasClass: function HasClass(elem, cls) {
                    var str = " " + elem.className + " ";
                    var testCls = " " + cls + " ";
                    return (str.indexOf(testCls) != -1);
                },

                //Method to get a next or previous sibling by class name
                GetSiblingByClass: function GetSiblingByClass(node, cls, isprevious) {
                    if (isprevious) {
                        while (node = node.previousSibling) {
                            if (MystaysBookingWidget.prototype.Helper.HasClass(node, cls)) {
                                return node;
                            }
                        }
                    } else {
                        while (node = node.nextSibling) {
                            if (MystaysBookingWidget.prototype.Helper.HasClass(node, cls)) {
                                return node;
                            }
                        }
                    }

                    return null;
                }

            },
            //All functionalities related to the booking widget calendar
            MystaysBookingWidget.prototype.BookingCalendar = {

                Constants: {
                    //Variable used to store the current active button
                    CurrentStatus: '',
                    CalendarShown: false,
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
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mbsc-fr-bubble-bottom';
                    },
                    IndicatorIcon: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mbsc-fr-arr';
                    },
                    CheckinCheckoutContainer: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-checkin-checkout';
                    },
                    SetButtonContainer: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mbsc-fr-btn-w .mbsc-fr-btn';
                    },
                    MystaysSelectedDate: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mystays-selected-date';
                    },
                    HoverIntermediate: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mystays-hover-intermediate';
                    },
                    DateDisabled: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mystays-bookingengine-disabled';
                    },
                    CheckinContainer: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .calendar-checkindate';
                    },
                    CheckoutContainer: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .calendar-checkoutdate';
                    },
                    CalendarFooter: function () {
                        return ' .mystays-calendar-footer';
                    },
                    CalendarBody: function () {
                        return ' .mbsc-cal-body';
                    },

                    CheckinButton: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkin';
                    },


                    CheckinButtonTitle: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkin .title';
                    },
                    CheckinButtonDesc: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkin .desc';
                    },

                    CheckoutButton: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkout';
                    },
                    CheckoutButtonTitle: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkout .title';
                    },
                    CheckoutButtonDesc: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkout .desc';
                    },


                    DefaultCalendarSelector: function () {
                        return ' .mbsc-range-btn-start';
                    },
                    CustomCalendarSelector: function () {
                        return 'mystays-range-selector-header';
                    },

                    MobiscrollDate: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },
                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },

                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },
                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },

                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },
                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },

                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },
                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    }


                },
                //Contains methods that alter the HTML of the calendar
                CustomHTML: {
                    //Method to reposition the indicator icon based on user selection of start or end date
                    RepositionSelectorIndicator: function RepositionSelectorIndicator(IsCheckin) {
                        var rangeBubbleContainer = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.RangeBubbleContainer());
                        if (rangeBubbleContainer) {
                            var rangeBubbleContainerLeft = rangeBubbleContainer.style.left;
                            var currentRangeLeftPropertyValue = parseInt(rangeBubbleContainerLeft.replace('px', ''));

                            var indicator = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.IndicatorIcon());
                            var indicatorLeftProperty = indicator.style.left;

                            var btncontainer = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckinCheckoutContainer());
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
                            if (MystaysBookingWidget.prototype.Helper.IsVisiable(rangeBubbleContainer)) {
                                indicator.classList.add('mystays-bookingwidget-animate-slide');
                            }

                        }
                    },
                    UpdateSetButton: function (startdate, enddate) {
                        if (MystaysBookingWidget.prototype.Helper.IsMobile()) {

                            var dateDifference = MystaysBookingWidget.prototype.Helper.GetDays(startdate, enddate);
                            if (dateDifference > 1) {
                                document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.SetButtonContainer()).innerHTML = MystaysBookingWidget.prototype.Helper.GetCustomText(MystaysBookingWidget.prototype.BookingCalendar.Constants.NightsOfStayMobile).replace('{days}', dateDifference);
                            } else {
                                document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.SetButtonContainer()).innerHTML = MystaysBookingWidget.prototype.Helper.GetCustomText(MystaysBookingWidget.prototype.BookingCalendar.Constants.NightsOfStayOneNightMobile);
                            }

                        }
                    },
                    //Method to disable previous dates after start date is selected
                    DisablePreviousDates: function DisablePreviousDates(dateToCheck) {
                        MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.EnableAllDates();
                        var dateItemList = document.querySelectorAll(MystaysBookingWidget.prototype.BookingCalendar.Constants.MystaysSelectedDate());
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
                        var dateItemList = document.querySelectorAll(MystaysBookingWidget.prototype.BookingCalendar.Constants.DateDisabled());


                        dateItemList.forEach(function (element, index) {
                            element.classList.remove('mystays-bookingengine-disabled');
                            element.classList.remove('mbsc-disabled');
                            element.classList.remove('mbsc-sc-itm-inv');

                        });
                    },
                    //Method to set the date to the mystays check in and check out buttons
                    SetDateValues: function SetDateValues(mobiScrollInstance) {

                        var startval = mobiScrollInstance.startVal;
                        var endval = mobiScrollInstance.endVal;

                        document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckinContainer()).setAttribute('data-value', startval);
                        document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckoutContainer()).setAttribute('data-value', endval);

                        if (startval !== "" && startval) {
                            var startMonth = startval.split('|')[0];
                            var startDate = startval.split('|')[1];
                            var startDay = startval.split('|')[2];

                            var checkinTitle = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckinButtonTitle());
                            checkinTitle.innerHTML = startMonth;

                            var checkinDesc = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckinButtonDesc());
                            checkinDesc.innerHTML = startDate + " " + startDay;
                        }

                        if (endval !== "" && endval) {
                            var endMonth = endval.split('|')[0];
                            var endDate = endval.split('|')[1];
                            var endDay = endval.split('|')[2];

                            var checkoutTitle = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckoutButtonTitle());
                            checkoutTitle.innerHTML = endMonth;

                            var checkoutDesc = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckoutButtonDesc());
                            checkoutDesc.innerHTML = endDate + " " + endDay;
                        }
                    },
                    //Method to render the text on the footer
                    SetFooterText: function SetFooterText(startval, endval, RenderedElement, IsEndDateADate) {
                        if (!MystaysBookingWidget.prototype.Helper.IsMobile()) {

                            var calendarContainer = '';

                            if (RenderedElement) {
                                var documentElement = RenderedElement;
                            } else {
                                //Only append MystaysBookingWidget.prototype.Common.BookingWidgetContainer if the documentElelment is the document object and not mobiscroll object
                                calendarContainer = MystaysBookingWidget.prototype.Common.BookingWidgetContainer;
                                var documentElement = document;
                            }

                            //Removing the footer if it is already present
                            var customcalendarfooter = documentElement.querySelector(calendarContainer + MystaysBookingWidget.prototype.BookingCalendar.Constants.CalendarFooter());
                            if (customcalendarfooter) {
                                customcalendarfooter.parentNode.removeChild(customcalendarfooter);
                            }


                            var calendarbody = documentElement.querySelector(calendarContainer + MystaysBookingWidget.prototype.BookingCalendar.Constants.CalendarBody());

                            if (!IsEndDateADate) {
                                var dateDifference = MystaysBookingWidget.prototype.Helper.GetDays(startval.split('|')[4], endval.split('|')[4]);
                            } else {
                                var dateDifference = MystaysBookingWidget.prototype.Helper.GetDays(startval.split('|')[4], endval);
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
                                if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'en') {
                                    htmlString = htmlString.replace('{endday}', MystaysBookingWidget.prototype.BookingCalendar.Constants.EnglishDayNamesShort[endDate.getDay()]);
                                    htmlString = htmlString.replace('{enddate}', ('0' + endDate.getDate()).slice(-2));
                                    htmlString = htmlString.replace('{endmonth}', MystaysBookingWidget.prototype.BookingCalendar.Constants.EnglishMonthNamesShort[endDate.getDay()]);
                                    htmlString = htmlString.replace('{endyear}', endDate.getFullYear());
                                }
                                htmlString = htmlString.replace('{endday}', endval.split('|')[5]);
                                htmlString = htmlString.replace('{enddate}', endval.split('|')[0]);
                                htmlString = htmlString.replace('{endmonth}', endval.split('|')[1]);
                                htmlString = htmlString.replace('{endyear}', endval.split('|')[2]);
                            }
                            if (dateDifference > 1) {
                                htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.prototype.Helper.GetCustomText(MystaysBookingWidget.prototype.BookingCalendar.Constants.NightsOfStayDesktop).replace('{days}', dateDifference));
                            } else {
                                htmlString = htmlString.replace('{NightsOfStay}', MystaysBookingWidget.prototype.Helper.GetCustomText(MystaysBookingWidget.prototype.BookingCalendar.Constants.NightsOfStayOneNightDesktop));
                            }


                            calendarbody.insertAdjacentHTML('afterend', htmlString);
                        }
                    },

                    //Method to remove all the intermediate classes
                    RemoveIntermediateHoverLogic: function RemoveIntermediateHoverLogic() {

                        var dateListWithInterMediate = document.querySelectorAll(MystaysBookingWidget.prototype.BookingCalendar.Constants.HoverIntermediate());

                        //Remove class from existing elements
                        for (var f = 0; f < dateListWithInterMediate.length; f++) {
                            dateListWithInterMediate[f].classList.remove('mystays-hover-intermediate');
                        }

                    },

                    //Method to add a custom class on all dates in between a start and end date
                    CheckHover: function CheckHover(element, dateList, rangeObject) {
                        MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();


                        //Adding class from existing elements(rangeObject.endVal === "")
                        for (var i = 0; i < dateList.length; i++) {
                            if ((MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckNextDaySetManually || MystaysBookingWidget.prototype.BookingCalendar.Constants.CurrentStatus === 'end') && new Date(dateList[i].getAttribute('data-full').ChangeDateFormat()) >= new Date(rangeObject.startVal.split('|')[4]) && new Date(dateList[i].getAttribute('data-full').ChangeDateFormat()) <= new Date(element.getAttribute('data-full').ChangeDateFormat())) {
                                dateList[i].classList.add('mystays-hover-intermediate');

                            }
                        }

                        //Changing footer only when element date is greater than the start date
                        if ((MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckNextDaySetManually || MystaysBookingWidget.prototype.BookingCalendar.Constants.CurrentStatus === 'end') && new Date(rangeObject.startVal.split('|')[4]) < new Date(element.getAttribute('data-full').ChangeDateFormat())) {
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetFooterText(rangeObject.startVal, element.getAttribute('data-full').ChangeDateFormat(), null, true);
                        }
                        //Else setting it to start and end date
                        else {
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetFooterText(rangeObject.startVal, rangeObject.endVal, null, false);
                        }
                    },
                    //Alter section heights
                    AdjustSectionHeights: function AdjustSectionHeights() {
                        if (MystaysBookingWidget.prototype.Helper.IsMobile()) {
                            document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mbsc-fr-c .mbsc-cal-body').style.height = (window.innerHeight - (document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mbsc-range-btn-t').offsetHeight + document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mystays-bookingwidget-calendarheader').offsetHeight)) + 'px';
                        }
                    },
                    //Method to create custom selectors for start and end date
                    SetCustomSelector: function SetCustomSelector(calendarElement, startval, endval) {
                        var calendarContainer = '';
                        if (calendarElement) {
                            var updateContainer = calendarElement;
                        } else {
                            calendarContainer = MystaysBookingWidget.prototype.Common.BookingWidgetContainer;
                            var updateContainer = document;
                        }

                        //Write logic only when selector is present
                        if (updateContainer.querySelector(calendarContainer + MystaysBookingWidget.prototype.BookingCalendar.Constants.DefaultCalendarSelector())) {
                            //Removing existing elemtn
                            if (updateContainer.querySelectorAll(calendarContainer + MystaysBookingWidget.prototype.BookingCalendar.Constants.DefaultCalendarSelector()).length > 0) {
                                var customSelector = updateContainer.getElementsByClassName(MystaysBookingWidget.prototype.BookingCalendar.Constants.CustomCalendarSelector());

                                while (customSelector[0]) {
                                    customSelector[0].parentNode.removeChild(customSelector[0]);
                                }
                            }


                            //Start date
                            var startdate = startval.split('|')[0];
                            var startday = startval.split('|')[5];
                            var startmonth = startval.split('|')[1];

                            var checkinDateElement = document.createElement('div');
                            checkinDateElement.className = MystaysBookingWidget.prototype.BookingCalendar.Constants.CustomCalendarSelector();
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
                            calendarContainer = MystaysBookingWidget.prototype.Common.BookingWidgetContainer;
                            var updateContainer = document;
                        }

                        var calendarheadersection = updateContainer.querySelector('.mbsc-fr-focus');

                        //Write logic only when calendar selector is present
                        if (calendarheadersection && MystaysBookingWidget.prototype.Helper.IsMobile()) {

                            updateContainer.querySelector(calendarContainer + ' .mbsc-fr-persp').style.height = window.innerHeight + 'px';

                            var calendarHeader = document.createElement('div');

                            var clearButton = document.createElement('span');
                            clearButton.className = 'mystays-bookingwidget-clr-btn';
                            clearButton.classList.add('mbsc-ic-arrow-left5');
                            clearButton.classList.add('mbsc-ic');
                            calendarHeader.appendChild(clearButton);


                            var calendarHeaderElement = document.createElement('span');

                            calendarHeader.classList = 'mystays-bookingwidget-calendarheader';

                            calendarHeaderElement.innerHTML = MystaysBookingWidget.prototype.Helper.GetCustomText(MystaysBookingWidget.prototype.BookingCalendar.Constants.CalendarHeader);


                            calendarHeader.appendChild(calendarHeaderElement);

                            calendarheadersection.insertAdjacentHTML('beforebegin', calendarHeader.outerHTML);

                            var backbutton = updateContainer.querySelector(calendarContainer + ' .mystays-bookingwidget-clr-btn');

                            backbutton.addEventListener('click', function () {
                                MystaysBookingWidget.prototype.BookingCalendar.CustomHTMLEvents.AddHideEvent();
                            });
                        }
                    },
                    //Method to set custom header for each month(On mobile when the user scrolls)
                    SetCustomMonthHeader: function SetCustomMonthHeader(calendarElement) {

                        if (MystaysBookingWidget.prototype.Helper.IsMobile()) {
                            var calendarContainer = '';
                            if (calendarElement) {
                                var updateContainer = calendarElement;
                            } else {
                                calendarContainer = MystaysBookingWidget.prototype.Common.BookingWidgetContainer;
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
                                if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'en') {
                                    headerText = MystaysBookingWidget.prototype.BookingCalendar.Constants.EnglishMonthNames[sectionStartMonth] + ' ' + sectionStartYear;
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

                    CalendarCustomFunctions: function CalendarCustomFunctions(inst) {
                        document.querySelector(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + MystaysBookingWidget.prototype.BookingCalendar.Constants.CalendarBody()).addEventListener('mouseout', function () {
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetFooterText(inst.startVal, inst.endVal, null, false);
                        });
                    },
                    //Hiding the calendar on back button press
                    AddHideEvent: function () {
                        MystaysBookingWidget.prototype.MystaysRangeObject.hide();
                    },
                    //Method to add a hover event to each date which will add an intermediate class('mystays-hover-intermediate') in the 'MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.CheckHover' method
                    AddIntermediateHoverLogic: function (inst) {


                        var dateList = document.querySelectorAll(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .mbsc-cal-slide .mbsc-cal-day:not(.mystays-selected-date):not(.mbsc-disabled):not([aria-hidden="true"])');
                        for (var i = 0; i < dateList.length; i++) {
                            dateList[i].classList.add('mystays-selected-date');
                            if (!MystaysBookingWidget.prototype.Helper.IsMobile()) {
                                dateList[i].addEventListener('mouseover', function (e, args) {
                                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.CheckHover(this, document.querySelectorAll(MystaysBookingWidget.prototype.BookingCalendar.Constants.MystaysSelectedDate()), inst);
                                });
                            }
                        }

                    }
                },
                //method to override mobiscrolls default functionality to set the checkout date to the next day when user selects a checkin day
                ValidateStartEndDate: function (event, inst) {

                    var startvalue = inst.startVal;
                    var endvalue = inst.endVal;
                    MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckNextDaySetManually = false;

                    //If start date is equal to end date then set end date as next day
                    if (inst.endVal === "" || (new Date(endvalue.split('|')[4]) <= new Date(startvalue.split('|')[4]))) {
                        MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckNextDaySetManually = true;
                        var startDate = new Date(inst.startVal.split('|')[4]);
                        var nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1, 0, 0);
                        inst.setVal([startDate, nextDay], true, true, false);

                    }
                },
                ///Click Event Handler for the Check in section(The section on the booking widget)
                CheckInButtonHandler: function CheckInButtonHandler(element, args) {
                    MystaysBookingWidget.prototype.BookingCalendar.Constants.CurrentStatus = 'start';
                    MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckNextDaySetManually = false;
                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RepositionSelectorIndicator(true);


                    //Enabling all dates when user selects checkin date
                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.EnableAllDates();
                    //Removing all intermediate hover classes
                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();


                },
                ///Click Event Handler for the Check out section(The section on the booking widget)
                CheckOutButtonHandler: function CheckOutButtonHandler(element, args) {
                    MystaysBookingWidget.prototype.BookingCalendar.Constants.CurrentStatus = 'end';
                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RepositionSelectorIndicator(false);

                    //Disabling all dates previous to check in date when user selects checkout date
                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.DisablePreviousDates(MystaysBookingWidget.prototype.MystaysRangeObject.startVal.split('|')[4]);

                },
                CheckInOutButtonHandlers: function () {
                    var checkinbtn = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckinButton());
                    var checkoutbtn = document.querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckoutButton());

                    checkinbtn.addEventListener("click", function () {
                        MystaysBookingWidget.prototype.BookingCalendar.CheckInButtonHandler();
                    });
                    checkoutbtn.addEventListener("click", function () {
                        MystaysBookingWidget.prototype.BookingCalendar.CheckOutButtonHandler();
                    });

                },
                //Method to load the mobiscrol range object
                LoadRange: function LoadRange() {
                    var selectedLanguage = MystaysBookingWidget.prototype.Common.SelectedLanguage;
                    if (selectedLanguage === 'tw') {
                        selectedLanguage = 'zh';
                    }

                    var rangeObject = mobiscroll.range(MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .range-container', {
                        theme: 'mobiscroll',
                        lang: selectedLanguage,
                        display: 'center',
                        cssClass: 'mystays-bookingwidget',
                        fromText: '',
                        toText: '',
                        weekDays: 'short',
                        context: MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .calender-render-container',
                        dateFormat: 'dd|M|yy|mm/dd/yy|yy/m/d|D',
                        controls: ['calendar'],
                        startInput: MystaysBookingWidget.prototype.Common.BookingWidgetContainer + " .bookingwidget-checkin",
                        endInput: MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .bookingwidget-checkout',
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

                            MystaysBookingWidget.prototype.BookingCalendar.CheckInOutButtonHandlers();
                        },
                        onDayChange: function (event, inst) {
                            if (event.active === 'end') {
                                //Logic to check only if that end date that is lesser than start date cannot be selected
                                if (event.date < new Date(inst.startVal.split('|')[4])) {
                                    inst.setVal([event.date, inst.endVal], true);
                                    return true;
                                }
                                //Automatically hide widget on selection of end date for non mobile devices
                                if (!MystaysBookingWidget.prototype.Helper.IsMobile()) {
                                    inst.hide();
                                    MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(true);
                                    //MystaysBookingWidget.prototype.Common.ShowOverlayLogic();
                                } else {
                                    MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], event.date);
                                }
                            }

                            if (event.active === 'start') {
                                MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.DisablePreviousDates(event.target.getAttribute('data-full').ChangeDateFormat());
                                MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RepositionSelectorIndicator(false);
                            }

                            //if (event.active === 'end') {
                            //    if (MystaysBookingWidget.prototype.Helper.IsMobile()) {
                            //        MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.DisablePreviousDates(inst.startVal.split('|')[4]);
                            //    }
                            //}
                        },
                        onMarkupReady: function (event, inst) {
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetCustomerCalendarHeader(event.target);
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetCustomSelector(event.target, inst.startVal, inst.endVal);

                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetFooterText(inst.startVal, inst.endVal, event.target);
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetCustomMonthHeader(event.target);
                        },
                        onSet: function (event, inst) {
                            MystaysBookingWidget.prototype.BookingCalendar.ValidateStartEndDate(event, inst);


                        },
                        onBeforeShow: function () {
                            MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(false);
                            MystaysBookingWidget.prototype.HotelSearch.ShowHotelList(false);
                            //MystaysBookingWidget.prototype.Common.ShowOverlayLogic();
                        },
                        onShow: function (event, inst) {
                            MystaysBookingWidget.prototype.BookingCalendar.CalendarShown = true;


                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.AdjustSectionHeights();
                            MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckNextDaySetManually = false;
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTMLEvents.AddIntermediateHoverLogic(inst);
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTMLEvents.CalendarCustomFunctions(inst);
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.UpdateSetButton(inst.startVal.split('|')[4], inst.endVal.split('|')[4]);


                        },
                        onClose: function (event, inst) {
                            MystaysBookingWidget.prototype.BookingCalendar.CalendarShown = false;
                            MystaysBookingWidget.prototype.BookingCalendar.ValidateStartEndDate(event, inst);

                            //MystaysBookingWidget.prototype.Common.HideOverlayLogic();
                        },
                        onPageChange: function (event, inst) {
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTMLEvents.AddIntermediateHoverLogic(inst);
                        },
                        onPageLoaded: function (event, inst) {
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetCustomMonthHeader();
                        },
                        onSetDate: function (event, inst) {
                            //A variable to check which date is currently active(start or end)

                            MystaysBookingWidget.prototype.BookingCalendar.Constants.CurrentStatus = event.active;

                            if (event.active === 'start') {
                                MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.RemoveIntermediateHoverLogic();
                            }



                            var startval = inst.startVal;
                            var endval = inst.endVal;
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetDateValues(inst);
                            MystaysBookingWidget.prototype.BookingCalendar.CustomHTML.SetCustomSelector(null, startval, endval);
                        }
                    });



                    return rangeObject;
                },
                //Initial method for booking calendar
                Loaded: function Loaded(selectedLanguage, BookingWidgetContainer) {


                    return MystaysBookingWidget.prototype.BookingCalendar.LoadRange();
                }

            },
            //Functionalities related to the guests section
            MystaysBookingWidget.prototype.GuestsWidget = {
                Constants: {
                    GuestSectionClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-wrap';
                    },
                    GuestButtonContainer: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box.guests .booking-box-wrap';
                    },
                    GuestButtonClose: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box.guests .booking-guestselect-close';
                    },
                    ButtonAdd: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .guest-row .plus';
                    },
                    ButtonRemove: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .guest-row .minus';
                    },
                    RoomElement: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect .room';
                    },
                    AdultElement: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect .adult';
                    },
                    ChildElement: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect .child';
                    },
                    MainGuestsButtonTitle: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-box.guests .input-top-wrap .title';
                    },
                    MaximumRooms: 9,
                    MaximumAdults: 15,
                    MaximumChildren: 9,
                    ChildAgeList: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .chidren-ages-dropndown';
                    },
                    ChildAgeInfo: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .child-age-info';
                    },
                    MaximumChildAge: 12,
                    GuestWidgetBackButton: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-guestselect-heading span';
                    },
                    //ChildAgeSection='<li><select class="mystays-bookingengine-age"></select></li>'
                    ChildAgeContainerClass: 'mystays-bookingengine-child-age'
                },

                CustomHTMLEvents: function CustomHTMLEvents() {
                    MystaysBookingWidget.prototype.GuestsWidget.GuestButtonContainerClick();
                    MystaysBookingWidget.prototype.GuestsWidget.GuestButtonCloseClick();
                },

                //Method to show and hide the guest widget
                ShowGuestSection: function ShowGuestSection(ShowSection) {
                    if (ShowSection === true) {
                        document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.GuestSectionClass()).ShowElement();

                    } else {
                        document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.GuestSectionClass()).HideElement();

                    }

                },




                //Add new room
                RoomsButtonAdd: function RoomsButtonAdd(event) {
                    var element = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.RoomElement());

                    if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumRooms) {
                        element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                        element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                        //Adding disabled class to not allow more button click
                        if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumRooms) {
                            event.target.classList.add('disabled');
                        } else {
                            event.target.classList.remove('disabled');
                            event.target.parentNode.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonRemove()).classList.remove('disabled');
                        }


                    }



                },

                //Remove room
                RoomsButtonRemove: function RoomsButtonRemove(event) {
                    var element = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.RoomElement());

                    if (parseInt(element.children[0].innerHTML) > 1) {
                        element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                        element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                        //Adding disabled class to not allow more button click
                        if (parseInt(element.children[0].innerHTML) == 1) {
                            event.target.classList.add('disabled');
                        } else {
                            event.target.classList.remove('disabled');
                            event.target.parentNode.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonAdd()).classList.remove('disabled');
                        }
                    }
                },

                //Add new adult
                AdultButtonAdd: function ChildButtonAdd(event) {
                    var element = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.AdultElement());


                    if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumAdults) {

                        element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                        element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                        //Adding disabled class to not allow more button click
                        if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumAdults) {
                            event.target.classList.add('disabled');
                        } else {
                            event.target.classList.remove('disabled');
                            event.target.parentNode.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonRemove()).classList.remove('disabled');
                        }

                        //Updating main guests section
                        var MainGuestsButtonTitle = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.MainGuestsButtonTitle());
                        MainGuestsButtonTitle.innerHTML = parseInt(MainGuestsButtonTitle.innerHTML) + 1;
                        MainGuestsButtonTitle.setAttribute("data-count", (parseInt(MainGuestsButtonTitle.getAttribute("data-count")) + 1));
                    }
                },

                //Remove adult
                AdultButtonRemove: function ChildButtonRemove(event) {
                    var element = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.AdultElement());

                    if (parseInt(element.children[0].innerHTML) > 1) {
                        element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                        element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                        //Adding disabled class to not allow more button click
                        if (parseInt(element.children[0].innerHTML) == 1) {
                            event.target.classList.add('disabled');
                        } else {
                            event.target.classList.remove('disabled');
                            event.target.parentNode.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonAdd()).classList.remove('disabled');
                        }

                        //Updating main guests section
                        var MainGuestsButtonTitleElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.MainGuestsButtonTitle());
                        MainGuestsButtonTitleElement.innerHTML = parseInt(MainGuestsButtonTitleElement.innerHTML) - 1;
                        MainGuestsButtonTitleElement.setAttribute("data-count", (parseInt(MainGuestsButtonTitleElement.getAttribute("data-count")) - 1));
                    }
                },

                //Method to dynamically generate child age selector
                AddChildAge: function AddChildAge() {
                    var ageContainer = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeList());

                    var ageListItem = document.createElement('li');
                    ageListItem.className = MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeContainerClass;
                    var ageSelectContainer = document.createElement('div');
                    var ageSelect = document.createElement('select');
                    var ageSelectInfo = document.createElement('i');

                    for (var i = 1; i <= MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumChildAge; i++) {
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
                    document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeInfo()).ShowElement();
                },

                //Method to remove child when child count is reduced
                RemoveChildAge: function RemoveChildAge() {
                    var ageContainer = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeList());
                    ageContainer.removeChild(ageContainer.lastChild);

                    //Hide age info box
                    if (ageContainer.children.length === 0) {
                        document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeInfo()).HideElement();
                    }
                },

                //Add child
                ChildButtonAdd: function ChildButtonAdd(event) {
                    var element = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildElement());

                    if (parseInt(element.children[0].innerHTML) < MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumChildren) {

                        element.children[0].innerHTML = parseInt(element.children[0].innerHTML) + 1;
                        element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) + 1));

                        //Adding disabled class to not allow more button click
                        if (parseInt(element.children[0].innerHTML) == MystaysBookingWidget.prototype.GuestsWidget.Constants.MaximumChildren) {
                            event.target.classList.add('disabled');
                        } else {
                            event.target.classList.remove('disabled');
                            event.target.parentNode.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonRemove()).classList.remove('disabled');
                        }

                        //Updating main guests section
                        var MainGuestsButtonTitleElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.MainGuestsButtonTitle());
                        MainGuestsButtonTitleElement.innerHTML = parseInt(MainGuestsButtonTitleElement.innerHTML) + 1;
                        MainGuestsButtonTitleElement.setAttribute("data-count", (parseInt(MainGuestsButtonTitleElement.getAttribute("data-count")) + 1));

                        MystaysBookingWidget.prototype.GuestsWidget.AddChildAge();
                    }
                },

                //Remove child
                ChildButtonRemove: function ChildButtonRemove(event) {
                    var element = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildElement());

                    if (parseInt(element.children[0].innerHTML) > 0) {
                        element.children[0].innerHTML = parseInt(element.children[0].innerHTML) - 1;
                        element.children[0].setAttribute("data-count", (parseInt(element.children[0].getAttribute("data-count")) - 1));

                        //Adding disabled class to not allow more button click
                        if (parseInt(element.children[0].innerHTML) == 0) {
                            event.target.classList.add('disabled');
                        } else {
                            event.target.classList.remove('disabled');
                            event.target.parentNode.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonAdd()).classList.remove('disabled');
                        }

                        //Updating main guests section
                        var MainGuestsButtonTitleElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.MainGuestsButtonTitle());
                        MainGuestsButtonTitleElement.innerHTML = parseInt(MainGuestsButtonTitleElement.innerHTML) - 1;
                        MainGuestsButtonTitleElement.setAttribute("data-count", (parseInt(MainGuestsButtonTitleElement.getAttribute("data-count")) - 1));

                        MystaysBookingWidget.prototype.GuestsWidget.RemoveChildAge();
                    }
                },


                //Method to bind all the add and remove buttons
                ButtonClick: function ButtonClick() {
                    var addbuttons = document.querySelectorAll(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonAdd());
                    var removebuttons = document.querySelectorAll(MystaysBookingWidget.prototype.GuestsWidget.Constants.ButtonRemove());

                    var roomsElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.RoomElement());
                    var AdultElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.AdultElement());
                    var ChildElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildElement());

                    for (var i = 0; i < addbuttons.length; i++) {

                        if (addbuttons[i].parentElement.contains(roomsElement)) {
                            addbuttons[i].addEventListener('click', MystaysBookingWidget.prototype.GuestsWidget.RoomsButtonAdd);
                        } else if (addbuttons[i].parentElement.contains(AdultElement)) {
                            addbuttons[i].addEventListener('click', MystaysBookingWidget.prototype.GuestsWidget.AdultButtonAdd);
                        } else if (addbuttons[i].parentElement.contains(ChildElement)) {
                            addbuttons[i].addEventListener('click', MystaysBookingWidget.prototype.GuestsWidget.ChildButtonAdd);
                        }
                    }

                    for (var i = 0; i < removebuttons.length; i++) {
                        if (removebuttons[i].parentElement.contains(roomsElement)) {
                            removebuttons[i].addEventListener('click', MystaysBookingWidget.prototype.GuestsWidget.RoomsButtonRemove);
                        } else if (removebuttons[i].parentElement.contains(AdultElement)) {
                            removebuttons[i].addEventListener('click', MystaysBookingWidget.prototype.GuestsWidget.AdultButtonRemove);
                        } else if (removebuttons[i].parentElement.contains(ChildElement)) {
                            removebuttons[i].addEventListener('click', MystaysBookingWidget.prototype.GuestsWidget.ChildButtonRemove);
                        }
                    }

                    var backButton = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.GuestWidgetBackButton());

                    backButton.addEventListener('click', function () {
                        MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(false);
                        //MystaysBookingWidget.prototype.Common.HideOverlayLogic();
                    })
                },



                //Method invoked when user clicks on the guest button
                GuestButtonContainerClick: function GuestButtonContainerClick() {
                    document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.GuestButtonContainer()).addEventListener('click', function () {
                        //Hide calendar
                        if (MystaysBookingWidget.prototype.MystaysRangeObject) {
                            MystaysBookingWidget.prototype.MystaysRangeObject.hide();
                            MystaysBookingWidget.prototype.HotelSearch.ShowHotelList(false);
                        }
                        MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(true);
                        //MystaysBookingWidget.prototype.Common.ShowOverlayLogic();
                    })
                },

                //Close or back button to close the guest widget
                GuestButtonCloseClick: function () {
                    document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.GuestButtonClose()).addEventListener('click', function () {

                        MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(false);
                        MystaysBookingWidget.prototype.Common.HideOverlayLogic();
                    })
                },
                //Method called on document ready to invoke guest wigdget functionality
                Loaded: function Loaded() {
                    MystaysBookingWidget.prototype.GuestsWidget.CustomHTMLEvents();

                    MystaysBookingWidget.prototype.GuestsWidget.ButtonClick();
                }
            },
            //Hotel Search
            MystaysBookingWidget.prototype.HotelSearch = {
                Constants: {
                    FilterCities: false,
                    MasterSearchList: [],
                    SearchInputClass: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .hotel-search-input';
                    },
                    HotelBindList: function () {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .hotel-search-list';
                    },
                    HotelBindListActiveElement: function () {
                        return '.hotel-search-list .active';
                    },
                    //Each hotel or city item generated on autocomplete
                    HotelSelectItem: function () {
                        return 'hotel-sel-item';
                    },

                    HotelSearchError: function () {
                        return 'error';
                    },

                    //Footer section
                    FooterCityList: function () {
                        return 'city-list';
                    },

                    FooterCityItemSelector: function () {
                        return 'span';
                    },

                    FooterHotelList: function () {
                        return 'hotel-list';
                    },

                    FooterHotelItemSelector: function () {
                        return '.hotel-search-item span';
                    },

                    APITargetLanguage: function APITargetLanguage() {
                        if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'en') {
                            return 'en';
                        }
                        else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'en') {
                            return 'en';
                        } else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'ja') {
                            return 'ja-jp';
                        } else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'ko') {
                            return 'ko-kr';
                        } else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'zh') {
                            return 'zh-cn';
                        } else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'tw') {
                            return 'zh-tw';
                        }


                    },

                    //Footer section ends
                    SearchMessageContainer: function SearchMessageContainer() {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-search-msg-wrap';
                    },
                    SearchMessageAnchor: function SearchMessageAnchor() {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + ' .booking-search-msg-wrap a';
                    },
                    SearchMessagePlaceholder: function SearchMessagePlaceholder() {
                        return 'View hotels in {hotelcity}';
                    },
                    CityLabel: 'Cities',
                    HotelLabel: 'Hotels',

                },

                //Removing all hotels from list
                RemoveHotelList: function RemoveHotelList() {
                    //Removing all child items
                    var bindList = document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList());
                    while (bindList.children[0]) {
                        bindList.children[0].remove();
                    }
                },

                //Method to show and hide hotel list
                ShowHotelList: function ShowHotelList(showHotelList) {
                    if (showHotelList === true) {
                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList()).parentElement.ShowElement();
                    } else {
                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList()).parentElement.HideElement();
                    }


                },

                CustomHTMLEvents: {

                    HotelSearchFocus: function HotelSearchFocus() {
                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass()).addEventListener('focus', function (e, args) {
                            //Removing the error class
                            this.classList.remove(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSearchError());

                            MystaysBookingWidget.prototype.HotelSearch.ShowSearchMessage(false);

                            MystaysBookingWidget.prototype.HotelSearch.ShowHotelList(true);

                            //Hiding calendar object if it is shown
                            MystaysBookingWidget.prototype.MystaysRangeObject.hide();

                            //Hiding guests section if it is shown
                            MystaysBookingWidget.prototype.GuestsWidget.ShowGuestSection(false);


                            var filteredHotelsList = MystaysBookingWidget.prototype.HotelSearch.LoadSearchResults(e.target.value);
                            MystaysBookingWidget.prototype.HotelSearch.BindHotelsCityData(filteredHotelsList);

                            //Showing overlay(Dont change position)
                            //MystaysBookingWidget.prototype.Common.ShowOverlayLogic();
                        })


                    },
                    HotelSearchKeyUp: function HotelSearchKeyUp() {
                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass()).addEventListener('keyup', function (e, args) {
                            var filteredHotelsList = MystaysBookingWidget.prototype.HotelSearch.LoadSearchResults(e.target.value);

                            MystaysBookingWidget.prototype.HotelSearch.BindHotelsCityData(filteredHotelsList);
                        })
                    },

                    HotelSearchKeyDown: function HotelSearchKeyDown() {
                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass()).addEventListener('keydown', function (e, args) {
                            if (e.which == 40) {
                                e.preventDefault();
                                MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList() + ' .' + MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem()).classList.add('active');

                                var activeElement = MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().getElementsByClassName('active')[0];
                                e.target.blur();
                                activeElement.focus();
                            }
                        })
                    },

                    //Method to fire when user scrolls down on each hotel
                    HotelItemKeyDown: function HotelItemKeyDown() {

                        for (var i = 0; i < MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelectorAll(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList() + ' .' + MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem()).length; i++) {
                            var listItem = MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelectorAll(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList() + ' .' + MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem())[i];

                            listItem.addEventListener('keydown', function (e, args) {

                                e.preventDefault();
                                e.target.classList.remove('active');

                                //User clicks enter/selects 
                                if (e.which === 13) {
                                    MystaysBookingWidget.prototype.HotelSearch.TriggerHotelCitySelect(e)
                                    return;
                                }

                                //Tab and keydown
                                if (e.which == 9 || e.which == 40) {
                                    e.target.classList.remove('active');
                                    var siblingHotelItem = MystaysBookingWidget.prototype.Helper.GetSiblingByClass(e.target, MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem(), false);

                                }

                                //Key up
                                if (e.which == 38) {
                                    var siblingHotelItem = MystaysBookingWidget.prototype.Helper.GetSiblingByClass(e.target, MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem(), true);

                                }

                                if (siblingHotelItem && siblingHotelItem.tagName === 'LI') {
                                    siblingHotelItem.classList.add('active');
                                    e.target.blur();
                                    siblingHotelItem.focus();
                                } else {
                                    MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass()).focus();
                                }
                            })
                        }

                    },

                    //When user selects a hotel item
                    HotelItemClick: function HotelItemClick() {

                        for (var i = 0; i < MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelectorAll(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList() + ' .' + MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem()).length; i++) {
                            var listItem = MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelectorAll(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList() + ' .' + MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem())[i];

                            listItem.addEventListener('click', function (e, args) {

                                e.preventDefault();
                                e.target.classList.remove('active');

                                MystaysBookingWidget.prototype.HotelSearch.TriggerHotelCitySelect(e);
                            })
                        }


                    }


                },

                //Method used to show or hide search message and also populate link and text
                ShowSearchMessage: function ShowSearchMessage(showsearchMessage, hotelCity) {
                    if (!showsearchMessage) {
                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchMessageContainer()).HideElement();
                    } else {
                        var msgPlaceholder = MystaysBookingWidget.prototype.HotelSearch.Constants.SearchMessagePlaceholder();
                        var showAnchorTag = document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchMessageAnchor());
                        msgPlaceholder = msgPlaceholder.replace('{hotelcity}', hotelCity.Name);
                        showAnchorTag.href = hotelCity.Link;
                        showAnchorTag.innerHTML = msgPlaceholder;

                        document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchMessageContainer()).ShowElement();
                    }
                },

                ////Selection Start
                //Method fired when used selects a hotel or city
                TriggerHotelCitySelect: function TriggerHotelCitySelect(e) {
                    MystaysBookingWidget.prototype.HotelSearch.GetSelectedHotelCity(e.target);
                    //Trigger calendar checkin button click
                    MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().querySelector(MystaysBookingWidget.prototype.BookingCalendar.Constants.CheckinButton()).click();
                    e.stopPropagation();
                    return;
                },



                //Method to create hotel/city object from LI item
                GetSelectedHotelCity: function GetSelectedHotelCity(listItem) {

                    //For data list
                    var selectedHotel = {};
                    selectedHotel.Type = listItem.getAttribute('data-Type');
                    selectedHotel.TargetCities = listItem.getAttribute('data-TargetCities');
                    selectedHotel.Name = listItem.getAttribute('data-Name');
                    selectedHotel.HotelSearchNames = listItem.getAttribute('data-HotelSearchNames');
                    selectedHotel.Link = listItem.getAttribute('data-Link');
                    selectedHotel.UseTravelClick = listItem.getAttribute('data-UseTravelClick');;
                    selectedHotel.TravelClickBookingID = listItem.getAttribute('data-TravelClickBookingID');
                    selectedHotel.RWIthCode = listItem.getAttribute('data-RWIthCode');
                    selectedHotel.HotelCity = listItem.getAttribute('data-HotelCity');
                    selectedHotel.ItemID = listItem.getAttribute('data-ItemID');

                    selectedHotel.IsBookable = listItem.getAttribute('data-IsBookable');
                    selectedHotel.HasMeetingRoom = listItem.getAttribute('data-HasMeetingRoom');
                    selectedHotel.StartDateForBooking = listItem.getAttribute('data-StartDateForBooking');
                    selectedHotel.GroupNames = listItem.getAttribute('data-GroupNames');
                    selectedHotel.FastBookingAreaName = listItem.getAttribute('data-FastBookingAreaName');


                    MystaysBookingWidget.prototype.HotelSearch.UpdateSerachField(selectedHotel);

                },


                //Used to bind hotel data to input element
                UpdateSerachField: function UpdateSerachField(selectedHotelCity) {
                    var inputElement = document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass());
                    //inputElement.setAttribute('data-Type', selectedHotelCity.Type);
                    //inputElement.setAttribute('data-TargetCities', selectedHotelCity.Target);
                    //inputElement.setAttribute('data-Name', selectedHotelCity.Name);
                    //inputElement.setAttribute('data-Link', selectedHotelCity.Link);
                    //inputElement.setAttribute('data-HotelSearchNames', selectedHotelCity.HotelSearchNames);
                    //inputElement.setAttribute('data-UseTravelClick', selectedHotelCity.UseTravelClick);
                    //inputElement.setAttribute('data-TravelClickBookingID', selectedHotelCity.TravelClickBookingID);
                    //inputElement.setAttribute('data-RWIthCode', selectedHotelCity.RWIthCode);
                    //inputElement.setAttribute('data-HotelCity', selectedHotelCity.HotelCity);

                    //inputElement.setAttribute('data-IsBookable', selectedHotelCity.IsBookable);
                    //inputElement.setAttribute('data-HasMeetingRoom', selectedHotelCity.HasMeetingRoom);
                    //inputElement.setAttribute('data-StartDateForBooking', selectedHotelCity.StartDateForBooking);
                    //inputElement.setAttribute('data-GroupNames', selectedHotelCity.GroupNames);
                    //inputElement.setAttribute('data-FastBookingAreaName', selectedHotelCity.FastBookingAreaName);
                    inputElement.setAttribute('data-HotelCity', JSON.stringify(selectedHotelCity));
                    inputElement.value = selectedHotelCity.Name;

                    MystaysBookingWidget.prototype.HotelSearch.ShowSearchMessage(true, selectedHotelCity);
                },


                ////Selection End


                ////Binding Start
                //Method to initialize autocomplete
                InitializeAutocomplete: function () {
                    //Attaching focus event
                    MystaysBookingWidget.prototype.HotelSearch.CustomHTMLEvents.HotelSearchFocus();
                    //Bind autocomplete to input search
                    MystaysBookingWidget.prototype.HotelSearch.CustomHTMLEvents.HotelSearchKeyUp();
                    MystaysBookingWidget.prototype.HotelSearch.CustomHTMLEvents.HotelSearchKeyDown();



                },

                //Function to load all hotels or hotels(and cities) based on a searched text
                LoadSearchResults: function (userInputText) {
                    var masterHotelList = MystaysBookingWidget.prototype.HotelSearch.GetSearchList();
                    //Filter text passed
                    if (userInputText && userInputText != '') {
                        var filteredHotelList = [];
                        for (var i = 0; i < masterHotelList.length; i++) {
                            if ((masterHotelList[i].HotelSearchNames.toLowerCase().indexOf(userInputText.toLowerCase()) > -1) || (MystaysBookingWidget.prototype.HotelSearch.Constants.FilterCities ? masterHotelList[i].HotelCity.toLowerCase().indexOf(userInputText.toLowerCase()) > -1 : false)) {
                                filteredHotelList.push(masterHotelList[i]);
                            }
                        }
                        return filteredHotelList;

                    }
                    //Load all hotels and cities
                    else {
                        return masterHotelList;
                    }
                },

                //Binding hotels/city to DOM
                BindHotelsCityData: function BindHotelsCityData(hotelList) {
                    //Removing all child items
                    MystaysBookingWidget.prototype.HotelSearch.RemoveHotelList();

                    var cityList = hotelList.filter(function (item) {
                        return item.Type === 'City';
                    })

                    var hotelList = hotelList.filter(function (item) {
                        return item.Type === 'Hotel';
                    })

                    var bindList = document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelBindList());




                    if (cityList.length > 0) {
                        //Create header item
                        var headerListItem = document.createElement('li');
                        headerListItem.className = 'mystyas-hotellist-heading';
                        headerListItem.innerHTML = MystaysBookingWidget.prototype.HotelSearch.Constants.CityLabel;
                        bindList.appendChild(headerListItem);
                        for (var i = 0; i < cityList.length; i++) {
                            var bindListItem = document.createElement('li');
                            bindListItem.setAttribute('tabindex', i);

                            bindListItem.setAttribute('data-Type', cityList[i].Type);
                            bindListItem.setAttribute('data-Name', cityList[i].Name);
                            bindListItem.setAttribute('data-TargetCities', cityList[i].Target);
                            bindListItem.setAttribute('data-Link', cityList[i].Link);
                            bindListItem.setAttribute('data-HotelSearchNames', cityList[i].HotelSearchNames);
                            bindListItem.setAttribute('data-UseTravelClick', cityList[i].UseTravelClick);
                            bindListItem.setAttribute('data-TravelClickBookingID', cityList[i].TravelClickBookingID);
                            bindListItem.setAttribute('data-RWIthCode', cityList[i].RWIthCode);
                            bindListItem.setAttribute('data-HotelCity', cityList[i].HotelCity);
                            bindListItem.setAttribute('data-ItemID', cityList[i].ItemID);

                            bindListItem.setAttribute('data-IsBookable', cityList[i].IsBookable);
                            bindListItem.setAttribute('data-HasMeetingRoom', cityList[i].HasMeetingRoom);
                            bindListItem.setAttribute('data-StartDateForBooking', cityList[i].StartDateForBooking);
                            bindListItem.setAttribute('data-ListHotelGroupNameAllLang', cityList[i].ListHotelGroupNameAllLang);
                            bindListItem.setAttribute('data-FastBookingAreaName', cityList[i].FastBookingAreaName);

                            bindListItem.classList.add(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem());


                            bindListItem.innerHTML = cityList[i].Name;

                            bindList.appendChild(bindListItem);
                        }
                    }


                    if (hotelList.length > 0) {
                        //Create header item
                        var headerListItem = document.createElement('li');
                        headerListItem.className = 'mystyas-hotellist-heading';
                        headerListItem.innerHTML = MystaysBookingWidget.prototype.HotelSearch.Constants.HotelLabel;
                        bindList.appendChild(headerListItem);

                        for (var i = 0; i < hotelList.length; i++) {
                            var bindListItem = document.createElement('li');
                            bindListItem.setAttribute('tabindex', i);
                            bindListItem.setAttribute('data-Type', hotelList[i].Type);
                            bindListItem.setAttribute('data-Name', hotelList[i].Name);
                            bindListItem.setAttribute('data-Link', hotelList[i].Link);
                            bindListItem.setAttribute('data-HotelSearchNames', hotelList[i].HotelSearchNames);
                            bindListItem.setAttribute('data-UseTravelClick', hotelList[i].UseTravelClick);
                            bindListItem.setAttribute('data-TravelClickBookingID', hotelList[i].TravelClickBookingID);
                            bindListItem.setAttribute('data-RWIthCode', hotelList[i].RWIthCode);
                            bindListItem.setAttribute('data-HotelCity', hotelList[i].HotelCity);
                            bindListItem.setAttribute('data-ItemID', hotelList[i].ItemID);
                            bindListItem.classList.add(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSelectItem());


                            bindListItem.setAttribute('data-IsBookable', hotelList[i].IsBookable);
                            bindListItem.setAttribute('data-HasMeetingRoom', hotelList[i].HasMeetingRoom);
                            bindListItem.setAttribute('data-StartDateForBooking', hotelList[i].StartDateForBooking);
                            bindListItem.setAttribute('data-ListHotelGroupNameAllLang', hotelList[i].ListHotelGroupNameAllLang);

                            bindListItem.innerHTML = hotelList[i].Name;

                            bindList.appendChild(bindListItem);
                        }
                    }
                    MystaysBookingWidget.prototype.HotelSearch.CustomHTMLEvents.HotelItemKeyDown();
                    MystaysBookingWidget.prototype.HotelSearch.CustomHTMLEvents.HotelItemClick();
                    bindList.parentNode.ShowElement();


                },

                //Fetch hotel and city details from API
                GetHotelDetailsAPI: function GetHotelDetailsAPI() {

                    var HotelCityList = [];

                    var jsonData = {
                        "Target-Language": MystaysBookingWidget.prototype.HotelSearch.Constants.APITargetLanguage(),
                        "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6InNpdGVjb3JlXFxhZG1pbiIsImlzcyI6Ik15c3RheXMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE4NTIwNzkzMDgsIm5iZiI6MTUzNjcxOTMwOH0.qRTZrIP4l-gkWdLraTr3mfarWSdJ8CKKkBK7hufsNqU"
                    }


                    MystaysBookingWidget.prototype.Common.AjaxCall('http://mystays.local/api/Mystays/Data/GetHotels?Target-Language=' + jsonData["Target-Language"] + '&Authorization=' + jsonData.Authorization, jsonData, 'GET', true, function (response) {
                        var hotelList = JSON.parse(response);

                        for (var i = 0; i < hotelList.length; i++) {
                            var hotel = {
                                Type: 'Hotel',
                                Name: hotelList[i].name,
                                IsBookable: hotelList[i].isBookable,
                                HotelSearchNames: hotelList[i].listHotelNameAllLang,
                                HasMeetingRoom: hotelList[i].hasMeetingRoom,
                                Link: hotelList[i].publicHotelUrl,
                                UseTravelClick: hotelList[i].useTravelClick,
                                TravelClickBookingID: hotelList[i].travelClickBookingId,
                                RWIthCode: hotelList[i].rWithBookingId,
                                HotelCity: hotelList[i].listCityNameAllLang,
                                ItemID: hotelList[i].itemId,
                                StartDateForBooking: hotelList[i].startDateForBooking,
                                GroupNames: hotelList[i].listHotelGroupNameAllLang
                            };

                            HotelCityList.push(hotel);
                        }
                    })

                    if (MystaysBookingWidget.prototype.HotelSearch.Constants.FilterCities) {
                        MystaysBookingWidget.prototype.Common.AjaxCall('http://mystays.local/api/Mystays/Data/GetAreas?Target-Language=' + jsonData["Target-Language"] + '&Authorization=' + jsonData.Authorization, jsonData, 'GET', true, function (response) {
                            var cityList = JSON.parse(response);

                            for (var i = 0; i < cityList.length; i++) {
                                var city = {
                                    Type: 'City',
                                    Name: cityList[i].name,
                                    IsBookable: cityList[i].isBookable,
                                    HotelSearchNames: '',
                                    HasMeetingRoom: cityList[i].hasMeetingRoom,
                                    Link: cityList[i].hotelUrl,
                                    FastBookingAreaName: cityList[i].fastBookingAreaName,
                                    UseTravelClick: cityList[i].useTravelClick,
                                    TravelClickBookingID: cityList[i].travelClickBookingId,
                                    RWIthCode: cityList[i].rWithBookingId,
                                    HotelCity: cityList[i].listCityNameAllLang,
                                    ItemID: cityList[i].itemId,
                                    StartDateForBooking: cityList[i].startDateForBooking,
                                    GroupNames: cityList[i].listHotelGroupNameAllLang
                                };

                                HotelCityList.push(city);
                            }
                        })
                    }

                    return HotelCityList;
                },

                //Function to get all the hotel details from either and api or from another element on the DOM
                //and convert it into a single format
                GetSearchList: function GetSearchList() {

                    if (MystaysBookingWidget.prototype.HotelSearch.Constants.MasterSearchList.length > 0) {

                        return MystaysBookingWidget.prototype.HotelSearch.Constants.MasterSearchList;

                    } else {


                        var searchList = [];
                        var footerHotelListContainer = document.getElementById(MystaysBookingWidget.prototype.HotelSearch.Constants.FooterHotelList());
                        if (footerHotelListContainer) {


                            //Add cities
                            var footerCityListContainer = document.getElementById(MystaysBookingWidget.prototype.HotelSearch.Constants.FooterCityList());
                            if (footerCityListContainer) {
                                var cityList = footerCityListContainer.querySelectorAll(MystaysBookingWidget.prototype.HotelSearch.Constants.FooterCityItemSelector())
                                for (var i = 0; i < cityList.length; i++) {
                                    selectedCity = {};

                                    selectedCity.Type = cityList[i].getAttribute('target-type');
                                    selectedCity.HotelName = cityList[i].innerHTML;
                                    selectedCity.Target = cityList[i].getAttribute('target');
                                    selectedCity.HotelSearchNames = cityList[i].getAttribute('names');
                                    selectedCity.HotelLink = cityList[i].getAttribute('hotel-url');
                                    selectedCity.HotelCity = cityList[i].getAttribute('target-city');
                                    selectedCity.ItemID = cityList[i].getAttribute('item-id');

                                    selectedCity.IsBookable = !cityList[i].parentNode.getAttribute('hotel-residence');
                                    selectedCity.HasMeetingRoom = cityList[i].parentNode.getAttribute('show-in-meeting');
                                    selectedCity.StartDateForBooking = cityList[i].getAttribute('start-date');
                                    selectedCity.GroupNames = cityList[i].getAttribute('groups');

                                    searchList.push(selectedCity);
                                }
                            }

                            //Add hotels
                            var hotelList = footerHotelListContainer.querySelectorAll(MystaysBookingWidget.prototype.HotelSearch.Constants.FooterHotelItemSelector())
                            for (var i = 0; i < hotelList.length; i++) {
                                selectedHotel = {};
                                selectedHotel.HotelName = hotelList[i].innerHTML;
                                selectedHotel.Type = hotelList[i].getAttribute('target-type');
                                selectedHotel.HotelSearchNames = hotelList[i].getAttribute('names');
                                selectedHotel.HotelLink = hotelList[i].getAttribute('hotel-url');
                                selectedHotel.UseTravelClick = hotelList[i].getAttribute('use-travel-click');;
                                selectedHotel.TravelClickBookingID = hotelList[i].getAttribute('travel-click_booking_id');
                                selectedHotel.RWIthCode = hotelList[i].getAttribute('target');
                                selectedHotel.HotelCity = hotelList[i].getAttribute('city');
                                selectedHotel.ItemID = hotelList[i].getAttribute('item-id');

                                selectedHotel.IsBookable = hotelList[i].parentNode.getAttribute('hotel-residence');
                                selectedHotel.HasMeetingRoom = hotelList[i].parentNode.getAttribute('show-in-meeting');
                                selectedHotel.StartDateForBooking = hotelList[i].getAttribute('start-date');
                                selectedHotel.GroupNames = hotelList[i].getAttribute('groups');

                                searchList.push(selectedHotel);
                            }
                        } else {
                            //Call API

                            searchList = MystaysBookingWidget.prototype.HotelSearch.GetHotelDetailsAPI();


                        }


                        MystaysBookingWidget.prototype.HotelSearch.Constants.MasterSearchList = searchList;

                        return MystaysBookingWidget.prototype.HotelSearch.Constants.MasterSearchList;
                    }
                },
                ////Binding End

                Loaded: function () {
                    MystaysBookingWidget.prototype.HotelSearch.InitializeAutocomplete();
                }
            },

            MystaysBookingWidget.prototype.BookNowButton = {
                Constants: {
                    BooknowButton: function BooknowButton() {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + '.search-button button';
                    },
                    PromoCodeField: function PromoCodeField() {
                        return MystaysBookingWidget.prototype.Common.BookingWidgetContainer + '.promocode input';
                    },
                    RWithURL: 'https://mystays.rwiths.net/r-withs/tfs0020a.do?&hotelNo={rwithbookingid}&ciDateY={checkinyear}&ciDateM={checkinmonth}&ciDateD={checkinday}&coDateY={checkoutyear}&coDateM={checkoutmonth}&coDateD={checkoutday}&otona={adults}&s1={children}&room={rooms}',
                    TravelClickHotelURL: 'https://reservations.mystays.com/{travelclickbookingid}?hotelid={travelclickbookingid}&rooms={rooms}&datein={checkindate}&dateout={checkoutdate}&currency=JPY&adults={adults}&children={children}&languageid={language}&promocode={promocode}&childage={childage}',
                    TravelClickAreaURL: 'https://search.mystays.com/MYS?destination={areas}&rooms={rooms}&datein={checkindate}&dateout={checkoutdate}&currency=JPY&adults={adults}&children={children}&languageid={language}&promocode={promocode}&childage={childage}',
                    TravelClickLanguage: function () {
                        if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'ja') {
                            return 6;
                        }
                        if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'en') {
                            return 1;
                        }
                        else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'zh') {
                            return 5;
                        }
                        else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'tw') {
                            return 12;
                        }
                        else if (MystaysBookingWidget.prototype.Common.SelectedLanguage === 'kr') {
                            return 26;
                        }
                    }


                },
                CustomHTMLEvents: {
                    //Event fired when user clicks the book now button
                    BooknowButtonClick: function BooknowButtonClick() {
                        document.querySelector(MystaysBookingWidget.prototype.BookNowButton.Constants.BooknowButton()).addEventListener('click', function () {
                            if (MystaysBookingWidget.prototype.BookNowButton.ValidateBooknowForm()) {
                                MystaysBookingWidget.prototype.BookNowButton.BookNow();
                            }
                        })
                    }
                },

                //Validation to check if the form data is present
                ValidateBooknowForm: function ValidateBooknowForm() {
                    var formOk = true;
                    var hotelSearchInput = document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass());

                    if (hotelSearchInput.getAttribute('data-HotelCity') == null) {

                        hotelSearchInput.classList.add(MystaysBookingWidget.prototype.HotelSearch.Constants.HotelSearchError());
                        formOk = false;
                    }
                    if (MystaysBookingWidget.prototype.MystaysRangeObject == null) {
                        formOk = false;
                    }

                    return formOk;
                },

                GenerateBookingEngineURL: function GenerateBookingEngineURL() {
                    var inputElement = document.querySelector(MystaysBookingWidget.prototype.HotelSearch.Constants.SearchInputClass());

                    var adultElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.AdultElement()).children[0];
                    var childrenElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildElement()).children[0];
                    var roomsElement = document.querySelector(MystaysBookingWidget.prototype.GuestsWidget.Constants.RoomElement()).children[0];

                    var promoCodeElement = document.querySelector(MystaysBookingWidget.prototype.BookNowButton.Constants.PromoCodeField());


                    var hotelcity = JSON.parse(inputElement.getAttribute('data-HotelCity'));


                    //RWith
                    if (hotelcity.UseTravelClick === 'false' || !hotelcity.UseTravelClick) {
                        var bookingengineurl = MystaysBookingWidget.prototype.BookNowButton.Constants.RWithURL;

                        bookingengineurl = bookingengineurl.replace('{rwithbookingid}', hotelcity.RWIthCode);
                        bookingengineurl = bookingengineurl.replace('{checkinyear}', MystaysBookingWidget.prototype.MystaysRangeObject._startDate.getFullYear());
                        bookingengineurl = bookingengineurl.replace('{checkinmonth}', MystaysBookingWidget.prototype.MystaysRangeObject._startDate.getMonth() + 1);
                        bookingengineurl = bookingengineurl.replace('{checkinday}', MystaysBookingWidget.prototype.MystaysRangeObject._startDate.getDate());
                        bookingengineurl = bookingengineurl.replace('{checkoutyear}', MystaysBookingWidget.prototype.MystaysRangeObject._endDate.getFullYear());
                        bookingengineurl = bookingengineurl.replace('{checkoutmonth}', MystaysBookingWidget.prototype.MystaysRangeObject._endDate.getMonth() + 1);
                        bookingengineurl = bookingengineurl.replace('{checkoutday}', MystaysBookingWidget.prototype.MystaysRangeObject._endDate.getDate());
                        bookingengineurl = bookingengineurl.replace('{adults}', adultElement.getAttribute('data-count'));
                        bookingengineurl = bookingengineurl.replace('{children}', childrenElement.getAttribute('data-count'));
                        bookingengineurl = bookingengineurl.replace('{rooms}', roomsElement.getAttribute('data-count'));

                        if (promoCodeElement.value != '') {
                            bookingengineurl = bookingengineurl + '&vipCode=' + promoCodeElement.value;
                        }

                    } else {
                        if (hotelcity.Type === 'Hotel') {
                            var bookingengineurl = MystaysBookingWidget.prototype.BookNowButton.Constants.TravelClickHotelURL;

                            bookingengineurl = bookingengineurl.replace('{travelclickbookingid}', hotelcity.TravelClickBookingID);
                            bookingengineurl = bookingengineurl.replace('{travelclickbookingid}', hotelcity.TravelClickBookingID);
                            bookingengineurl = bookingengineurl.replace('{checkindate}', MystaysBookingWidget.prototype.MystaysRangeObject.startVal.split('|')[3]);
                            bookingengineurl = bookingengineurl.replace('{checkoutdate}', MystaysBookingWidget.prototype.MystaysRangeObject.endVal.split('|')[3]);
                            bookingengineurl = bookingengineurl.replace('{adults}', adultElement.getAttribute('data-count'));
                            bookingengineurl = bookingengineurl.replace('{children}', childrenElement.getAttribute('data-count'));
                            bookingengineurl = bookingengineurl.replace('{rooms}', roomsElement.getAttribute('data-count'));
                        } else if (hotelcity.Type === 'City') {
                            var bookingengineurl = MystaysBookingWidget.prototype.BookNowButton.Constants.TravelClickAreaURL;
                            bookingengineurl = bookingengineurl.replace('{areas}', hotelcity.TargetCities);
                            bookingengineurl = bookingengineurl.replace('{checkindate}', MystaysBookingWidget.prototype.MystaysRangeObject.startVal.split('|')[3]);
                            bookingengineurl = bookingengineurl.replace('{checkoutdate}', MystaysBookingWidget.prototype.MystaysRangeObject.endVal.split('|')[3]);
                            bookingengineurl = bookingengineurl.replace('{adults}', adultElement.getAttribute('data-count'));
                            bookingengineurl = bookingengineurl.replace('{children}', childrenElement.getAttribute('data-count'));
                            bookingengineurl = bookingengineurl.replace('{rooms}', roomsElement.getAttribute('data-count'));
                        }


                        //If chldren are present then append  age of child
                        if (childrenElement.getAttribute('data-count') > 0) {

                            var childAgeString = '';

                            //Looping through each child age selector to get the value
                            for (var i = 0; i < MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().getElementsByClassName(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeContainerClass).length; i++) {

                                childAgeString += MystaysBookingWidget.prototype.Common.BookingWidgetContainerElement().getElementsByClassName(MystaysBookingWidget.prototype.GuestsWidget.Constants.ChildAgeContainerClass)[i].getElementsByTagName('select')[0].value + ',';
                            }
                            bookingengineurl = bookingengineurl.replace('{childage}', childAgeString);
                        } else {
                            bookingengineurl = bookingengineurl.replace('&childage={childage}', '');
                        }

                        bookingengineurl = bookingengineurl.replace('{language}', MystaysBookingWidget.prototype.BookNowButton.Constants.TravelClickLanguage());

                        if (promoCodeElement.value != '') {
                            bookingengineurl = bookingengineurl.replace('{promocode}', promoCodeElement.value);
                        } else {
                            bookingengineurl = bookingengineurl.replace('&promocode={promocode}', '');
                        }
                    }

                    return bookingengineurl;
                },

                GenerateTravelClickURL: function GenerateTravelClickURL() {

                },

                //Load booking engine page
                BookNow: function BookNow() {

                    window.open(MystaysBookingWidget.prototype.BookNowButton.GenerateBookingEngineURL(), '_blank');

                },

                Loaded: function Loaded() {
                    MystaysBookingWidget.prototype.BookNowButton.CustomHTMLEvents.BooknowButtonClick();
                }
            },

            //Main initialization function
            MystaysBookingWidget.prototype.Loaded = function Loaded(selectedLanguage, FilterCities, BookingWidgetContainerID) {


                this._SelectedLanguage = selectedLanguage;


                this._BookingWidgetContainer = BookingWidgetContainerID + ' ';
//                this.HotelSearch.Constants.FilterCities = FilterCities;

                //MystaysBookingWidget.prototype.Helper.Loaded();
                //MystaysBookingWidget.prototype.MystaysRangeObject = MystaysBookingWidget.prototype.BookingCalendar.Loaded();
                //MystaysBookingWidget.prototype.GuestsWidget.Loaded();
                //MystaysBookingWidget.prototype.HotelSearch.Loaded();
                //MystaysBookingWidget.prototype.BookNowButton.Loaded();
            }
    }
};



document.addEventListener("DOMContentLoaded", function () {
    var calendarOne = new MystaysBookingWidget();
    var calendarTwo = new MystaysBookingWidget();


    calendarOne.Loaded('en', false, '#booking-widget-container');
    calendarOne.Loaded('ja', true, '#booking-widget-containertwo');


});