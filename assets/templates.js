var template_analytics = document.createElement('template');

fetch('includes/google-analytics.html')
    .then(response => response.text())
    .then(data => {
        template_analytics.innerHTML = data;
        document.head.appendChild(template_analytics.content);
        console.log('Analytics template added to head')

    })
    .catch(error => {
        console.error('Error fetching or setting analytics content:', error);
    });
// document.head.appendChild(template_analytics.content);
//  line is executed immediately after the fetch request is made,
//  not waiting for the .then() block to complete.
//  This means that the template_analytics.content is being appended before the innerHTML of the template is set,
//  resulting in an empty content being appended to the head.
