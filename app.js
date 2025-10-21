// Birthday Wishes Submission - App Logic
// Handles form submission, image upload, and real-time preview

// Wait for DOM and Supabase to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Submission form initialized');

    // Check if Supabase is loaded
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase not loaded! Check supabase-config.js');
        return;
    }

    // DOM Elements
    const form = document.getElementById('wishForm');
    const yourNameInput = document.getElementById('yourName');
    const wishMessageInput = document.getElementById('wishMessage');
    const photoUploadInput = document.getElementById('photoUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Preview Card Elements
    const previewName = document.getElementById('previewName');
    const previewMessage = document.getElementById('previewMessage');
    const previewPhoto = document.getElementById('previewPhoto');
    const previewDate = document.getElementById('previewDate');

    // State
    let selectedFile = null;

    // Initialize
    updateDate();

    // Event Listeners
    yourNameInput.addEventListener('input', updatePreview);
    wishMessageInput.addEventListener('input', updatePreview);
    photoUploadInput.addEventListener('change', handleImagePreview);
    form.addEventListener('submit', handleSubmit);
    removeImageBtn.addEventListener('click', removeImage);

    // Update current date
    function updateDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
        previewDate.textContent = dateString;
    }

    // Real-time preview update
    function updatePreview() {
        const yourName = yourNameInput.value.trim();
        const wishMessage = wishMessageInput.value.trim();

        previewName.textContent = yourName || 'Your Name';
        previewMessage.textContent = wishMessage || 'Your birthday wish will appear here...';
    }

    // Handle image preview
    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showStatus('Please select a valid image file (JPG, PNG, GIF)', 'error');
            photoUploadInput.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('Image size should be less than 5MB!', 'error');
            photoUploadInput.value = '';
            return;
        }

        selectedFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
            
            // Update card preview photo
            previewPhoto.innerHTML = `<img src="${e.target.result}" alt="Photo" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #bf5a5a; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    }

    // Remove image
    function removeImage() {
        selectedFile = null;
        photoUploadInput.value = '';
        imagePreview.classList.add('hidden');
        previewPhoto.innerHTML = '<span class="photo-placeholder">📷</span>';
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Get form values
        const yourName = yourNameInput.value.trim();
        const wishMessage = wishMessageInput.value.trim();

        // Validation
        if (!yourName || !wishMessage) {
            showStatus('Please fill in all required fields!', 'error');
            return;
        }

        if (yourName.length < 2) {
            showStatus('Please enter a valid name (at least 2 characters)', 'error');
            return;
        }

        if (wishMessage.length < 10) {
            showStatus('Please write a longer birthday wish (at least 10 characters)', 'error');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Sending...';
        showStatus('Uploading your birthday wish...', 'info');

        try {
            let imageUrl = '';

            // Upload image if selected
            if (selectedFile) {
                showStatus('Uploading your photo...', 'info');
                imageUrl = await uploadImage(selectedFile);
            }

            // Save wish to database
            showStatus('Saving your wish...', 'info');
            await saveWishToDatabase({
                yourName,
                wishMessage,
                imageUrl
            });

            // Success!
            showStatus('🎉 Your birthday wish has been sent to Cheata! Thank you for making her day special! 💖', 'success');

            // Reset form after 3 seconds
            setTimeout(() => {
                resetForm();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 3000);

        } catch (error) {
            console.error('Error submitting wish:', error);
            showStatus(`❌ Failed to send wish: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '🎉 Send Birthday Wish';
        }
    }

    // Upload image to Supabase Storage
    async function uploadImage(file) {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const fileExt = file.name.split('.').pop();
        const fileName = `wish_${timestamp}_${randomStr}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('birthday-images')
            .upload(fileName, file);

        if (error) {
            throw new Error(`Image upload failed: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('birthday-images')
            .getPublicUrl(fileName);

        console.log('✅ Image uploaded:', publicUrl);
        return publicUrl;
    }

    // Save wish to Supabase database
    async function saveWishToDatabase(wishData) {
        const { data, error } = await supabase
            .from('birthday_wishes')
            .insert([
                {
                    friend_name: 'Cheata',
                    your_name: wishData.yourName,
                    birthday_wish: wishData.wishMessage,
                    image_url: wishData.imageUrl || '',
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        console.log('✅ Wish saved:', data[0].id);
        return data[0].id;
    }

    // Reset form
    function resetForm() {
        form.reset();
        selectedFile = null;
        imagePreview.classList.add('hidden');
        previewPhoto.innerHTML = '<span class="photo-placeholder">📷</span>';
        previewName.textContent = 'Your Name';
        previewMessage.textContent = 'Your birthday wish will appear here...';
        statusMessage.classList.add('hidden');
    }

    // Show status message
    function showStatus(message, type) {
        statusMessage.innerHTML = message;
        statusMessage.className = `status-message status-${type}`;
        statusMessage.classList.remove('hidden');

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }
    }

    console.log('✅ Ready to collect birthday wishes for Cheata!');
});
