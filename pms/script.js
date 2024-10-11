const SEMESTER_START = "2024-10-07",
      SEMESTER_END = "2025-01-17";

function lesson_event(title, desc, dayOfWeek, timeStart, timeEnd, color, from = SEMESTER_START, to = SEMESTER_END)
{
    return {
        title: title + " - " + desc,
        startRecur: from,
        endRecur: to,
        daysOfWeek: [dayOfWeek],
        startTime: timeStart,
        endTime: timeEnd,
        backgroundColor: color
    };
}

window.onload = () => {
    let tabs = document.getElementsByTagName("h2");
    for (let i = 0; i < tabs.length; ++i)
    {
        tabs[i].addEventListener("click", function() {
            this.classList.toggle("collapsed");

            let tabContent = this.nextElementSibling;
            tabContent.style.display = (tabContent.style.display == "none" ? "block" : "none");

            if (this.getAttribute("data-load"))
            {
                let img = document.createElement("IMG");
                img.src = this.getAttribute("data-load");
                tabContent.appendChild(img);
                this.removeAttribute("data-load");
            }
        });
    }

    window.calendar = new FullCalendar.Calendar(
        document.querySelector("#calendar"),
        {
            initialView: 'listWeek',
            height: 600,
            headerToolbar:
            {
                left: 'prev,next',
                center: 'title',
                right: 'listWeek,dayGridWeek,dayGridMonth'
            },
            locale: 'el',
            eventDisplay: 'block',
            events: [
                lesson_event("Σ. Καπερώνης", "Μέσα και Ψηφιακές Εφαρμογές: το design ως μέσο επικοινωνίας", 1, "19:00", "22:00", "#4659B7"),
                lesson_event("Μ. Ψύλλα", "Δημόσιες πολιτικές και επικοινωνία", 2, "16:00", "19:00", "#B74659"),
                lesson_event("Ν. Λέανδρος", "Παραγωγή Περιεχομένου και Επιχειρήσεις Μέσων", 2, "19:00", "22:00", "#B7B746"),
                lesson_event("Γ. Μ. Κλήμης", "Διοίκηση και Μάρκετινγκ", 3, "16:00", "19:00", "#59B746"),
                lesson_event("Δ. Ιορδάνογλου", "Ηγεσία και Επιχειρηματικότητα στη Δημοσιογραφία (Ι)", 3, "19:00", "22:00", "#B746B7", SEMESTER_START, "2024-11-14"),
                lesson_event("Μπ. Τσακαρέστου", "Ηγεσία και Επιχειρηματικότητα στη Δημοσιογραφία (ΙΙ)", 5, "16:00", "19:00", "#B746B7", "2024-11-28", SEMESTER_END),
                lesson_event("Α. Γαζή", "Μεθοδολογία της Έρευνας στα Μέσα και την Επικοινωνία (ΥΠ)", 4, "16:00", "19:00", "#46B7B7"),
            ]
        }
    );
    calendar.render();
};