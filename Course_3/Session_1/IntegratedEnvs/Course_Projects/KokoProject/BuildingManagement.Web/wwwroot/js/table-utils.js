(function () {
    'use strict';

    function initializeTable(tableId, itemsPerPage = 10) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length === 0) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'card-body border-bottom';
        searchContainer.innerHTML = `
            <div class="row g-3 align-items-end">
                <div class="col-md-6">
                    <label for="search-${tableId}" class="form-label">
                        <i class="bi bi-search me-1"></i>Търсене
                    </label>
                    <input type="text" id="search-${tableId}" class="form-control" placeholder="Търсене в таблицата...">
                </div>
                <div class="col-md-3">
                    <label for="itemsPerPage-${tableId}" class="form-label">Редове на страница</label>
                    <select id="itemsPerPage-${tableId}" class="form-select">
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div class="col-md-3 text-end">
                    <div id="tableInfo-${tableId}" class="text-muted small"></div>
                </div>
            </div>
        `;

        const card = table.closest('.card');
        if (card) {
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.insertBefore(searchContainer, cardBody.firstChild);
            }
        }

        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'card-body border-top';
        paginationContainer.id = `pagination-${tableId}`;

        if (card) {
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.appendChild(paginationContainer);
            }
        }

        let currentPage = 1;
        let currentItemsPerPage = itemsPerPage;
        let filteredRows = rows;

        function updateTable() {
            const start = (currentPage - 1) * currentItemsPerPage;
            const end = start + currentItemsPerPage;
            const pageRows = filteredRows.slice(start, end);

            rows.forEach(row => row.style.display = 'none');
            pageRows.forEach(row => row.style.display = '');

            updatePagination();
            updateInfo();
        }

        function updatePagination() {
            const totalPages = Math.ceil(filteredRows.length / currentItemsPerPage);
            const pagination = document.getElementById(`pagination-${tableId}`);
            if (!pagination) return;

            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }

            let html = '<nav><ul class="pagination justify-content-center mb-0">';

            html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Предишна</a>
            </li>`;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>`;
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
                }
            }

            html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Следваща</a>
            </li>`;

            html += '</ul></nav>';

            pagination.innerHTML = html;

            pagination.querySelectorAll('a[data-page]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = parseInt(link.getAttribute('data-page'));
                    if (page >= 1 && page <= totalPages) {
                        currentPage = page;
                        updateTable();
                    }
                });
            });
        }

        function updateInfo() {
            const info = document.getElementById(`tableInfo-${tableId}`);
            if (!info) return;

            const start = filteredRows.length === 0 ? 0 : (currentPage - 1) * currentItemsPerPage + 1;
            const end = Math.min(currentPage * currentItemsPerPage, filteredRows.length);
            const total = filteredRows.length;

            info.textContent = `Показване ${start}-${end} от ${total} записа`;
        }

        function filterRows(searchTerm) {
            if (!searchTerm) {
                filteredRows = rows;
            } else {
                const term = searchTerm.toLowerCase();
                filteredRows = rows.filter(row => {
                    const text = row.textContent.toLowerCase();
                    return text.includes(term);
                });
            }
            currentPage = 1;
            updateTable();
        }

        const searchInput = document.getElementById(`search-${tableId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterRows(e.target.value);
            });
        }

        const itemsPerPageSelect = document.getElementById(`itemsPerPage-${tableId}`);
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                currentItemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                updateTable();
            });
        }

        updateTable();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initializeTable('buildingsTable', 10);
        initializeTable('apartmentsTable', 10);
        initializeTable('residentsTable', 10);
        initializeTable('paymentsTable', 10);
    });
})();

