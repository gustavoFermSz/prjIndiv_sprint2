document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    // ensure consistent links for the site
    // when logged: show Home, Quizzes, Cartas, Publicações, Dashboard and profile
    // when not logged: show only Home, Login, Cadastro
    const authHtml = () => {
        const email = sessionStorage.EMAIL_USUARIO;
        const nome = sessionStorage.NOME_USUARIO;
        const active = typeof window !== 'undefined' ? window.NAV_ACTIVE || '' : '';

        if (email && nome) {
            // use absolute path for fallback so pages in subfolders still find the asset
            const avatar = sessionStorage.AVATAR_USUARIO || '/assets/icon/usuario_comum.png';
            // logged in
            return `
                <li><a href="index.html" class="${active === 'home' ? 'agora' : ''}">Home</a></li>
                <li><a href="quizzes.html" class="${active === 'quizzes' ? 'agora' : ''}">Quizzes</a></li>
                <li><a href="publicacoes.html" class="${active === 'publicacoes' ? 'agora' : ''}">Publicações</a></li>
                <li><a href="cartas.html" class="${active === 'cartas' ? 'agora' : ''}">Cartas</a></li>
                <li><a href="dashboard/dashboard.html" class="${active === 'dashboard' ? 'agora' : ''}">Dashboard</a></li>
                <li class="profile-li">
                  <img id="profileImg" src="${avatar}" alt="avatar" class="profile-circle"/>
                  <div id="profileDropdown" class="profile-dropdown hidden">
                    <strong id="profileName">${nome}</strong>
                    <div id="profileArroba">${sessionStorage.ARROBA_USUARIO || ''}</div>
                    <div id="profileEmail">${email}</div>
                    <hr />
                    <a href="#" id="logoutLink">Sair</a>
                  </div>
                </li>
            `;
        } else {
            // not logged
            return `
                <li><a href="index.html" class="${active === 'home' ? 'agora' : ''}">Home</a></li>
                <li><a href="login.html" class="${active === 'login' ? 'agora' : ''}">Login</a></li>
                <li><a href="cadastro.html" class="${active === 'cadastro' ? 'agora' : ''}">Cadastro</a></li>
            `;
        }
    };

    // replace current nav content with consistent layout
    nav.innerHTML = authHtml();

    // attach logout handler
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location = 'index.html';
        });
    }

    // profile dropdown toggle
    const profileImg = document.getElementById('profileImg');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileImg && profileDropdown) {
        profileImg.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });

        // close when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && e.target !== profileImg) {
                profileDropdown.classList.add('hidden');
            }
        });
    }
});
