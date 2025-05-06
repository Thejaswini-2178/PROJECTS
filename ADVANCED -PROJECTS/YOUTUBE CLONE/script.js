// Sample video data
const videos = [
    {
        id: 1,
        title: 'How to Build a YouTube Clone with HTML, CSS & JavaScript',
        channel: 'Web Dev Tutorials',
        views: '120K views',
        timestamp: '3 days ago',
        duration: '12:34',
        thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg'
    },
    {
        id: 2,
        title: 'Learn JavaScript in 1 Hour',
        channel: 'Code Masters',
        views: '450K views',
        timestamp: '2 weeks ago',
        duration: '1:02:45',
        thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg'
    },
    {
        id: 3,
        title: 'CSS Grid Layout Crash Course',
        channel: 'CSS Experts',
        views: '89K views',
        timestamp: '1 month ago',
        duration: '25:12',
        thumbnail: 'https://i.ytimg.com/vi/0xMQfnTU6oo/hqdefault.jpg'
    },
    {
        id: 4,
        title: 'React JS Tutorial for Beginners',
        channel: 'React Pro',
        views: '1.2M views',
        timestamp: '5 months ago',
        duration: '2:15:30',
        thumbnail: 'https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg'
    },
    {
        id: 5,
        title: 'Node.js Crash Course',
        channel: 'Backend Dev',
        views: '320K views',
        timestamp: '3 weeks ago',
        duration: '45:18',
        thumbnail: 'https://i.ytimg.com/vi/fBNz5xF-Kx4/hqdefault.jpg'
    },
    {
        id: 6,
        title: 'Python Full Course for Beginners',
        channel: 'Python Tutorials',
        views: '780K views',
        timestamp: '8 months ago',
        duration: '6:12:45',
        thumbnail: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg'
    },
    {
        id: 7,
        title: 'MongoDB in 30 Minutes',
        channel: 'Database Guru',
        views: '150K views',
        timestamp: '10 days ago',
        duration: '28:45',
        thumbnail: 'https://i.ytimg.com/vi/-56x56UppqQ/hqdefault.jpg'
    },
    {
        id: 8,
        title: 'Git and GitHub for Beginners',
        channel: 'Version Control',
        views: '95K views',
        timestamp: '3 days ago',
        duration: '35:20',
        thumbnail: 'https://i.ytimg.com/vi/RGOj5yH7evk/hqdefault.jpg'
    }
];

// DOM Elements
const videosContainer = document.getElementById('videosContainer');
const categories = document.querySelectorAll('.category');
const sidebarItems = document.querySelectorAll('.sidebar-item');

// Display videos
function displayVideos() {
    videosContainer.innerHTML = '';
    
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        videoCard.innerHTML = `
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <span class="duration">${video.duration}</span>
            </div>
            <div class="video-details">
                <div class="channel-img">${video.channel.charAt(0)}</div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.channel}</p>
                    <p>${video.views} • ${video.timestamp}</p>
                </div>
            </div>
        `;
        
        videosContainer.appendChild(videoCard);
    });
}

// Filter videos by category
categories.forEach(category => {
    category.addEventListener('click', () => {
        categories.forEach(c => c.classList.remove('active'));
        category.classList.add('active');
        // In a real app, you would filter videos here
        displayVideos();
    });
});

// Handle sidebar item clicks
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // In a real app, you would load different content here
    });
});

// Initialize the app
displayVideos();

// Search functionality (basic)
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        // In a real app, you would filter videos based on search term
        alert(`Searching for: ${searchTerm}`);
        searchInput.value = '';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            // In a real app, you would filter videos based on search term
            alert(`Searching for: ${searchTerm}`);
            searchInput.value = '';
        }
    }
});