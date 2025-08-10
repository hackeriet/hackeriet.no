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
    _hackeriet.message_elms = {};
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

function update_mobilizon() {
    var meetup = new XMLHttpRequest();
    // Meetup data fetched by a systemd.timer job from: https://events.hackeriet.no/@us
    meetup.open('GET', '/events.json', true);
    meetup.onload = function(){
        if(this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            populateMobilizonList(data);
        }
    }
    meetup.send();
}

function populateMobilizonList(eventList){
    for (meetup of eventList) {
        var m = moment(meetup.time);
        var tr = document.createElement("tr");

        let col = document.createElement("td");
        col.style.float = "right";
        col.style.width = "150px";
        col.innerText = m.calendar()
        tr.appendChild(col);

        col = document.createElement("td");
        col.style.width = "90px";
        col.innerText = m.format(_hackeriet.timeFormat);
        tr.appendChild(col);

        col = document.createElement("td");
        let link = document.createElement("a");
        link.href = meetup.link;
        link.target = "_blank";
        link.innerText = meetup.name;
        col.appendChild(link);
        tr.appendChild(col);

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


function update_door_CO2() {
    var door_co2 = new XMLHttpRequest();
    door_co2.open('GET', 'https://aleksei.hackeriet.no/door.json', true);
    door_co2.onload = function(){
        if(this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            if (data.status === "OPEN") {
                document.getElementById("doorstatus").innerHTML = _hackeriet.openText;
            } else {
                document.getElementById("doorstatus").innerHTML = _hackeriet.closedText;
            }
        }
    }
    door_co2.send();
}

function messageUpdate(k,v) {
    var elm = _hackeriet.message_elms[k];
    if (!elm) {
        elm = document.createElement("nobr");
        elm.style="font-size:8px;padding-right:5px;font-family:Courier;";
        elm.id = k;
        _hackeriet.message_elms[k] = elm;
        document.body.appendChild(elm);
    }
    elm.innerHTML = "<span style='color:#999;'>"+k + "</span> <span>" + v + "</span>";
}

function setupWebsocket() {
    var ws = new WebSocket("wss://hackeriet.no/ws/");
    ws.addEventListener("message", msg => {
        const p = msg.data.split(" ");
        messageUpdate(p[0],p[1]);
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
//update_meetup();
update_mobilizon();
setupWebsocket();
