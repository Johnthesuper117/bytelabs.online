// Handle dropdown toggle with centered positioning and persistent open state.
// Clicking a .dropdown-toggle will open its menu, center it under the toggle,
// and leave it open until the same toggle is clicked again or another toggle is
// clicked (which will close others). We intentionally do NOT auto-close when
// clicking outside so menus remain until explicitly toggled or the page reloads.
document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
  function toggleMenuEvent(e) {
    if (e && e.preventDefault) e.preventDefault();

    const menu = toggle.nextElementSibling;
    if (!menu) return;

    // Close other dropdowns first and reset their ARIA state
    document.querySelectorAll('.dropdown-menu').forEach(function(m) {
      if (m !== menu) {
        m.classList.remove('show');
        const otherToggle = m.previousElementSibling;
        if (otherToggle && otherToggle.classList.contains('dropdown-toggle')) {
          otherToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    const isOpen = menu.classList.contains('show');
    if (isOpen) {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }

    // ensure menu has an id for aria-controls
    if (!menu.id) menu.id = 'dropdown-menu-' + Math.random().toString(36).slice(2, 9);
    toggle.setAttribute('aria-controls', menu.id);

    // compute left offset so the menu is centered under the toggle and clamped to viewport
    const li = toggle.parentElement; // the .dropdown <li>
    if (!li) {
      menu.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      return;
    }

    // Temporarily show for measurement without flashing to user
    const prevDisplay = menu.style.display;
    const prevVisibility = menu.style.visibility;
    menu.style.display = 'block';
    menu.style.visibility = 'hidden';

    const liRect = li.getBoundingClientRect();
    const toggleRect = toggle.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    // desired absolute (viewport) left to center menu under toggle
    let absLeft = toggleRect.left + (toggleRect.width - menuWidth) / 2;
    const margin = 8; // small viewport margin
    if (absLeft < margin) absLeft = margin;
    if (absLeft + menuWidth > viewportWidth - margin) absLeft = Math.max(margin, viewportWidth - menuWidth - margin);

    const leftRelativeToLi = absLeft - liRect.left;
    menu.style.left = leftRelativeToLi + 'px';

    // restore and show
    menu.style.visibility = prevVisibility || '';
    menu.style.display = prevDisplay || '';
    menu.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
  }

  // click toggles
  toggle.addEventListener('click', toggleMenuEvent);

  // support keyboard: Enter and Space should toggle as well
  toggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenuEvent(e);
    }
  });
  // ensure ARIA defaults are present
  if (!toggle.hasAttribute('aria-haspopup')) toggle.setAttribute('aria-haspopup', 'true');
  if (!toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');
});

// Small accessibility / UX helpers:
// - Close open menu on Escape
// - Re-position any open menu when window resizes
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.dropdown-menu.show').forEach(function(menu) {
      menu.classList.remove('show');
      const t = menu.previousElementSibling;
      if (t && t.classList.contains('dropdown-toggle')) t.setAttribute('aria-expanded', 'false');
    });
  }
});

window.addEventListener('resize', function() {
  // reposition any open menu so it stays viewport-clamped
  document.querySelectorAll('.dropdown-menu.show').forEach(function(menu) {
    const toggle = menu.previousElementSibling;
    const li = toggle ? toggle.parentElement : null;
    if (!toggle || !li) return;

    // measure and apply same logic as when opening
    menu.style.display = 'block';
    menu.style.visibility = 'hidden';
    const liRect = li.getBoundingClientRect();
    const toggleRect = toggle.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const margin = 8;
    let absLeft = toggleRect.left + (toggleRect.width - menuWidth) / 2;
    if (absLeft < margin) absLeft = margin;
    if (absLeft + menuWidth > viewportWidth - margin) absLeft = Math.max(margin, viewportWidth - menuWidth - margin);
    const leftRelativeToLi = absLeft - liRect.left;
    menu.style.left = leftRelativeToLi + 'px';
    menu.style.visibility = '';
    menu.style.display = '';
  });
});
