// Handle dropdown toggle
document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
      if (menu !== toggle.nextElementSibling) menu.classList.remove('show');
    });
    // Toggle current dropdown
    toggle.nextElementSibling.classList.toggle('show');
  });
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(e) {
  document.querySelectorAll('.dropdown').forEach(function(dropdown) {
    if (!dropdown.contains(e.target)) {
      dropdown.querySelector('.dropdown-menu').classList.remove('show');
    }
  });
});
