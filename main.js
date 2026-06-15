
// Redirect unauthenticated users away from protected pages,
// but don't redirect when already on the login page.
// if (!localStorage.getItem('authToken') && !/\/?login\.html$/.test(window.location.pathname)) {
//   window.location.href = 'login.html';
// }

(function () {
  const STORAGE_KEY = 'hplFontScale';
  const STEP = 0.1;
  const MIN = 0.8;
  const MAX = 1.5;

  function clamp(value) {
    return Math.min(MAX, Math.max(MIN, value));
  }

  function applyFontScale(value) {
    const scale = clamp(value);
    document.documentElement.style.setProperty('--font-scale', scale.toFixed(2));
    localStorage.setItem(STORAGE_KEY, scale.toFixed(2));
  }

  function getCurrentScale() {
    const stored = parseFloat(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(stored) ? clamp(stored) : 1;
  }

  function changeFontSize(direction) {
    applyFontScale(getCurrentScale() + direction * STEP);
  }

  window.changeFontSize = changeFontSize;
  applyFontScale(getCurrentScale());
})();

 function exportExcel() {
  var table = document.getElementById("summaryTable");
  var rows = table.querySelectorAll("tr");
  var csv = [];

  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].querySelectorAll("td, th");
    var row = [];

    for (var j = 0; j < cols.length; j++) {
      var input = cols[j].querySelector("input");
      var data;
      if (input) {
        // Combine static text with input value
        var text = cols[j].innerText.replace(input.value, "").trim();
        data = text + " " + input.value;
      } else {
        data = cols[j].innerText;
      }
      row.push('"' + data.replace(/"/g, '""') + '"');
    }

    csv.push(row.join(","));
  }

  var csvString = csv.join("\n");
  var blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);

  var fileName = prompt("Enter file name:");
  if (!fileName) {
    return; // stop if user cancels
  }

  // If running as an EXE (pywebview), use the Python Bridge for reliable saving
  if (window.pywebview && window.pywebview.api) {
    window.pywebview.api.save_file(csvString, fileName + ".csv");
    return;
  }

  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName + ".csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  // Delay removal slightly to ensure the browser registers the download
  setTimeout(() => document.body.removeChild(link), 100);
}


// Dynamically update navigation for authenticated users
document.addEventListener('DOMContentLoaded', () => {
  const authLinks = document.querySelectorAll('a[href="login.html"]');
  const isLoggedIn = !!localStorage.getItem('authToken');
  
  authLinks.forEach(link => {
    if (isLoggedIn) {
      link.textContent = 'Logout';
      link.href = '#';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
      });
    }
  });
});
    const solids = [
      { id: 'solid1', name: 'Q 13', color: '#fcf8f1',  },
      { id: 'solid5', name: 'RC 15', color: '#f7df37' },
      { id: 'solid6', name: 'Q 17', color: '#f9f1e5' },
      { id: 'solid7', name: 'Q 601', color: '#fdfdfd' },
      { id: 'solid8', name: 'Q 603', color: '#232a2d' },
      { id: 'solid9', name: 'RC 605', color: '#582730' },
      { id: 'solid10', name: 'RC 606', color: '#4a4e4a' },
      { id: 'solid11', name: 'RC 617', color: '#9baa72' },
      { id: 'solid12', name: 'RC 720', color: '#ffffff' },
      { id: 'solid13', name: 'Q 801', color: '#8b8d88' },
      { id: 'solid14', name: 'Q 851', color: '#f8f6f4' },
      { id: 'solid4', name: 'RC 853', color: '#1677b9' },
      { id: 'solid15', name: 'Q 855', color: '#f9f0dd' },
      { id: 'solid16', name: 'Q 856', color: '#fefef4' },
      { id: 'solid17', name: 'RC 857', color: '#ec763f' },
      { id: 'solid18', name: 'RC 859', color: '#f4e8d9' },
      { id: 'solid19', name: 'Q 860', color: '#e8e8e6' },
      { id: 'solid20', name: 'Q 861', color: '#a7a59d' },
      { id: 'solid21', name: 'Q 862', color: '#6a665f' },
      { id: 'solid2', name: 'RC 864', color: '#f4a832' },
      { id: 'solid3', name: 'Q 865', color: '#c1cf69' },
      { id: 'solid22', name: 'Q 867', color: '#b1c3d7' },
      { id: 'solid23', name: 'RC 869', color: '#007b3e' },
      { id: 'solid24', name: 'RC 872', color: '#e21a37' },
      { id: 'solid25', name: 'Q 873', color: '#586061' },
      { id: 'solid26', name: 'Q 879', color: '#b7a593' },
      { id: 'solid27', name: 'RC 884', color: '#72adf5' },
      { id: 'solid28', name: 'RC 885', color: '#c3c5be' },
      { id: 'solid29', name: 'Q 886', color: '#e0dad7' },
      { id: 'solid30', name: 'Q 887', color: '#989898' },
      { id: 'solid31', name: 'Q 888', color: '#cbbeb3' },
      { id: 'solid32', name: 'Q 889', color: '#474747' }
    ];

  function buildPalette() {
      const paletteContainer = document.getElementById('shadePalette');
      if (!paletteContainer) return;
      solids.forEach(solid => {
        const swatch = document.createElement('div');
        swatch.style.width = '24px';
        swatch.style.height = '24px';
        swatch.style.backgroundColor = solid.color;
        swatch.style.border = '1px solid #ccc';
        swatch.style.borderRadius = '3px';
        swatch.style.cursor = 'pointer';
        swatch.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        swatch.title = solid.name;
        swatch.onclick = () => {
          const target = document.querySelector('input[name="colorTarget"]:checked');
          if (target) {
            document.getElementById(target.value).value = solid.color;
            calculate();
          }
        };
        paletteContainer.appendChild(swatch);
      });
    }
  // Supabase configuration: ensure the CDN <script> is included in your HTML
  // before this file, or import `createClient` as an ES module instead.
  const supabaseUrl = "https://ijnqtrmhvrphwwwiqhkl.supabase.co";
  const supabaseKey = "sb_publishable_Xs8LhB0UU7-8ttz8lE7iGg_dI_8GEuc";
  let supabaseClient = null;
  if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  } else if (typeof createClient === 'function') {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn('Supabase client not initialized. Include the CDN script before main.js or import createClient.');
  }