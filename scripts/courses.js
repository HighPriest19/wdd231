// Course data array with ITM111 added
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    },
    {
        subject: 'ITM',
        number: 111,
        title: 'Introduction to Database',
        credits: 3,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to database design and management using SQL.',
        technology: ['SQL'],
        completed: false
    }
];

// Get references to DOM elements
const courseListContainer = document.querySelector('.course-list-container');
const totalCreditsElement = document.getElementById('total-credits');
const body = document.body; // Reference to body for modal

// Get all filter buttons
const filterAll = document.getElementById('filter-all');
const filterCSE = document.getElementById('filter-cse');
const filterWDD = document.getElementById('filter-wdd');
const filterITM = document.getElementById('filter-itm');


// --- MODAL CREATION AND LOGIC ---

// Create the course detail modal structure (must be done only once)
function createCourseModal() {
    // Check if modal already exists
    if (document.getElementById('course-modal-overlay')) {
        return;
    }

    const modalHTML = `
        <div id="course-modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <button id="modal-close-btn" class="modal-close-btn">&times;</button>
                <h3 id="modal-course-title" class="modal-title">Course Title</h3>
                <p class="modal-course-code"><span id="modal-subject"></span> <span id="modal-number"></span></p>
                <p class="modal-detail"><strong>Credits:</strong> <span id="modal-credits"></span></p>
                <p class="modal-detail"><strong>Certificate:</strong> <span id="modal-certificate"></span></p>
                <p class="modal-detail"><strong>Technology:</strong> <span id="modal-technology"></span></p>
                <div class="modal-description-box">
                    <h4>Description</h4>
                    <p id="modal-description"></p>
                </div>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', modalHTML);

    // Get modal references after creation
    const modalOverlay = document.getElementById('course-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');

    // Close modal listeners
    closeBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
    modalOverlay.addEventListener('click', (e) => {
        // Close when clicking outside the modal-content area
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('open');
        }
    });
}

// Function to show the modal with course data
function showCourseDetails(course) {
    document.getElementById('modal-course-title').textContent = course.title;
    document.getElementById('modal-subject').textContent = course.subject;
    document.getElementById('modal-number').textContent = course.number;
    document.getElementById('modal-credits').textContent = course.credits;
    document.getElementById('modal-certificate').textContent = course.certificate;
    document.getElementById('modal-description').textContent = course.description;
    document.getElementById('modal-technology').textContent = course.technology.join(', ');

    // Display the modal
    document.getElementById('course-modal-overlay').classList.add('open');
}


// --- COURSE CARD GENERATION AND LOGIC ---

// Function to display courses
function displayCourses(coursesToDisplay) {
    // Clear existing content
    courseListContainer.innerHTML = '';
    
    // Create and append course cards
    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        // Add 'completed' class if the course is completed
        if (course.completed) {
            courseCard.classList.add('completed');
        }

        // Add data attributes for targeting and future features
        courseCard.setAttribute('data-subject', course.subject);
        courseCard.setAttribute('data-number', String(course.number));
        courseCard.setAttribute('data-credits', String(course.credits));
        courseCard.setAttribute('role', 'button');
        courseCard.setAttribute('tabindex', '0');

        // Build inner structure: title and (optional) small meta
        const title = document.createElement('h3');
        title.textContent = `${course.subject} ${course.number}: ${course.title}`;
        courseCard.appendChild(title);

        // Add both click and keyboard activation
        courseCard.addEventListener('click', () => showCourseDetails(course));
        courseCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showCourseDetails(course);
            }
        });

        courseListContainer.appendChild(courseCard);
    });
    
    // Calculate and display total credits using reduce
    calculateTotalCredits(coursesToDisplay);
}

// Function to calculate total credits using reduce
function calculateTotalCredits(coursesToDisplay) {
    const totalCredits = coursesToDisplay.reduce((total, course) => {
        return total + course.credits;
    }, 0);
    
    totalCreditsElement.textContent = totalCredits;
}

// Function to set active button
function setActiveButton(activeButton) {
    // Get all filter buttons in one go
    const filterButtons = [filterAll, filterCSE, filterWDD, filterITM];
    
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to the clicked button
    activeButton.classList.add('active');
}

// Event Listeners for filter buttons
filterAll.addEventListener('click', () => {
    displayCourses(courses);
    setActiveButton(filterAll);
});

filterCSE.addEventListener('click', () => {
    const cseCoursesFiltered = courses.filter(course => course.subject === 'CSE');
    displayCourses(cseCoursesFiltered);
    setActiveButton(filterCSE);
});

filterWDD.addEventListener('click', () => {
    const wddCoursesFiltered = courses.filter(course => course.subject === 'WDD');
    displayCourses(wddCoursesFiltered);
    setActiveButton(filterWDD);
});

filterITM.addEventListener('click', () => {
    const itmCoursesFiltered = courses.filter(course => course.subject === 'ITM');
    displayCourses(itmCoursesFiltered);
    setActiveButton(filterITM);
});


// --- INITIALIZATION ---

// Initial display - show all courses when page loads
createCourseModal(); // Create the modal element first
displayCourses(courses);