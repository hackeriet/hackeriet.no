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

function update_meetup() {
    var meetup = new XMLHttpRequest();
    // Meetup data fetched by a systemd.timer job from:
    // https://api.meetup.com/hackeriet/events?scroll=recent_past&page=20
    meetup.open('GET', '/meetup.json', true);
    meetup.onload = function(){
        if(this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            populateMeetupList(data);
        }
    }
    meetup.send();
}

function populateMeetupList(eventList){
    for (meetup of eventList) {
        var m = moment(meetup.time);
        if ((meetup.status == "upcoming" && m.isBefore(moment().day(30)))
            || ((moment().get('date') == m.get('date')) && (moment().get('month') == m.get('month')))){
                var tr = document.createElement("tr");
            tr.innerHTML = "<td style='float: right;width:150px'>" + m.calendar() +
                "</td><td style='width:90px'>" +
                        m.format(_hackeriet.timeFormat) + "</td><td><a href='" +
                meetup.link +"' target='_blank'>" + meetup.name + "</a></td>";
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

function setupWebsocket() {
    var ws = new WebSocket("wss://hackeriet.no/ws/");
    ws.addEventListener("message", msg => {
        const p = msg.data.split(" ");
        if (p[0] !== "hackeriet/environment/light") { return }
            const p2 = map(p[1], 400, 1024, 0.4, 1);
            document.getElementById("logo").style.opacity = p2;
    })
}

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

init();
update_door();
update_meetup();
setupWebsocket();
