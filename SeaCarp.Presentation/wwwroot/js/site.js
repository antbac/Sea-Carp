document.addEventListener('DOMContentLoaded', function () {
    var jwtCookie = document.cookie.split('; ').find(row => row.startsWith('JWT='));
    if (jwtCookie) {
        var jwtPayload = JSON.parse(atob(jwtCookie.split('.')[1]));
        if (jwtPayload.IsAdmin === 'True') {
            var adminDiv = document.createElement('div');
            var pTag = document.createElement('p');
            pTag.textContent = 'Admin';
            adminDiv.id = 'admin-banner';
            adminDiv.appendChild(pTag);
            document.body.appendChild(adminDiv);

            document.querySelector('#top_menu_dropdown_admin').style.display = 'list-item';
        }
    }
});