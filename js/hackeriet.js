var _hackeriet = {};

function init() {
    if (document.documentElement.lang === 'no') {
        moment.locale('nb', {
            calendar : {
                sameDay: '[i dag]',
                nextDay: '[i morgen]',
                nextWeek: 'dddd',
                lastDay: '[i går]',
                lastWeek: '[forrige] dddd',
                sameElse: 'dddd D/M'
            }
        });
        _hackeriet.timeFormat = "[kl.] LT";
        _hackeriet.openText = "folk der";
        _hackeriet.closedText = "ingen der";
    } else {
        moment.locale('en', {
            calendar : {
                sameDay : '[Today]',
                nextDay : '[Tomorrow]',
                nextWeek : 'dddd',
                lastDay : '[Yesterday]',
                lastWeek : '[Last] dddd',
                sameElse : 'dddd D/M'
            }
        });
        _hackeriet.timeFormat = "[at] LT";
        _hackeriet.openText = "people there";
        _hackeriet.closedText = "no one there";
    }
}

function meetup(mup){
    for (e of mup.data) {
        var m = moment(e.time);
        if ((e.status == "upcoming" && m.isBefore(moment().day(30)))
            || ((moment().get('date') == m.get('date')) && (moment().get('month') == m.get('month')))){
                var tr = document.createElement("tr");
            tr.innerHTML = "<td style='float: right;width:150px'>" + m.calendar() +
                "</td><td style='width:80px'>" +
                m.format(_hackeriet.timeFormat) + "</td><td><a href='" +
                e.link +"' target='_blank'>" + e.name + "</a></td>";
                document.getElementById("meetup").appendChild(tr);
            };
    };
}

function door(data) {
    if (data.status === "OPEN") {
        document.getElementById("doorstatus").innerHTML = _hackeriet.openText;
    } else {
        document.getElementById("doorstatus").innerHTML = _hackeriet.closedText;
    }
}

function update_door() {
    var door = new XMLHttpRequest();
    door.open('GET', '/door.json', true);
    door.onload = function(){
        if(this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            if (data.status === "OPEN") {
                document.getElementById("doorstatus").innerHTML = _hackeriet.openText;
            } else {
                document.getElementById("doorstatus").innerHTML = _hackeriet.closedText;
            }
        }
    }
    door.send();
}

init()
update_door()


