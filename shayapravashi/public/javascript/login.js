// login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include"
        });

        const data = await res.json();
        if (res.ok) {
          alert("Login successful!");

          // Store user information
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userRole', data.role || 'user');
          localStorage.setItem('userName', data.username || 'User');

          // Route based on role
          if (data.role === "admin") {
            window.location.href = "/admin.html";
          } else {
            window.location.href = "/dashboard.html"; // User dashboard
          }
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await fetch("/auth/logout", {
        credentials: "include"
      });
      alert("Logged out!");
      window.location.href = "/login.html";
    });
  }
});
