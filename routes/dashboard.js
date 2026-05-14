const express = require('express');
const router = express.Router();
const db = require('../config/database.js');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: true }));

function requireAuth(req, res, next) {
    if (!req.session || !req.session.loggedInEmail) {
        return res.redirect('/');
    }
    next();
}

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
        const { loginEmail, loginPassword } = req.body;

        console.log('Received loginEmail:', loginEmail);

        if (!loginEmail || !loginPassword) {
            throw new Error('Email and password are required');
        }

        const [rows] = await db.query(
            'SELECT patientPass FROM patientacc WHERE patientEmail = ?',
            [loginEmail]
        );

        if (rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const hashedPassword = rows[0].patientPass;
        const passwordMatch = await bcrypt.compare(loginPassword, hashedPassword);

        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }

        req.session.loggedInEmail = loginEmail;
        console.log('Session loggedInEmail:', req.session.loggedInEmail);

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Form submission error:', err);
        req.flash('error', err.message);
        res.redirect('/');
    }
});

// Route to render the dashboard index
router.get('/', requireAuth, async (req, res) => {
    try {
        const loggedInEmail = req.session.loggedInEmail;

        console.log('Session loggedInEmail:', loggedInEmail);

        // Fetch patient data based on email
        const [rows, fields] = await db.query(`
            SELECT *
            FROM patientacc
            JOIN patient ON patientacc.account_ID = patient.fk_PatientAcc_ID
            LEFT JOIN doctor ON patient.fk_doctor_ID = doctor.doctor_ID
            LEFT JOIN \`condition\` ON patient.patient_ID = \`condition\`.fk_condition_patient_ID
            LEFT JOIN allergy ON patient.patient_ID = allergy.fk_allergy_patient_ID
            LEFT JOIN surgery ON patient.patient_ID = surgery.fk_surgery_patient_ID
            WHERE patientacc.patientEmail = ?
            ORDER BY patient.patient_ID
        `, [loggedInEmail]);

        // If no patient data found, redirect to form
        if (rows.length === 0) {
            return res.redirect('/form');
        }

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
router.get('/settings', requireAuth, (req, res) => {
    res.render('dashboard/settings');
});

router.get('/edit', requireAuth, (req, res) => {
    res.render('dashboard/edit');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;
