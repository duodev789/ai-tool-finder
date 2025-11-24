// Vanilla JS AI Tool Finder
const categoriesDiv = document.getElementById('categories');
const toolsDiv = document.getElementById('tools');
const searchInput = document.getElementById('search');
let allData = {};
let categories = [];
let selectedCategory = '';

function renderCategories(filter = '') {
  categoriesDiv.innerHTML = '';
  const filtered = categories.filter(cat => cat.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (cat === selectedCategory ? ' selected' : '');
    btn.textContent = cat;
    btn.onclick = () => {
      selectedCategory = cat;
      renderCategories(searchInput.value);
      renderTools();
    };
    categoriesDiv.appendChild(btn);
  });
  // Auto-select first if none
  if (!selectedCategory && filtered.length > 0) {
    selectedCategory = filtered[0];
    renderCategories(filter);
    renderTools();
  }
}

function renderTools() {
  toolsDiv.innerHTML = '';
  if (!selectedCategory || !allData[selectedCategory]) return;
  allData[selectedCategory].forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    // Header: name and link
    const header = document.createElement('div');
    header.className = 'tool-header';
    const title = document.createElement('span');
    title.className = 'tool-title';
    title.textContent = tool.name || '';
    header.appendChild(title);
    if (tool.link && tool.link.startsWith('http')) {
      const link = document.createElement('a');
      link.className = 'tool-link';
      link.href = tool.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = tool.link;
      header.appendChild(link);
    }
    card.appendChild(header);
    // Description
    if (tool.description) {
      const desc = document.createElement('div');
      desc.className = 'tool-desc';
      desc.textContent = tool.description;
      card.appendChild(desc);
    }
    // Iframe preview
    if (tool.link && tool.link.startsWith('http')) {
      const iframe = document.createElement('iframe');
      iframe.className = 'tool-iframe';
      iframe.src = tool.link;
      iframe.title = tool.name || 'Preview';
      iframe.loading = 'lazy';
      iframe.sandbox = 'allow-scripts allow-same-origin allow-popups';
      card.appendChild(iframe);
    }
    toolsDiv.appendChild(card);
  });
}

fetch('data.json')
  .then(res => res.json())
  .then(json => {
    allData = json;
    categories = Object.keys(json).sort((a, b) => a.localeCompare(b));
    selectedCategory = categories[0] || '';
    renderCategories();
    renderTools();
  });

const clearBtn = document.getElementById('clear-search');
searchInput.addEventListener('input', e => {
  renderCategories(e.target.value);
  if (clearBtn) {
    clearBtn.style.display = e.target.value ? 'flex' : 'none';
  }
});

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
    renderCategories('');
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
