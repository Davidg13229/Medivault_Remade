$(document).ready(function() {
    // Add and delete items in condition
    $('#add-condition').on('click', function() {
        const container = $('#conditions-container');
        const newCondition = $(`
            <div class="condition-item form-group">
                <label for="conditionName">Condition Name</label>
                <input type="hidden" name="condition_ID[]">
                <input type="text" class="form-control inptborder" name="conditionName[]">
                <label for="diagnoseDate">Date of Diagnose</label>
                <input type="date" class="form-control inptborder" name="diagnoseDate[]">
                <label for="med">Medicine</label>
                <input type="text" class="form-control inptborder" name="med[]">
                <button type="button" class="btn btn-danger btn-sm delete-condition">Delete</button>
            </div>`);
        container.append(newCondition);
        addDeleteConditionEvent(newCondition.find('.delete-condition'));
    });

    $('#conditions-container').on('input', '.condition-name', function() {
        const conditionItem = $(this).closest('.condition-item');
        const conditionName = $(this).val().toUpperCase(); 
        const manipulatedConditionName = conditionName.replace(/\s+/g, '').replace(/[aeiouAEIOU]/g, '').substring(0, 4); 
        conditionItem.find('[name="condition_ID[]"]').val(manipulatedConditionName); // Set manipulated value to hidden input
    });

    function addDeleteConditionEvent(button) {
        button.on('click', function() {
            $(this).closest('.condition-item').remove();
        });
    }

    $('.delete-condition').each(function() {
        addDeleteConditionEvent($(this));
    });

    // Add and delete items in allergy
    $('#add-allergy').on('click', function() {
        const container = $('#allergy-container');
        const newAllergy = $(`
            <div class="allergy-item form-group">
                <label for="allergenName">Allergy Name</label>
                <input type="text" class="form-control inptborder" name="allergenName[]">
                <input type="hidden" name="allergenCode[]">
                <label for="med">Medicine</label>
                <input type="text" class="form-control inptborder" name="allergyMed[]">
                <button type="button" class="btn btn-danger btn-sm delete-allergy">Delete</button>
            </div>`);
        container.append(newAllergy);
        addDeleteAllergyEvent(newAllergy.find('.delete-allergy'));
    });

    $('#allergy-container').on('input', '.allergen-name', function() {
        const allergyItem = $(this).closest('.allergy-item');
        const allergenName = $(this).val().toUpperCase(); 
        const allergenCode = allergenName.replace(/[aeiouAEIOU]/g, '').substring(0, 4); 
        allergyItem.find('[name="allergenCode[]"]').val(allergenCode); 
    });

    function addDeleteAllergyEvent(button) {
        button.on('click', function() {
            $(this).closest('.allergy-item').remove();
        });
    }

    $('.delete-allergy').each(function() {
        addDeleteAllergyEvent($(this));
    });

    // Add and delete items in surgery
    $('#add-surgery').on('click', function() {
        const container = $('#surgery-container');
        const newSurgery = $(`
            <div class="surgery-item form-group">
						<label for="surgeryLoc">Surgery Location</label>
						<input type="text" class="form-control inptborder" name="surgeryLoc[]">
						<div class="d-flex align-items-end">
							<div style="flex: 1;">
								<label for="surgeryType">Type</label>
								<input type="text" class="form-control inptborder" name="surgeryType[]">
							</div>
							<div style="flex: 1; margin-left: 10px;">
								<label for="surgeryDate">Date Conducted</label>
								<input type="date" class="form-control inptborder" name="surgeryYear[]">
                                <input type="hidden" name="surgeryCode[]"> 
							</div>
							<button type="button" class="btn btn-danger btn-sm delete-surgery">Delete</button>
						</div>
					</div>`);
        container.append(newSurgery);
        addDeleteSurgeryEvent(newSurgery.find('.delete-surgery'));
    });

    $('#surgery-container').on('input', '.surgery-type, .surgery-loc', function() {
        const surgeryItem = $(this).closest('.surgery-item');
        const surgeryType = surgeryItem.find('.surgery-type').val().toUpperCase(); // Get and convert surgery type to uppercase
        const surgeryLoc = surgeryItem.find('.surgery-loc').val().toUpperCase(); // Get and convert surgery location to uppercase
        
        const combinedName = surgeryType + surgeryLoc; // Combine surgery type and location
        const surgeryCode = combinedName.replace(/[aeiouAEIOU]/g, '').substring(0, 4); 
        
        surgeryItem.find('[name="surgeryCode[]"]').val(surgeryCode); // Set manipulated value to hidden input
    });


    function addDeleteSurgeryEvent(button) {
        button.on('click', function() {
            $(this).closest('.surgery-item').remove();
        });
    }

    $('.delete-surgery').each(function() {
        addDeleteSurgeryEvent($(this));
    });

    document.getElementById('patientBday').addEventListener('change', function() {
        const birthdate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDifference = today.getMonth() - birthdate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
          age--;
        }

        document.getElementById('patientAge').value = age;
      });

    // back2top
    var backToTop = $('#back2Top');
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    });
    backToTop.click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 600);
        return false;
    });
});

