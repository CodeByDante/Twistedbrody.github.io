document.addEventListener('DOMContentLoaded', function() {
    // Array de videos inicial (puedes modificarlo manualmente)
    let videos = [
        {
            id: "1743635685656",
            title: "Japs8005",
            category: "tutoriales",
            hashtag: "",
            videoUrl: "https://vimeo.com/1067624786",
            type: "vimeo"
        },
    ];

    // Elementos del DOM
    const videoContainer = document.getElementById('videoContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.categories button');
    const addVideoBtn = document.getElementById('addVideoBtn');
    const modal = document.getElementById('addVideoModal');
    const closeBtn = document.querySelector('.close');
    const videoForm = document.getElementById('videoForm');
    const codeModal = document.getElementById('codeModal');
    const generatedCode = document.getElementById('generatedCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const closeCodeBtn = document.querySelector('.close-code');
    const videoTypeSelect = document.getElementById('videoType');

    // Cargar videos al inicio
    renderVideos(videos);

    // Abrir modal para añadir video
    addVideoBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        videoForm.reset();
    });

    // Cerrar modal de añadir video
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal de código
    closeCodeBtn.addEventListener('click', () => {
        codeModal.style.display = 'none';
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === codeModal) {
            codeModal.style.display = 'none';
        }
    });

    // Guardar nuevo video
    videoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const videoUrl = document.getElementById('videoUrl').value;
        const videoTitle = document.getElementById('videoTitle').value;
        const videoCategory = document.getElementById('videoCategory').value;
        const videoHashtag = document.getElementById('videoHashtag').value || "";
        const videoType = document.getElementById('videoType').value;

        // Validación básica
        if (!videoUrl) {
            alert("Por favor, ingresa una URL válida");
            return;
        }

        const newVideo = {
            id: Date.now().toString(),
            title: videoTitle,
            category: videoCategory,
            hashtag: videoHashtag,
            videoUrl: videoUrl,
            type: videoType
        };

        // 1. Genera el código formateado
        const codeToCopy = `    {
        id: "${newVideo.id}",
        title: "${newVideo.title}",
        category: "${newVideo.category}",
        hashtag: "${newVideo.hashtag}",
        videoUrl: "${newVideo.videoUrl}",
        type: "${newVideo.type}"
    },`;

        // 2. Muestra el código en el modal
        generatedCode.value = codeToCopy;
        codeModal.style.display = 'flex';
        
        // 3. Añade el video al array en memoria (solo para esta sesión)
        videos.push(newVideo);
        renderVideos(videos);
        
        // 4. Cierra el modal de añadir y limpia el formulario
        modal.style.display = 'none';
        videoForm.reset();
    });

    // Copiar al portapapeles
    copyCodeBtn.addEventListener('click', function() {
        generatedCode.select();
        document.execCommand('copy');
        alert("¡Código copiado al portapapeles!");
    });

    // Buscador de videos
    searchInput.addEventListener('input', function() {
        filterVideos();
    });

    // Filtros por categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterVideos();
        });
    });

    // Función para renderizar videos
    function renderVideos(videosToRender) {
        videoContainer.innerHTML = '';
        
        if (videosToRender.length === 0) {
            videoContainer.innerHTML = '<div class="no-results">No hay videos disponibles. ¡Añade uno!</div>';
            return;
        }
        
        videosToRender.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.setAttribute('data-category', video.category);
            
            // Generar iframe/embed según el tipo de video
            let videoContent = '';
            switch(video.type) {
                case 'vimeo':
                    const vimeoId = video.videoUrl.match(/(?:vimeo\.com\/|video\/)(\d+)/i)?.[1];
                    if (vimeoId) {
                        videoContent = `<iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allowfullscreen></iframe>`;
                    }
                    break;
                case 'youtube':
                    const youtubeId = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&? 	>]{11})/i)?.[1];
                    if (youtubeId) {
                        videoContent = `<iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>`;
                    }
                    break;
                case 'google-drive':
                    const driveId = video.videoUrl.match(/\/file\/d\/([^\/]+)/i)?.[1];
                    if (driveId) {
                        videoContent = `<iframe src="https://drive.google.com/file/d/${driveId}/preview" frameborder="0" allowfullscreen></iframe>`;
                    }
                    break;
                default:
                    videoContent = `<p>Enlace de video no soportado: ${video.videoUrl}</p>`;
            }
            
            // Modificado para soportar múltiples hashtags y hacerlos clickables
            videoCard.innerHTML = `
                <div class="embed-container">
                    ${videoContent}
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <span class="video-category">${video.category}</span>
                    ${video.hashtag ? video.hashtag.split(' ').filter(tag => tag.trim() !== '').map(tag => 
                        `<span class="video-hashtag hashtag-filter" data-tag="${tag.trim()}">#${tag.trim()}</span>`
                    ).join(' ') : ''}
                    <span class="video-type">${video.type}</span>
                </div>
            `;
            
            videoContainer.appendChild(videoCard);
        });

        // Añadir event listeners a los hashtags después de renderizar
        document.querySelectorAll('.hashtag-filter').forEach(hashtag => {
            hashtag.addEventListener('click', function() {
                const tag = this.getAttribute('data-tag');
                searchInput.value = `#${tag}`;
                filterVideos();
                
                // Resaltar el hashtag clickeado
                document.querySelectorAll('.hashtag-filter').forEach(h => h.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Función para filtrar videos (modificada para soportar búsqueda por hashtag)
    function filterVideos() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.categories button.active').dataset.category;
        
        let filteredVideos = videos.filter(video => {
            const isSearchingHashtag = searchTerm.startsWith('#');
            const searchText = isSearchingHashtag ? searchTerm.substring(1) : searchTerm;
            
            const matchesSearch = isSearchingHashtag 
                ? (video.hashtag && video.hashtag.toLowerCase().includes(searchText))
                : video.title.toLowerCase().includes(searchText) || 
                  (video.hashtag && video.hashtag.toLowerCase().includes(searchText));
                  
            const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
        
        renderVideos(filteredVideos);
    }
});