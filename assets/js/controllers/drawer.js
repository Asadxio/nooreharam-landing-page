// Mobile Menu Drawer UI Controller
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('mobileDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
});

function closeDrawer() {
  document.getElementById('mobileDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}



export { closeDrawer };
