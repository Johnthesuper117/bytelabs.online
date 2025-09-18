async function loadDynamicContent(targetElementId, sourcePageUrl) {
    try {
        const response = await fetch(sourcePageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        document.getElementById(targetElementId).insertAdjacentHTML('beforeend', htmlContent);
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

// Call the function to load content when the page loads or based on an event
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent('nav-container', './navbar.html');
});
