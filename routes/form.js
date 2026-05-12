const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// Compute age based on birthday
function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    } 
    return age;
}

/* $('#allergy-container').on('input', '.allergen-name', function() {
    const allergyItem = $(this).closest('.allergy-item');
    const allergenName = $(this).val().toUpperCase(); 
    const allergenCode = allergenName.replace(/[aeiouAEIOU]/g, '').substring(0, 4); 
    allergyItem.find('[name="allergenCode[]"]').val(allergenCode); 
}); */


// Utility function to replace undefined with null
function handleUndefined(value) {
    return value === undefined || value === '' ? null : value;
}

// Handle POST request to /form
router.post('/', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const {
            patientName, patientBday, patientSex, patientRel, patientMarStat, patientOccup,
            patientPNum, patientEmail, patientPass, patientBType = null, patientHeight, patientWeight, fk_doctor_ID = null, doctorPDoc, doctorPNum,
            doctorPEmail, conditions = [], allergies = [], surgeries = []
        } = req.body;

        // Validate required fields
        if (!patientName || !patientBday || !patientSex || !patientRel || !patientMarStat || !patientOccup || !patientPNum || !patientEmail || !patientHeight || !patientWeight) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate patient age
        const patientAge = calculateAge(patientBday);

        // Start a transaction
        await connection.beginTransaction();

        // Insert patient query
        const insertPatientQuery = `
            INSERT INTO patient (
                patientName, patientBday, patientAge, patientSex, patientRel, 
                patientMarStat, patientOccup, patientPNum, patientEmail, patientBType, patientHeight, patientWeight, fk_doctor_ID
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Replace undefined values with null in the parameter array
        const params = [
            patientName, patientBday, patientAge, patientSex, patientRel, patientMarStat, patientOccup,
            patientPNum, patientEmail, handleUndefined(patientBType), patientHeight, patientWeight, handleUndefined(fk_doctor_ID)
        ];

        // Look up or insert doctor information
        let doctor_Id = handleUndefined(fk_doctor_ID);
        if (doctorPDoc || doctorPNum || doctorPEmail) {
            // Check if the doctor exists, allowing null values
            let query = 'SELECT doctor_ID FROM doctor WHERE 1=1';
            let queryParams = [];
        
            if (doctorPDoc) {
                query += ' AND doctorPDoc = ?';
                queryParams.push(doctorPDoc);
            } else {
                query += ' AND doctorPDoc IS NULL';
            }
        
            if (doctorPNum) {
                query += ' AND doctorPNum = ?';
                queryParams.push(doctorPNum);
            } else {
                query += ' AND doctorPNum IS NULL';
            }
        
            if (doctorPEmail) {
                query += ' AND doctorPEmail = ?';
                queryParams.push(doctorPEmail);
            } else {
                query += ' AND doctorPEmail IS NULL';
            }
        
            const [doctorResult] = await connection.execute(query, queryParams);
        
            if (doctorResult.length > 0) {
                doctor_Id = doctorResult[0].doctor_ID;
            } else {
                // Insert new doctor, handling null values
                const [insertDoctorResult] = await connection.execute(
                    'INSERT INTO doctor (doctorPDoc, doctorPNum, doctorPEmail) VALUES (?, ?, ?)',
                    [doctorPDoc || null, doctorPNum || null, doctorPEmail || null]
                );
                doctor_Id = insertDoctorResult.insertId;
            }
        }
        
        // Update params with the correct doctor ID
        params[params.length - 1] = doctor_Id;

        // Execute patient insertion
        const [insertPatientResult] = await connection.execute(insertPatientQuery, params);
        const patientId = insertPatientResult.insertId;


        // Process conditions if provided
        for (const condition of conditions) {
            const { conditionName, diagnoseDate, med } = condition;

            // Generate condition_ID from conditionName abbreviation
            const conditionID = conditionName.slice(0, 4).toUpperCase();


            const insertConditionQuery = `
                INSERT INTO \`condition\` (fk_condition_patient_ID, condition_ID, conditionName, conditionDiagnosis, conditionMed)
                VALUES (?, ?, ?, ?, ?)
            `;
            try {
                await connection.execute(insertConditionQuery, [
                    patientId, conditionID, handleUndefined(conditionName), handleUndefined(diagnoseDate), handleUndefined(med)
                ]);
                console.log('Condition inserted successfully:', conditionName);
            } catch (error) {
                console.error('Error inserting condition:', error);
                throw error; // Rethrow the error to be caught higher up if needed
            }
        }

        // Process allergies if provided
        for (const allergy of allergies) {
            const { allergenName, allergyMed } = allergy;

            // Generate allergy_ID from allergenName abbreviation
            const allergyID = allergenName.slice(0, 4).toUpperCase();

            const insertAllergyQuery = `
                INSERT INTO allergy (fk_allergy_patient_ID, allergen_Code, allergenName, allergenMed)
                VALUES (?, ?, ?, ?)
            `;
            try {
                await connection.execute(insertAllergyQuery, [
                    patientId, allergyID, handleUndefined(allergenName), handleUndefined(allergyMed)
                ]);
                console.log('Allergy inserted successfully:', allergenName);
            } catch (error) {
                console.error('Error inserting allergy:', error);
                throw error; // Rethrow the error to be caught higher up if needed
            }
        }

        // Process surgeries if provided
        for (const surgery of surgeries) {
            const { surgeryLoc, surgeryType, surgeryDate } = surgery;

            // Generate surgery_ID from surgeryLoc abbreviation
            const surgeryID = surgeryLoc.slice(0, 4).toUpperCase();

            const insertSurgeryQuery = `
                INSERT INTO surgery (fk_surgery_patient_ID, surgery_Code, surgeryLoc, surgeryName, surgeryDate)
                VALUES (?, ?, ?, ?, ?)
            `;
            try {
                await connection.execute(insertSurgeryQuery, [
                    patientId, surgeryID, handleUndefined(surgeryLoc), handleUndefined(surgeryType), handleUndefined(surgeryDate)
                ]);
                console.log('Surgery inserted successfully:', surgeryType);
            } catch (error) {
                console.error('Error inserting surgery:', error);
                throw error; // Rethrow the error to be caught higher up if needed
            }
        }

        // Commit the transaction
        await connection.commit();
        // res.status(200).json({ message: 'Form submitted successfully!' });

        // Redirect to index.html after 5 seconds
        setTimeout(() => {
            res.redirect('/'); // Assuming you're using Express
        }, 5000); // 5000 milliseconds = 5 seconds

    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error('Error handling form submission:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    } finally {
        // Release the connection if it was acquired
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;