/*PREVIEW*/
document.addEventListener('DOMContentLoaded', function() {
    // Function to populate preview based on form data
    function populatePreview(formData) {
        var previewHtml = '<div><strong>Full Name:</strong> ' + (formData.patientName || '') + '</div>';
        previewHtml += '<div><strong>Birthday:</strong> ' + (formData.patientBday || '') + '</div>';
        previewHtml += '<div><strong>Age:</strong> ' + (formData.patientAge || '') + '</div>';
        previewHtml += '<div><strong>Sex:</strong> ' + (formData.patientSex || '') + '</div>';
        previewHtml += '<div><strong>Religion:</strong> ' + (formData.patientRel || '') + '</div>';
        previewHtml += '<div><strong>Marital Status:</strong> ' + (formData.patientMarStat || '') + '</div>';
        previewHtml += '<div><strong>Occupation:</strong> ' + (formData.patientOccup || '') + '</div>';
        previewHtml += '<div><strong>Phone Number:</strong> ' + (formData.patientPNum || '') + '</div>';
        previewHtml += '<div><strong>Email Address:</strong> ' + (formData.patientEmail || '') + '</div>';
        previewHtml += '<div><strong>Blood Type:</strong> ' + (formData.patientBType || '') + '</div>';
        previewHtml += '<div><strong>Height (cm):</strong> ' + (formData.patientHeight || '') + '</div>';
        previewHtml += '<div><strong>Weight (kg):</strong> ' + (formData.patientWeight || '') + '</div>';
        previewHtml += '<div><strong>PCP\'s Name:</strong> ' + (formData.doctorPDoc || '') + '</div>';
        previewHtml += '<div><strong>PCP\'s Phone Number:</strong> ' + (formData.doctorPNum || '') + '</div>';
        previewHtml += '<div><strong>PCP\'s Email Address:</strong> ' + (formData.doctorPEmail || '') + '</div>';

       // Append Medical Conditions
       previewHtml += '<div class="mt-3"><strong>Medical Conditions:</strong></div>';
       formData.conditionName.forEach(function(condition, index) {
           previewHtml += '<div class="mt-2">';
           previewHtml += '<strong>Condition Name:</strong> ' + condition + '<br>';
           previewHtml += '<strong>Date of Diagnose:</strong> ' + formData.diagnoseDate[index] + '<br>';
           previewHtml += '<strong>Medicine:</strong> ' + formData.med[index];
           previewHtml += '</div>';
       });

        // Append Allergy Conditions
        previewHtml += '<div class="mt-3"><strong>Allergy Conditions:</strong></div>';
        formData.allergenName.forEach(function(allergy, index) {
            previewHtml += '<div class="mt-2">';
            previewHtml += '<strong>Allergy Name:</strong> ' + allergy + '<br>';
            previewHtml += '<strong>Medicine:</strong> ' + formData.allergyMed[index];
            previewHtml += '</div>';
        });

        // Append Surgery Details
        previewHtml += '<div class="mt-3"><strong>Surgery Details:</strong></div>';
        formData.surgeryName.forEach(function(surgery, index) {
            previewHtml += '<div class="mt-2">';
            previewHtml += '<strong>Surgery Location:</strong> ' + formData.surgeryLoc[index] + '<br>';
            previewHtml += '<strong>Type:</strong> ' + formData.surgeryType[index] + '<br>';
            previewHtml += '<strong>Date Conducted:</strong> ' + formData.surgeryDate[index];
            previewHtml += '</div>';
        });

        var previewModalContent = document.getElementById('modal-preview-content');
        if (previewModalContent) {
            previewModalContent.innerHTML = previewHtml;
        } else {
            console.error('Modal preview content element not found.');
        }
    }

    // Event listener for form submission
    $('#medical-history-form').submit(function(event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        var formData = {
            patientName: $('#patientName').val(),
            patientBday: $('#patientBday').val(),
            patientAge: $('#patientAge').val(),
            patientSex: $('#patientSex').val(),
            patientRel: $('#patientRel').val(),
            patientMarStat: $('#patientMarStat').val(),
            patientOccup: $('#patientOccup').val(),
            patientPNum: $('#patientPNum').val(),
            patientEmail: $('#patientEmail').val(),
            patientBType: $('#patientBType').val(),
            patientHeight: $('#patientHeight').val(),
            patientWeight: $('#patientWeight').val(),
            doctorPDoc: $('#doctorPDoc').val(),
            doctorPNum: $('#doctorPNum').val(),
            doctorPEmail: $('#doctorPEmail').val(),
            conditionName: $('[name="conditionName[]"]').map(function() { return $(this).val(); }).get(),
            diagnoseDate: $('[name="diagnoseDate[]"]').map(function() { return $(this).val(); }).get(),
            med: $('[name="med[]"]').map(function() { return $(this).val(); }).get(),
            allergenName: $('[name="allergenName[]"]').map(function() { return $(this).val(); }).get(),
            allergenDiagnoseDate: $('[name="allergenDiagnoseDate[]"]').map(function() { return $(this).val(); }).get(),
            allergyMed: $('[name="allergyMed[]"]').map(function() { return $(this).val(); }).get(),
            surgeryName: $('[name="surgeryName[]"]').map(function() { return $(this).val(); }).get(),
            surgeryLoc: $('[name="surgeryLoc[]"]').map(function() { return $(this).val(); }).get(),
            surgeryType: $('[name="surgeryType[]"]').map(function() { return $(this).val(); }).get(),
            surgeryYear: $('[name="surgeryDate[]"]').map(function() { return $(this).val(); }).get()
        };

        populatePreview(formData);

        // Show the modal
        $('#previewModal').modal('show');
    });

    // Event listener for submit button in preview modal
    $('#submit-button').click(function(event) {
        event.preventDefault(); // Prevent default button action

        // Gather form data (same as above)
        var formData = {
            patientName: $('#patientName').val(),
            patientBday: $('#patientBday').val(),
            patientAge: $('#patientAge').val(),
            patientSex: $('#patientSex').val(),
            patientRel: $('#patientRel').val(),
            patientMarStat: $('#patientMarStat').val(),
            patientOccup: $('#patientOccup').val(),
            patientPNum: $('#patientPNum').val(),
            patientEmail: $('#patientEmail').val(),
            patientBType: $('#patientBType').val(),
            patientHeight: $('#patientHeight').val(),
            patientWeight: $('#patientWeight').val(),
            doctorPDoc: $('#doctorPDoc').val(),
            doctorPNum: $('#doctorPNum').val(),
            doctorPEmail: $('#doctorPEmail').val(),
            conditionName: $('[name="conditionName[]"]').map(function() { return $(this).val(); }).get(),
            condition_ID: $('[name="condition_ID[]"]').map(function() { return $(this).val(); }).get(), // Manipulated condition IDs
            diagnoseDate: $('[name="diagnoseDate[]"]').map(function() { return $(this).val(); }).get(),
            med: $('[name="med[]"]').map(function() { return $(this).val(); }).get(),
            allergenName: $('[name="allergenName[]"]').map(function() { return $(this).val(); }).get(),
            allergenCode: $('[name="allergenCode[]"]').map(function() { return $(this).val(); }).get(), // Manipulated allergen codes
            allergenDiagnoseDate: $('[name="allergenDiagnoseDate[]"]').map(function() { return $(this).val(); }).get(),
            allergyMed: $('[name="allergyMed[]"]').map(function() { return $(this).val(); }).get(),
            surgeryName: $('[name="surgeryName[]"]').map(function() { return $(this).val(); }).get(),
            surgeryLoc: $('[name="surgeryLoc[]"]').map(function() { return $(this).val(); }).get(),
            surgeryType: $('[name="surgeryType[]"]').map(function() { return $(this).val(); }).get(),
            surgeryYear: $('[name="surgeryYear[]"]').map(function() { return $(this).val(); }).get(),
            surgeryCode: $('[name="surgeryCode[]"]').map(function() { return $(this).val(); }).get() // Manipulated surgery codes
        };

        // Perform AJAX request to save data to database
        $.ajax({
            type: 'POST',
            url: '/form', // Update URL to your Node.js endpoint
            data: formData,
            success: function(response) {
                console.log('Data saved successfully:', response);
                alert('Data saved successfully!');
                $('#medical-history-form').trigger('reset');
                $('#previewModal').modal('hide');

                //redirect
                window.location.href = '/home.html'; // Replace with actual homepage URL
            },
            error: function(xhr, status, error) {
                console.error('Error saving data:', error);
                alert('Error occurred while saving data. Please try again.');
            }
        });
    });
});