document.addEventListener("DOMContentLoaded", function () {


    mobiscroll.range('#demo', {
        theme: 'mobiscroll',
        lang: 'en',
        context: '#calender-container',
        controls: ['calendar'],
        startInput: "#calendar-checkindate",
        endInput: '#calendar-checkoutdate',
        buttons:['set'],
        months: 1,
        calendarScroll:'vertical',
        min: new Date(),
        showSelector:false,
        responsive: {
            medium: {
                months: 2,
                calendarScroll: 'horizontal',
            }
        },
        yearChange: false,
        
        //Events
        onInit: function (event, inst) {
            var now = new Date(),
            range = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0)];
            inst.setVal(range)
        }

    });



});
