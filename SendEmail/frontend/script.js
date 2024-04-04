document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.text();
    alert(data);

    // Show OTP verification section
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('otpVerification').style.display = 'block';
  } catch (err) {
    console.error('Error:', err);
  }
});

document.getElementById('verifyOTP').addEventListener('click', async () => {
  const otp = document.getElementById('otp').value;

  try {
    const response = await fetch('http://localhost:5000/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();
    if (data.success) {
      window.location.href = `valid.html?name=${data.user.name}`;
    } else {
      window.location.href = 'invalid.html';
    }
  } catch (err) {
    console.error('Error:', err);
  }
});
