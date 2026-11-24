document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    let logado = (sessionStorage.EMAIL_USUARIO && sessionStorage.NOME_USUARIO);

    // mostrar/ocultar blocos por classe
    nav.querySelectorAll('.requires-auth').forEach(el => { el.style.display = logado ? '' : 'none'; });
    nav.querySelectorAll('.requires-guest').forEach(el => { el.style.display = logado ? 'none' : ''; });



    // NÃO sobrescrever nav.innerHTML aqui — a marcação da navbar é estática em cada página.
    // Apenas gerenciar profile/avatar/dropdown/logout.

    const profileLi = nav.querySelector('.profile-li');
    const profileImg = nav.querySelector('#profileImg');
    const profileDropdown = nav.querySelector('#profileDropdown');
    const profileName = nav.querySelector('#profileName');
    const profileArroba = nav.querySelector('#profileArroba');
    const profileEmail = nav.querySelector('#profileEmail');
    const logoutLink = nav.querySelector('#logoutLink');

    const email = sessionStorage.EMAIL_USUARIO;
    const nome = sessionStorage.NOME_USUARIO;

    // Mostrar/ocultar bloco de perfil conforme sessão
    if (logado && profileLi) {
        profileLi.style.display = ''; // permitir visibilidade (depende do CSS)
        // fallback absoluto para o ícone padrão; aceitar dataURL ou URL absoluto
        const avatar = sessionStorage.AVATAR_USUARIO || '/assets/icon/usuario_comum.png';

        if (profileImg) {
            profileImg.src = avatar;

            profileImg.onerror = () => {
                profileImg.src = profileImg.src = '/assets/icon/usuario_comum.png';
                // fallback caso não carregue avatar corretamente. onerror() é uma função que permite tomar alguma ação quando a operação citara (antes do ponto) tem um valor inesperado - de erro, como carregamento falho, de código 404. É uma espécie de fallback pois permite a atribuição e possivelmente retorno de valor válido, numa variável por exemplo, em caso de falta de valor principa ou falha <--- portanto, serve como valor alternativo para quando não ocorre tudo como esperado.
            }

        }

        if (profileName) profileName.innerText = nome;
        if (profileArroba) profileArroba.innerText = sessionStorage.ARROBA_USUARIO || '';
        if (profileEmail) profileEmail.innerText = email;

    } else if (profileLi) { //
        // sem sessão: esconder bloco de perfil (ou deixá-lo estático sem conteúdo)
        profileLi.style.display = 'none';

    }
    // logout (mantém comportamento)
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location = 'index.html';
        });
    }

    // dropdown toggle
    if (profileImg && profileDropdown) {
        profileImg.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && e.target !== profileImg) {
                profileDropdown.classList.add('hidden');
            }
        });
    }

    // (opcional) código do hamburger mobile se houver botão #hamburger
    const hamb = document.getElementById('hamburger');
    if (hamb && nav) {
        hamb.addEventListener('click', () => nav.classList.toggle('open'));
    }
});