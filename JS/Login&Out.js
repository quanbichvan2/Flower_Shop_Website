function toggleProfile() {
    var profileElement = document.querySelector('.profile');
    var profileImage = document.querySelector('.profile img');

    if (profileElement.classList.contains('profile-hidden')) {
        profileElement.classList.remove('profile-hidden');
        profileImage.style.display = 'inline-block';
    } else {
        profileElement.classList.add('profile-hidden');
        profileImage.style.display = 'none';
    }
}
