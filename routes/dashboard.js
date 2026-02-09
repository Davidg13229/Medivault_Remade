const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bodyParser = require('body-parser');
const session = require('express-session');

// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: true }));

// Session setup
router.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
  }));

// Function to format date into YYYY-MM-DD format
function formatDate(dateString) {
    if (!dateString) return null; // Handle null or empty dateString
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        console.error(`Invalid date format for "${dateString}".`);
        return null; // Return null for invalid dates
    }

    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

// Route to handle form submission
router.post('/', async (req, res) => {
    try {
        const loggedInEmail = req.body.loginEmail;

        // Debugging: log the incoming email value
        console.log('Received loginEmail:', loggedInEmail);

        if (!loggedInEmail) {
            throw new Error('Email is required');
        }

        // Store loggedInEmail in session
        req.session.loggedInEmail = loggedInEmail;

        // Debugging: log the session value
        console.log('Session loggedInEmail:', req.session.loggedInEmail);

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Form submission error:', err); // Log the error to the console
        req.flash('error', err.message);
        // res.redirect('/'); // Redirect to home or login page on error
    }
});

// Route to render the dashboard index
router.get('/', async (req, res) => {
    try {
        const loggedInEmail = req.session.loggedInEmail;

        // Debugging: log the session value
        console.log('Session loggedInEmail:', loggedInEmail);

        if (!loggedInEmail) {
            return res.redirect('/'); // Redirect to home or login page if email is not in session
        }

        // Fetch patient data based on email
        const [rows, fields] = await db.query(`
            SELECT *
            FROM patient
            LEFT JOIN doctor ON patient.fk_doctor_ID = doctor.doctor_ID
            LEFT JOIN \`condition\` ON patient.patient_ID = \`condition\`.fk_condition_patient_ID
            LEFT JOIN allergy ON patient.patient_ID = allergy.fk_allergy_patient_ID
            LEFT JOIN surgery ON patient.patient_ID = surgery.fk_surgery_patient_ID
            WHERE patient.patientEmail = ?
            ORDER BY patient.patient_ID
        `, [loggedInEmail]);

        // Map over rows to format dates
        const formattedRows = rows.map(row => ({
            ...row,
            conditionDiagnosis: formatDate(row.conditionDiagnosis),
            surgeryDate: formatDate(row.surgeryDate)
            // Add more date fields as needed
        }));

        // Log the result to the console
        console.log('Rows:', rows);

        res.render('dashboard/index', { data: formattedRows });
    } catch (err) {
        console.error('Query error:', err); // Log the error to the console
        req.flash('error', err.message);
        res.render('dashboard/index', { data: [] }); // Empty array if error
    }
});

// // Route to render the dashboard index
// router.get('/', async (req, res) => {
//     try {
//         // const [rows, fields] = await db.query(`
//         //     SELECT patient.*, doctor.doctorPDoc, doctor.doctorPNum, doctor.doctorPEmail, 
//         //            \`condition\`.conditionName, \`condition\`.conditionDiagnosis, \`condition\`.conditionMed, 
//         //            allergy.allergenName, allergy.allergenMed, 
//         //            surgery.surgeryLoc, surgery.surgeryName, surgery.surgeryDate
//         //     FROM patient
//         //     LEFT JOIN doctor ON patient.fk_doctor_ID = doctor.doctor_ID
//         //     LEFT JOIN \`condition\` ON patient.patient_ID = \`condition\`.fk_condition_patient_ID
//         //     LEFT JOIN allergy ON patient.patient_ID = allergy.fk_allergy_patient_ID
//         //     LEFT JOIN surgery ON patient.patient_ID = surgery.fk_surgery_patient_ID
//         //     ORDER BY patient.patient_ID DESC
//         // `);

//         const [rows, fields] = await db.query(`
//             SELECT *
//                 FROM patient, doctor, \`condition\`, allergy, surgery
//                 WHERE patient.fk_doctor_ID = doctor.doctor_ID AND 
//                 patient.patient_ID = \`condition\`.fk_condition_patient_ID
//                 AND patient.patient_ID = allergy.fk_allergy_patient_ID
//                 AND patient.patient_ID = surgery.fk_surgery_patient_ID
//                 ORDER BY patient.patient_ID
//         `);

//         // Map over rows to format dates
//         const formattedRows = rows.map(row => ({
//             ...row,
//             conditionDiagnosis: formatDate(row.conditionDiagnosis),
//             surgeryDate: formatDate(row.surgeryDate)
//             // Add more date fields as needed
//         }));


//         // Log the result to the console
//         console.log('Rows:', rows);

//         res.render('dashboard/index', { data: formattedRows });
//     } catch (err) {
//         console.error('Query error:', err); // Log the error to the console
//         req.flash('error', err);
//         res.render('dashboard/index', { data: [] }); // Empty array if error
//     }
// });



// Route to render the settings page
router.get('/settings', (req, res) => {
    res.render('dashboard/settings');
});

 router.get('/edit', (req, res) => {
    res.render('dashboard/edit');
}); 

module.exports = router;
