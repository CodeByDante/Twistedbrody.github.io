document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const videoContainer = document.getElementById('videoContainer');
    const addVideoBtn = document.getElementById('addVideoBtn');
    const modal = document.getElementById('addVideoModal');
    const closeBtn = document.querySelector('.close');
    const videoForm = document.getElementById('videoForm');
    const videoType = document.getElementById('videoType');
    const localVideoField = document.getElementById('localVideoField');
    const embedVideoField = document.getElementById('embedVideoField');
    
    // Cargar videos al iniciar
    loadVideos();
    
    // Eventos del modal
    addVideoBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        videoForm.reset();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            videoForm.reset();
        }
    });
    
    // Cambiar tipo de video
    videoType.addEventListener('change', function() {
        const type = this.value;
        localVideoField.style.display = type === 'local' ? 'block' : 'none';
        embedVideoField.style.display = (type === 'vimeo' || type === 'youtube') ? 'block' : 'none';
    });
    
    // Guardar nuevo video
    videoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = videoType.value;
        const newVideo = {
            type: type,
            title: document.getElementById('videoTitle').value,
            category: document.getElementById('videoCategory').value
        };
        
        if (type === 'local') {
            newVideo.url = document.getElementById('videoUrl').value;
        } else {
            newVideo.code = document.getElementById('embedCode').value;
        }
        
        saveVideo(newVideo);
        modal.style.display = 'none';
        videoForm.reset();
    });
    
    // Funciones principales
    function loadVideos() {
        let videos = JSON.parse(localStorage.getItem('videos'));
        
        if (!videos || videos.length === 0) {
            videos = [
                {
                    type: 'local',
                    url: 'videos/video1.mp4',
                    title: 'Tutorial de JavaScript',
                    category: 'tutoriales'
                },
                {
                    type: 'local',
                    url: 'videos/video2.mp4',
                    title: 'Documental sobre naturaleza',
                    category: 'documentales'
                },
                {
                    type: 'vimeo',
                    code: '1067624786',
                    title: 'Ejemplo Vimeo',
                    category: 'tutoriales'
                }
            ];
            localStorage.setItem('videos', JSON.stringify(videos));
        }
        
        renderVideos(videos);
        setupSearch();
    }
    
    function renderVideos(videos) {
        videoContainer.innerHTML = '';
        
        if (videos.length === 0) {
            videoContainer.innerHTML = '<div class="no-results">No hay videos disponibles</div>';
            return;
        }
        
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.setAttribute('data-category', video.category);
            
            if (video.type === 'local') {
                videoCard.innerHTML = `
                    <video src="${video.url}" controls></video>
                    <p class="video-title">${video.title}</p>
                `;
            } else {
                let embedUrl;
                if (video.type === 'vimeo') {
                    embedUrl = `https://player.vimeo.com/video/${video.code}`;
                } else { // youtube
                    embedUrl = `https://www.youtube.com/embed/${video.code}`;
                }
                
                videoCard.innerHTML = `
                    <div class="embed-container">
                        <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <p class="video-title">${video.title}</p>
                `;
            }
            
            videoContainer.appendChild(videoCard);
        });
    }
    
    function saveVideo(video) {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        videos.push(video);
        localStorage.setItem('videos', JSON.stringify(videos));
        renderVideos(videos);
    }
    
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const categoryButtons = document.querySelectorAll('.categories button');
        const videoCards = document.querySelectorAll('.video-card');
        
        // Mensaje cuando no hay resultados
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.textContent = 'No se encontraron videos';
        videoContainer.appendChild(noResultsMsg);
        
        function filterVideos() {
            const searchTerm = searchInput.value.toLowerCase();
            const activeCategory = document.querySelector('.categories button.active')?.dataset.category || 'all';
            
            let hasResults = false;
            
            videoCards.forEach(card => {
                const title = card.querySelector('.video-title').textContent.toLowerCase();
                const category = card.getAttribute('data-category');
                
                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = activeCategory === 'all' || category === activeCategory;
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = '';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            noResultsMsg.style.display = hasResults ? 'none' : 'block';
        }
        
        // Eventos
        searchInput.addEventListener('input', filterVideos);
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterVideos();
            });
        });
        
        // Activar "Todos" por defecto
        document.querySelector('.categories button[data-category="all"]').classList.add('active');
    }
});