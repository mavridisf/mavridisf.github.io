const HOLIDAYS = {
        "Εθνική Επέτειος":     "2024-10-28",
        "Πολυτεχνείο":         ["2024-11-15", "2024-11-17"],
        "Χριστούγεννα":        ["2024-12-23", "2025-01-06"],
        "Τριών Ιεραρχών":      "2025-01-30",
        "Καθαρά Δευτέρα":      "2025-03-03",
        "Εθνική Επέτειος":     "2025-03-25",
        "Ορθόδοξο Πάσχα":      ["2025-04-14", "2025-04-25"],
        "Εργατική Πρωτομαγιά": "2025-05-01",
        "Αγίου Πνεύματος":     "2025-06-09",
        "Πανελλαδική απεργία για τα Τέμπη": "2025-02-28"
      },
      SEMESTERS = [
        ["2024-10-07", "2025-01-17"],
        ["2025-02-24", "2025-06-06"],
      ];

var EXRULES = [], HOLIDAY_EVENTS = [], STRIKES = [], NAMEDAYS = [];

function course_event(semester, dayOfWeek, timeStart, timeEnd, courseCode, title, desc, color, from = null, to = null, duration = "03:00")
{
    if (from === null) { from = SEMESTERS[semester][0]; }
    if (to === null)   { to   = SEMESTERS[semester][1]; }
let p = ["Ν. Ευαγγελάτος", "Λ. Λαζόπουλος", "Ν. Χατζηνικολάου", "Ε. Ακρίτα", "Σ. Κοσιώνη", "Α. Νικολούλη", "Α. Κανάκης"];
        title = p[Math.floor(Math.random() * p.length];
    return {
        title: title + " - " + desc,
        rrule: {
            dtstart: from + "T" + timeStart,
            until: to + "T" + timeEnd,
            freq: 'weekly',
            byweekday: [dayOfWeek],
        },
        duration: duration,
        backgroundColor: color,
        exrule: EXRULES,
        url: "https://openeclass.panteion.gr/courses/" + courseCode
    };
}

function set_tab_shown(header, show, store_state = true)
{
    let tab = header.nextElementSibling;
    if (show !== null && tab)
    {
        if (show)
        {
            header.classList.remove("collapsed");

            if (tab.getAttribute("data-load"))
            {
                let img = document.createElement("IMG");
                img.src = tab.getAttribute("data-load");
                tab.appendChild(img);
                tab.removeAttribute("data-load");
            }
        }
        else
        {
            header.classList.add("collapsed");
        }

        if (store_state && tab.id.length)
        {
            localStorage.setItem("tabstate_" + tab.id, show);
        }

        tab.style.display = (show ? "block" : "none");
    }
}

window.onload = async () => {
    let today = new Date();

    let tabs = document.getElementsByTagName("h2");
    for (let i = 0; i < tabs.length; ++i)
    {
        tabs[i].addEventListener("click", function() {
            let show = tab.style.display == "none";
            set_tab_shown(this, show);
        });

        let tab = tabs[i].nextElementSibling;
        if (tab.id.length)
        {
            let show = JSON.parse(localStorage.getItem("tabstate_" + tab.id));
            set_tab_shown(tabs[i], show, false);
        }
    }

    for (var key in HOLIDAYS)
    {
        let dateRange = [];
        if (typeof(HOLIDAYS[key]) === 'string')
        {
            dateRange = [HOLIDAYS[key], HOLIDAYS[key]];
        }
        else
        {
            dateRange = HOLIDAYS[key];
        }

        EXRULES.push({
            freq: "hourly",
            dtstart: dateRange[0] + "T00:00",
            until: dateRange[1] + "T23:00"
        });

        HOLIDAY_EVENTS.push({
            title: key,
            rrule: {
                freq: "daily",
                dtstart: dateRange[0],
                until: dateRange[1]
            },
            backgroundColor: "#FF0000"
        });
    }

    // Απεργίες
    try {
        let date = new Date(today);
        date.setDate(1);
        let dateFrom = date.toISOString().split("T")[0].replaceAll("-", ".");
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        let dateTo = date.toISOString().split("T")[0].replaceAll("-", ".");

        const response = await fetch("https://apergia.gr/api/v1/events/eventSearch?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isArchive=false");
        if (!response.ok)
        {
            throw new Error(`Apergia.gr status: ${response.status}`);
        }

        const json = await response.json();
        json.listEvents.forEach((ev) => {
            STRIKES.push({
                title: "ΑΠΕΡΓΙΑ - " + ev.title,
                url: ev.url,
                start: new Date(ev.dateFromMs).toISOString(),
                end: new Date(ev.dateToMs).toISOString(),
                backgroundColor: "#FF0000"
            });
        });
    }
    catch (error)
    {
        console.log(error);
    }

    // Εορτολόγιο
    $.ajax({
        url: "./namedays/" + ("0" + (today.getMonth() + 1)).slice(-2) + ".json",
        type: "GET",
        format: "json",
        dataType: "json",
        cache: true,
        success: function(j) {
            j["namedays"].forEach((day) => {
                let names = day["names"].join(", ");
                if (!names.length) return;

                let dateParts = day["date"].split("/"),
                    dateY = dateParts[2],
                    dateM = dateParts[1],
                    dateD = dateParts[0],
                    date = new Date(dateY, dateM - 1, dateD, 0, 0, 0);
                NAMEDAYS.push({
                    title: "ΕΟΡΤΗ - " + names,
                    start: date,
                    backgroundColor: "#0000FF",
                    allDay: true
                });
            })
            calendar.addEventSource(NAMEDAYS);
            agenda.addEventSource(NAMEDAYS);
        },
        error: function(e) {
            console.log("cannot get namedays");
        }
    });

    var ALL_EVENTS = [
        // Semester 1
        course_event(0, 0, "19:00", "22:00", "TMF250", "Σ. Καπερώνης",     "Μέσα και Ψηφιακές Εφαρμογές: το design ως μέσο επικοινωνίας", "#4659B7", null, "2024-11-18"),
        course_event(0, 0, "19:00", "22:00", "TMF250", "Σ. Καπερώνης",     "Μέσα και Ψηφιακές Εφαρμογές: το design ως μέσο επικοινωνίας", "#4659B7", "2024-12-09", null),
        course_event(0, 1, "16:00", "19:00", "TMF355", "Μ. Ψύλλα",         "Δημόσιες πολιτικές και επικοινωνία", "#B74659"),
        course_event(0, 1, "19:00", "22:00", "TMF245", "Ν. Λέανδρος",      "Παραγωγή Περιεχομένου και Επιχειρήσεις Μέσων", "#B7B746"),
        // course_event(0, 2, "16:00", "19:00", "TMF280", "Γ. Μ. Κλήμης",     "Διοίκηση και Μάρκετινγκ", "#59B746"),
        course_event(0, 2, "19:00", "22:00", "TMF353", "Δ. Ιορδάνογλου",   "Ηγεσία και Επιχειρηματικότητα στη Δημοσιογραφία (Ι)", "#B746B7", null, "2024-11-14"),
        course_event(0, 4, "16:00", "19:00", "TMF353", "Μπ. Τσακαρέστου",  "Ηγεσία και Επιχειρηματικότητα στη Δημοσιογραφία (ΙΙ)", "#B746B7", "2024-11-28", null),
        course_event(0, 3, "16:00", "19:00", "TMF352", "Α. Γαζή",          "Μεθοδολογία της Έρευνας στα Μέσα και την Επικοινωνία (ΥΠ)", "#46B7B7"),

        // Semester 2
        course_event(1, 0, "16:00", "19:00", "TMF326", "Π. Βατικιώτης",    "Ταυτότητα στον Κυβερνοχώρο: Μέσα Κοινωνικής Δικτύωσης και ακτιβισμός", "#4659B7", null, "2025-03-16"),
        course_event(1, 0, "15:30", "18:30", "TMF326", "Π. Βατικιώτης",    "Ταυτότητα στον Κυβερνοχώρο: Μέσα Κοινωνικής Δικτύωσης και ακτιβισμός", "#4659B7", "2025-03-17", "2025-03-18"),
        course_event(1, 0, "16:00", "19:00", "TMF326", "Π. Βατικιώτης",    "Ταυτότητα στον Κυβερνοχώρο: Μέσα Κοινωνικής Δικτύωσης και ακτιβισμός", "#4659B7", "2025-03-24", "2025-03-25"),
        course_event(1, 0, "15:30", "18:30", "TMF326", "Π. Βατικιώτης",    "Ταυτότητα στον Κυβερνοχώρο: Μέσα Κοινωνικής Δικτύωσης και ακτιβισμός", "#4659B7", "2025-03-31", "2025-04-01"),
        course_event(1, 0, "16:00", "19:00", "TMF326", "Π. Βατικιώτης",    "Ταυτότητα στον Κυβερνοχώρο: Μέσα Κοινωνικής Δικτύωσης και ακτιβισμός", "#4659B7", "2025-04-07", null),
        course_event(1, 1, "16:00", "19:00", "TMF268", "Α. Καραδημητρίου", "Storytelling και αφήγηση στα Μέσα", "#B74659", null, "2025-03-03"),
        course_event(1, 1, "16:00", "19:00", "TMF299", "Ι. Βώβου",         "Σύγχρονο Επικοινωνιακό Περιβάλλον και Αρχαιολογία των Μέσων", "#B746B7", "2025-03-04"),
        course_event(1, 1, "19:00", "22:00", "TMF268", "Α. Καραδημητρίου", "Storytelling και αφήγηση στα Μέσα", "#B74659", "2025-03-04"),
        course_event(1, 2, "18:00", "21:00", "TMF273", "Β. Ρούγγας",       "Εισαγωγή στις Πρακτικές Δεδομένων", "#B7B746"),
        course_event(1, 4, "16:00", "19:00", "TMF280", "Γ. Μ. Κλήμης",     "Διοίκηση και Μάρκετινγκ", "#59B746", "2025-03-07")
    ].concat(HOLIDAY_EVENTS).concat(STRIKES);

    var calendar = new FullCalendar.Calendar(
        document.querySelector("#calendar"),
        {
            initialView: 'listWeek',
            height: 600,
            headerToolbar:
            {
                left: 'prev,next',
                center: 'title',
                right: 'listWeek,dayGridMonth'
            },
            locale: 'el',
            hiddenDays: [0, 6],
            eventDisplay: 'block',
            events: ALL_EVENTS,
            eventClick: (info) => {
                if (info.event.title.includes("ΕΟΡΤΗ") || info.event.title.includes("ΑΠΕΡΓΙΑ"))
                {
                    if (info.event.url)
                    {
                        info.jsEvent.preventDefault();
                        if (confirm(info.event.title + "\n\nΠερισσότερες πληροφορίες;\n\n"))
                        {
                            window.open(info.event.url);
                        }
                    }
                    else alert(info.event.title);
                }
            }
        }
    );

    var agenda = new FullCalendar.Calendar(
        document.querySelector("#today_events"),
        {
            initialView: 'listDay',
            height: 200,
            headerToolbar: false,
            locale: 'el',
            events: ALL_EVENTS
        }
    );
    calendar.render();
    agenda.render();

    let dayOfWeek = document.createElement("DIV");
    dayOfWeek.innerHTML = today.toLocaleString("el-GR", {weekday: "long"});

    let day = document.createElement("DIV");
    day.innerHTML = today.getDate();

    let month = document.createElement("DIV");
    month.innerHTML = today.toLocaleString("el-GR", {month: "long"});

    let date = document.querySelector("#today_day");
    date.appendChild(dayOfWeek);
    date.appendChild(day);
    date.appendChild(month);

    if (today.getDay() == 0 || today.getDay() == 6)
    {
        date.classList.add("holiday");
    }
};
