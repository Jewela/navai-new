(function () {
    const scriptUrl = new URL(document.currentScript.src);
    const avatarid = scriptUrl.searchParams.get('id');

    const chatbotIcon = document.createElement('div');
    chatbotIcon.style.position = 'fixed';
    chatbotIcon.style.bottom = '20px';
    chatbotIcon.style.right = '20px';
    chatbotIcon.style.width = '50px';
    chatbotIcon.style.height = '50px';
    chatbotIcon.style.backgroundColor = '#007bff';
    chatbotIcon.style.borderRadius = '50%';
    chatbotIcon.style.display = 'flex';
    chatbotIcon.style.justifyContent = 'center';
    chatbotIcon.style.alignItems = 'center';
    chatbotIcon.style.cursor = 'pointer';
    chatbotIcon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    chatbotIcon.innerHTML = '<span style="color: white; font-size: 24px;">💬</span>';

    // Append the icon to the body
    document.body.appendChild(chatbotIcon);

    // Create the iframe
    const iframe = document.createElement('iframe');
    // iframe.src = `https://navai.cloud/avatar-chatbot?id=${avatarid}`;
    iframe.src = `http://localhost:3000/avatar-chatbot?id=${avatarid}`;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '80px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';
    iframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    iframe.style.display = 'none'; // Initially hidden
    document.body.appendChild(iframe);

    // Create the external close button
    const closeButton = document.createElement('div');
    closeButton.style.position = 'fixed';
    closeButton.style.bottom = '645px'; // Adjust based on iframe height
    closeButton.style.right = '25px';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.backgroundColor = '#006aff';
    closeButton.style.borderRadius = '50%';
    closeButton.style.display = 'none'; // Initially hidden
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.cursor = 'pointer';
    closeButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    closeButton.innerHTML = '<span style="color: white; font-size: 24px;">×</span>';

    // Append the close button to the body
    document.body.appendChild(closeButton);

    // Show the iframe and close button when the icon is clicked
    chatbotIcon.addEventListener('click', function () {
        iframe.style.display = 'block';
        closeButton.style.display = 'flex';
    });

    // Close the iframe and hide the close button when the close button is clicked
    closeButton.addEventListener('click', function () {
        iframe.style.display = 'none';
        closeButton.style.display = 'none';
    });

    // Handle the close message from the iframe (optional if you still want to keep the internal close button functionality)
    window.addEventListener('message', function (event) {
        if (event.data === 'closeChatbot') {
            iframe.style.display = 'none';
            closeButton.style.display = 'none';
        }
    });
})();

