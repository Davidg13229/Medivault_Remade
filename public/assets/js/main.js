$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {

    });
});
// Function to enable inputs based on section
function enableInputs(section) {
    let inputs = [];
    if (section === 'personal') {
        inputs = document.querySelectorAll('.mprofile input');
    } else if (section === 'account') {
        // Retrieve current values before enabling inputs
        const emailInput = document.getElementById('emailInput');
        const phoneInput = document.getElementById('phoneInput');
        const passwordInput = document.getElementById('passwordInput');

        // Store current values as data attributes
        emailInput.setAttribute('data-previous-value', emailInput.value);
        phoneInput.setAttribute('data-previous-value', phoneInput.value);
        passwordInput.setAttribute('data-previous-value', passwordInput.value);

        // Enable all inputs in account section
        inputs = document.querySelectorAll('.sprofile input, .sprofile button'); 

        // Also enable the password input separately
        document.getElementById('passwordInput').disabled = false;
    }

    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });

    // Change button text based on state
    const editButton = section === 'personal' ? document.querySelector('.mprofile button') : document.querySelector('.sprofile button');
    if (editButton.textContent === 'Edit') {
        editButton.textContent = 'Save';
    } else {
        editButton.textContent = 'Edit';
        // Here you would typically save the data to the database
        saveData(section);
    }
}

// Function to ask for current password for account information
function askForCurrentPassword() {
    const currentPassword = prompt('Please enter your current password:');
    if (currentPassword) {
        // Simulate checking current password (replace with actual validation)
        const currentPasswordFromDatabase = "abc123"; // Replace with actual password fetched from database
        if (currentPassword === currentPasswordFromDatabase) {
            enableAccountEdit();
        } else {
            alert('Incorrect password. Please try again.');
        }
    } else {
        alert('Current password is required to edit account information.');
    }
}

// Function to enable account edit mode
function enableAccountEdit() {
    const accountInputs = document.querySelectorAll('.sprofile input');
    const newPasswordFields = document.getElementById('newPasswordFields');
    const saveButton = document.querySelector('.sprofile button:nth-of-type(2)'); // Selects the second button (Save)

    // Enable all inputs in account section
    accountInputs.forEach(input => {
        input.disabled = false;
    });

    // Show new password fields and save button
    newPasswordFields.style.display = 'block';
    saveButton.style.display = 'inline-block';
}

// Function to save account changes
function saveAccountChanges() {
    const data = {
        email: document.getElementById('emailInput').value,
        phone: document.getElementById('phoneInput').value,
        password: document.getElementById('passwordInput').value,
        newPassword: document.getElementById('newPasswordInput').value
    };

    // Simulate API call or save to database
    console.log('Saving account changes:', data);

    // Reset fields and disable inputs after saving
    const accountInputs = document.querySelectorAll('.sprofile input');
    accountInputs.forEach(input => {
        input.value = ''; // Clear input values
        input.disabled = true;
    });

    // Reset password fields
    document.getElementById('passwordInput').value = '';
    document.getElementById('newPasswordInput').value = '';

    // Hide new password fields and save button after saving
    document.getElementById('newPasswordFields').style.display = 'none';
    document.querySelector('.sprofile button:nth-of-type(2)').style.display = 'none';
}

// Function to save data (simulate saving to database)
function saveData(section) {
    let data = {};
    if (section === 'personal') {
        data = {
            name: document.getElementById('nameInput').value,
            birthday: document.getElementById('birthdayInput').value,
            religion: document.getElementById('religionInput').value,
            maritalStatus: document.getElementById('maritalStatusInput').value
        };
    } else if (section === 'account') {
        data = {
            email: document.getElementById('emailInput').value,
            phone: document.getElementById('phoneInput').value,
            password: document.getElementById('passwordInput').value
        };
    }

    // Simulate API call or save to database
    console.log('Saving data:', data);
}

function askForCurrentPasswordd() {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmDelete) {
        const currentPassword = prompt('Please enter your password to confirm account deletion:');
        if (currentPassword) {
            // Simulate checking current password (replace with actual validation)
            const currentPasswordFromDatabase = "abc123"; // Replace with actual password fetched from database

            if (currentPassword === currentPasswordFromDatabase) {
                // Password is correct, proceed with deletion
                deleteAccount();
            } else {
                // Incorrect password
                alert('Incorrect password. Account deletion cancelled.');
            }
        } else {
            // User cancelled password prompt
            alert('Password is required to confirm account deletion.');
        }
    } else {
        // User cancelled account deletion
        console.log('Account deletion cancelled.');
    }
}

// Function to delete account (simulated)
function deleteAccount() {
    // Simulate API call to delete account and associated records
    console.log('Deleting account and associated records...');

    // Simulated success message
    alert('Account deleted successfully.');

    // Optionally redirect or perform other actions after deletion
    window.location.href = "home.html";// Redirect to homepage or another appropriate URL
}