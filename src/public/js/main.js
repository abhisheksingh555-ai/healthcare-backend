// Auto-dismiss alerts after 5 seconds
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => alert.remove(), 5000);
});

// Confirm delete on forms with data-confirm attribute
document.querySelectorAll('[data-confirm]').forEach(el => {
  el.addEventListener('submit', e => {
    if (!confirm(el.dataset.confirm)) e.preventDefault();
  });
});
