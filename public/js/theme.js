// Theme handling
(function() {
  const THEME_KEY = 'portfolio_theme_mode';
  const body = document.body;
  const themeBtnRetro = document.getElementById('themeToggleBtn'); // Retro button
  const themeBtnJournal = document.getElementById('themeToggleBtnJournal'); // Journal button
  const themeIconRetro = themeBtnRetro ? themeBtnRetro.querySelector('i') : null; // Retro icon
  const themeIconJournal = themeBtnJournal ? themeBtnJournal.querySelector('i') : null; // Journal icon

  // Helper to set theme mode
  function setThemeMode(mode) {
    // Check if at least one button/icon pair exists
    if ((!themeBtnRetro || !themeIconRetro) && (!themeBtnJournal || !themeIconJournal)) return;

    body.classList.remove('retro-mode', 'journalized-mode');
    body.classList.add(mode);
    localStorage.setItem(THEME_KEY, mode);
    updateThemeBtn();
  }

  // --- Theme Toggle Logic ---
  function handleThemeToggle() {
    const current = body.classList.contains('journalized-mode') ? 'journalized-mode' : 'retro-mode';
    setThemeMode(current === 'retro-mode' ? 'journalized-mode' : 'retro-mode');
  }

  // Add listener to both buttons (if they exist)
  if (themeBtnRetro) {
    themeBtnRetro.addEventListener('click', handleThemeToggle);
  }
  if (themeBtnJournal) {
    themeBtnJournal.addEventListener('click', handleThemeToggle);
  }

  // Update button label/icon
  function updateThemeBtn() {
    const isJournal = body.classList.contains('journalized-mode');
    const newTitle = isJournal ? 'Switch to Hacker Mode' : 'Switch to Journal Mode';

    // Update Retro Button (if exists)
    if (themeBtnRetro && themeIconRetro) {
      themeBtnRetro.title = newTitle;
      if (isJournal) {
        themeBtnRetro.classList.remove('shell');
        themeBtnRetro.classList.add('journal'); // Keep class consistent even if hidden
        themeIconRetro.classList.remove('fa-moon');
        themeIconRetro.classList.add('fa-sun');
      } else {
        themeBtnRetro.classList.remove('journal');
        themeBtnRetro.classList.add('shell');
        themeIconRetro.classList.remove('fa-sun');
        themeIconRetro.classList.add('fa-moon');
      }
    }

    // Update Journal Button (if exists)
    if (themeBtnJournal && themeIconJournal) {
      themeBtnJournal.title = newTitle;
      if (isJournal) {
        themeBtnJournal.classList.remove('shell');
        themeBtnJournal.classList.add('journal');
        themeIconJournal.classList.remove('fa-moon');
        themeIconJournal.classList.add('fa-sun');
      } else {
        themeBtnJournal.classList.remove('journal');
        themeBtnJournal.classList.add('shell'); // Keep class consistent even if hidden
        themeIconJournal.classList.remove('fa-sun');
        themeIconJournal.classList.add('fa-moon');
      }
    }
  }

  // On load, apply persisted theme
  function init() {
    let theme = localStorage.getItem(THEME_KEY);
    if (!theme) theme = 'retro-mode';
    setThemeMode(theme);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
