// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Calendar Functionality
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const timeSlotsContainer = document.getElementById('timeSlots');
const selectedDateElement = document.querySelector('.selected-date');
const confirmButton = document.getElementById('confirmBooking');

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Business hours: 7 AM - 4 PM, closed Sundays
const timeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
];

function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthElement.textContent = `${months[month]} ${year}`;

    calendarGrid.innerHTML = '';

    // Add day labels
    dayLabels.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.classList.add('calendar-day', 'day-label');
        dayLabel.textContent = day;
        calendarGrid.appendChild(dayLabel);
    });

    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'disabled');
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        const currentDay = new Date(year, month, day);
        currentDay.setHours(0, 0, 0, 0);

        // Disable Sundays and past dates
        if (currentDay.getDay() === 0 || currentDay < today) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(year, month, day, dayElement));
        }

        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(year, month, day, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // Add selection to clicked day
    element.classList.add('selected');

    selectedDate = new Date(year, month, day);
    const formattedDate = `${months[month]} ${day}, ${year}`;
    selectedDateElement.textContent = `Selected: ${formattedDate}`;

    generateTimeSlots();
}

function generateTimeSlots() {
    timeSlotsContainer.innerHTML = '';

    timeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = time;

        timeSlot.addEventListener('click', () => {
            // Remove previous time selection
            document.querySelectorAll('.time-slot.selected').forEach(el => {
                el.classList.remove('selected');
            });

            timeSlot.classList.add('selected');
            selectedTime = time;
            confirmButton.disabled = false;
        });

        timeSlotsContainer.appendChild(timeSlot);
    });
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

confirmButton.addEventListener('click', () => {
    if (selectedDate && selectedTime) {
        const formattedDate = `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        alert(`Please call (760) 808-8113 to confirm your appointment for:\n\n${formattedDate} at ${selectedTime}\n\nWe look forward to seeing you!`);

        // Optionally, open phone dialer
        window.location.href = 'tel:7608088113';
    }
});

// Initialize calendar
generateCalendar(currentDate);

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(201, 169, 97, 0.3)';
    }

    lastScroll = currentScroll;
});

// Add scroll animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Set initial home section to visible
document.querySelector('#home').style.opacity = '1';
document.querySelector('#home').style.transform = 'translateY(0)';
