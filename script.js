let students = JSON.parse(
    localStorage.getItem("students")
) || [

    {
        id: 1,
        name: "Rahul Sharma",
        roll: "CS001",
        course: "Computer Science",
        email: "rahul@example.com"
    },

    {
        id: 2,
        name: "Priya Patil",
        roll: "IT002",
        course: "Information Technology",
        email: "priya@example.com"
    },

    {
        id: 3,
        name: "Arjun Mehta",
        roll: "AI003",
        course: "Artificial Intelligence",
        email: "arjun@example.com"
    }

];


let editingId = null;


/* =========================
   SAVE DATA
========================= */

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


/* =========================
   DISPLAY STUDENTS
========================= */

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    const emptyState =
        document.getElementById("emptyState");

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    const course =
        document.getElementById("courseFilter")
            .value;


    let filteredStudents =
        students.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.roll
                    .toLowerCase()
                    .includes(search)

                ||

                student.email
                    .toLowerCase()
                    .includes(search);


            const matchesCourse =
                course === "all"
                ||
                student.course === course;


            return matchesSearch &&
                   matchesCourse;

        });


    table.innerHTML = "";


    if (filteredStudents.length === 0) {

        table.style.display = "none";

        emptyState.style.display = "block";

        return;

    }


    table.style.display = "table";

    emptyState.style.display = "none";


    filteredStudents.forEach(student => {

        const row =
            document.createElement("tr");


        const initial =
            student.name
                .charAt(0)
                .toUpperCase();


        row.innerHTML = `

            <td>

                <div class="student-name">

                    <div class="avatar">
                        ${initial}
                    </div>

                    <strong>
                        ${student.name}
                    </strong>

                </div>

            </td>


            <td>
                ${student.roll}
            </td>


            <td>

                <span class="course-badge">
                    ${student.course}
                </span>

            </td>


            <td>
                ${student.email}
            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        onclick="editStudent(${student.id})"
                    >
                        ✏ Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent(${student.id})"
                    >
                        🗑 Delete
                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStats() {

    document.getElementById(
        "totalStudents"
    ).textContent = students.length;


    const courses =
        new Set(
            students.map(
                student => student.course
            )
        );


    document.getElementById(
        "totalCourses"
    ).textContent = courses.size;


    const recent =
        Math.min(
            students.length,
            3
        );


    document.getElementById(
        "recentStudents"
    ).textContent = recent;

}


/* =========================
   UPDATE COURSE FILTER
========================= */

function updateCourseFilter() {

    const filter =
        document.getElementById(
            "courseFilter"
        );


    const currentValue =
        filter.value;


    const courses =
        [...new Set(
            students.map(
                student => student.course
            )
        )];


    filter.innerHTML = `
        <option value="all">
            All Courses
        </option>
    `;


    courses.forEach(course => {

        const option =
            document.createElement("option");

        option.value = course;

        option.textContent = course;

        filter.appendChild(option);

    });


    filter.value = currentValue;

}


/* =========================
   OPEN MODAL
========================= */

function openModal() {

    editingId = null;

    document.getElementById(
        "studentModal"
    ).classList.add("show");


    document.getElementById(
        "modalTitle"
    ).textContent = "Add Student";


    document.getElementById(
        "studentForm"
    ).reset();


    document.getElementById(
        "studentId"
    ).value = "";

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    document.getElementById(
        "studentModal"
    ).classList.remove("show");

}


/* =========================
   ADD / EDIT STUDENT
========================= */

document.getElementById(
    "studentForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const roll =
            document.getElementById(
                "roll"
            ).value.trim();


        const course =
            document.getElementById(
                "course"
            ).value;


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        if (!name || !roll ||
            !course || !email) {

            alert(
                "Please fill in all fields."
            );

            return;

        }


        if (editingId !== null) {

            const student =
                students.find(
                    s => s.id === editingId
                );


            student.name = name;

            student.roll = roll;

            student.course = course;

            student.email = email;


        } else {

            const newStudent = {

                id: Date.now(),

                name: name,

                roll: roll,

                course: course,

                email: email

            };


            students.push(newStudent);

        }


        saveStudents();

        displayStudents();

        updateStats();

        updateCourseFilter();

        closeModal();

    }
);


/* =========================
   EDIT STUDENT
========================= */

function editStudent(id) {

    const student =
        students.find(
            s => s.id === id
        );


    if (!student) return;


    editingId = id;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Student";


    document.getElementById(
        "name"
    ).value =
        student.name;


    document.getElementById(
        "roll"
    ).value =
        student.roll;


    document.getElementById(
        "course"
    ).value =
        student.course;


    document.getElementById(
        "email"
    ).value =
        student.email;


    document.getElementById(
        "studentModal"
    ).classList.add("show");

}


/* =========================
   DELETE STUDENT
========================= */

function deleteStudent(id) {

    const student =
        students.find(
            s => s.id === id
        );


    if (!student) return;


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) return;


    students =
        students.filter(
            s => s.id !== id
        );


    saveStudents();

    displayStudents();

    updateStats();

    updateCourseFilter();

}


/* =========================
   CLOSE MODAL ON OUTSIDE CLICK
========================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "studentModal"
            );


        if (event.target === modal) {

            closeModal();

        }

    }
);


/* =========================
   INITIALIZE APPLICATION
========================= */

displayStudents();

updateStats();

updateCourseFilter();