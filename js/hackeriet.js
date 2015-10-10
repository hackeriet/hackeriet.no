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

function meetup(data){
    for (r in data.results) {
        var e = data.results[r];
        var tr = document.createElement("tr");
        var m = moment(e.time);
        tr.innerHTML = "<td style='float: right'>" + m.calendar() + "</td><td>" +
            m.format(_hackeriet.timeFormat) + "</td><td><a href='" +
            e.event_url +"' target='_blank'>" + e.name + "</a></td>";
        document.getElementById("meetup").appendChild(tr);
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


