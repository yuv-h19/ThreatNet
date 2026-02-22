function validateForm() {
// Get form values
  let severity = parseInt(document.getElementById("severity").value);
  let description = document.getElementById("description").value;
  let dateValue = document.getElementById("firstObserved").value;

  // 1. Check that severity is between 1 and 10
  if (isNaN(severity) ||severity < 1 || severity > 10) {
    alert("Severity must be a number between 1 and 10.");
    document.getElementById("severity").focus();
    return false;
  }

  // 2. If severity is 7 or higher, description is required
    if (severity >= 7 && description.trim() === "") {
        alert("Severity is 7 or higher. A description is mandatory.");
        document.getElementById("description").focus();
        return false; 
    }

  // 2. Description length validation (50–1000 characters)
     if (description.trim() !== "") {
        if (description.length < 50 || description.length > 1000) {
            alert("The description must be between 50 and 1000 characters.");
            document.getElementById("description").focus();
            return false;        
        }  
    }

  // 3. Check that a date was selected (required)
  if (dateValue === "") {
    alert("First observed date is required.");
    document.getElementById("firstObserved").focus();
    return false;
  }

  // 3. Check that the date is not in the future
 // Create date objects
  let selectedDate = new Date(dateValue);
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // Define minimum allowed date: January 1, 2000
  let minDate = new Date("2000-01-01");

  // 3. Check date range: from 2000 until today
  if (selectedDate < minDate || selectedDate >= today) {
    alert("First observed date must be between the year 2000 and today.");
    document.getElementById("firstObserved").focus();
    return false;
  }

  // 4. Optional in JAVA or in HTML 
  let country = document.getElementById("targetCountry").value; 
  // 5. Country code validation (replaces pattern)
  // Must be exactly 2 uppercase letters
  let countryRegex = /^[A-Z]{2}$/;

  if (country === "") {
    alert("Target country code is required.");
    document.getElementById("targetCountry").focus();
    return false;
  }

  if (!countryRegex.test(country)) {
    alert("Target country code must be two uppercase letters (e.g. US, IL).");
    document.getElementById("targetCountry").focus();
    return false;
  }
  return true;
}