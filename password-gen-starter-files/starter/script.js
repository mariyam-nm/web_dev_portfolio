document.addEventListener("DOMContentLoaded", function () {
  var generateButton = document.getElementById("generate");
  generateButton.addEventListener("click", generatePassword);

  function generatePassword() {
    var charCount = prompt("How many characters would you like your password to contain? (Maximum: 128)");

    if (charCount === null || charCount === "") {
      return;
    }

    charCount = parseInt(charCount);

    if (isNaN(charCount) || charCount < 8 || charCount > 128) {
      alert("Please enter a valid number between 8 and 128.");
      return;
    }

    var includeSpecialChars = confirm("Click OK to confirm including special characters");
    var includeNumericChars = confirm("Click OK to confirm including numeric characters");

    var password = generate(charCount, includeSpecialChars, includeNumericChars);

    var passwordTextArea = document.getElementById("password");
    passwordTextArea.value = password;
  }

  function generate(length, specialChars, numericChars) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var specialCharset = "@%+\\/'!#$^?:)(}{][~-_.";
    var numericCharset = "0123456789";
    var password = "";

    if (specialChars) {
      charset += specialCharset;
    }
    if (numericChars) {
      charset += numericCharset;
    }

    for (var i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }
});