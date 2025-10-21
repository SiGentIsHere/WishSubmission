// Birthday Wishes Submission Form
// Handles form submission, image upload, and real-time preview

document.addEventListener('DOMContentLoaded', function() {
    console.log('Birthday wishes submission form loaded');

    // DOM Elements
    const wishForm = document.getElementById('wishForm');
    const yourNameInput = document.getElementById('yourName');
    const recipientNameInput = document.getElementById('recipientName');
    const wishMessageInput = document.getElementById('wishMessage');
    const photoUploadInput = document.getElementById('photoUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Preview elements
    const previewName = document.getElementById('previewName');
    const previewRecipient = document.getElementById('previewRecipient');
    const previewMessage = document.getElementById('previewMessage');
    const previewPhoto = document.getElementById('previewPhoto');
    const previewDate = document.getElementById('previewDate');

    let selectedFile = null;

    // Set DYNAMIC current date (real-time)
    function updateDate() {
        const today = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateStr = today.toLocaleDateString('en-US', options).toUpperCase();
        previewDate.textContent = dateStr;
    }
    
    // Update date immediately and every minute
    updateDate();
    setInterval(updateDate, 60000);

    // Real-time preview - Your Name
    yourNameInput.addEventListener('input', () => {
        const name = yourNameInput.value.trim();
        previewName.textContent = name || 'YOUR NAME';
    });

    // Real-time preview - Recipient Name
    recipientNameInput.addEventListener('input', () => {
        const recipient = recipientNameInput.value.trim();
        previewRecipient.textContent = recipient.toUpperCase() || 'RECIPIENT';
    });

    // Real-time preview - Message
    wishMessageInput.addEventListener('input', () => {
        const message = wishMessageInput.value.trim();
        previewMessage.textContent = message || 'Your birthday wish will appear here...';
    });

    // Photo upload handling
    photoUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showStatus('Image must be less than 5MB', 'error');
            photoUploadInput.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            showStatus('Please upload an image file', 'error');
            photoUploadInput.value = '';
            return;
        }

        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
            previewPhoto.innerHTML = `<img src="${e.target.result}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    });

    removeImageBtn.addEventListener('click', () => {
        selectedFile = null;
        photoUploadInput.value = '';
        imagePreview.classList.add('hidden');
        previewPhoto.innerHTML = '<span class="photo-placeholder">📷</span>';
    });

    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const yourName = yourNameInput.value.trim();
        const recipientName = recipientNameInput.value.trim();
        const wishMessage = wishMessageInput.value.trim();
        
        if (!yourName || !recipientName || !wishMessage) {
            showStatus('Please fill in all required fields', 'error');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            showStatus('Uploading your birthday wish...', 'info');

            let imageUrl = '';

            if (selectedFile) {
                showStatus('Uploading your photo...', 'info');
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('birthday-images')
                    .upload(fileName, selectedFile);

                if (uploadError) throw new Error('Failed to upload image: ' + uploadError.message);

                const { data: { publicUrl } } = supabase.storage
                    .from('birthday-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            showStatus('Saving your wish...', 'info');
            
            const { data, error } = await supabase
                .from('birthday_wishes')
                .insert([{
                    friend_name: recipientName,
                    your_name: yourName,
                    birthday_wish: wishMessage,
                    image_url: imageUrl || ''
                }])
                .select();

            if (error) throw new Error('Failed to save wish: ' + error.message);

            showStatus(`🎉 Your birthday wish has been sent to ${recipientName}!`, 'success');
            
            setTimeout(() => {
                wishForm.reset();
                selectedFile = null;
                imagePreview.classList.add('hidden');
                previewPhoto.innerHTML = '<span class="photo-placeholder">📷</span>';
                previewName.textContent = 'YOUR NAME';
                previewRecipient.textContent = 'RECIPIENT';
                previewMessage.textContent = 'Your birthday wish will appear here...';
                updateDate();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => statusMessage.classList.add('hidden'), 2000);
            }, 3000);

        } catch (error) {
            showStatus('Failed to send wish: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Birthday Wish';
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message status-${type}`;
        statusMessage.classList.remove('hidden');
        if (type === 'info' || type === 'error') {
            setTimeout(() => statusMessage.classList.add('hidden'), 5000);
        }
    }

    console.log('Ready to collect birthday wishes!');
});
