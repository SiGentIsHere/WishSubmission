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
    const form = document.getElementById('birthdayForm');
    const yourNameInput = document.getElementById('yourName');
    const birthdayWishInput = document.getElementById('birthdayWish');
    const friendPictureInput = document.getElementById('friendPicture');
    const imagePreview = document.getElementById('imagePreview');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Preview Card Elements
    const cardYourName = document.getElementById('cardYourName');
    const cardWishText = document.getElementById('cardWishText');
    const cardImage = document.getElementById('cardImage');
    const cardDate = document.getElementById('cardDate');

    // State
    let selectedFile = null;

    // Initialize
    updateDate();

    // Event Listeners
    yourNameInput.addEventListener('input', updatePreview);
    birthdayWishInput.addEventListener('input', updatePreview);
    friendPictureInput.addEventListener('change', handleImagePreview);
    form.addEventListener('submit', handleSubmit);
    resetBtn.addEventListener('click', resetForm);

    // Update current date
    function updateDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        }).replace(/\//g, '-').toUpperCase();
        cardDate.textContent = dateString;
    }

    // Real-time preview update
    function updatePreview() {
        const yourName = yourNameInput.value.trim();
        const birthdayWish = birthdayWishInput.value.trim();

        cardYourName.textContent = yourName || 'YOU';
        cardWishText.textContent = birthdayWish || 'Your beautiful birthday wish will appear here...';
    }

    // Handle image preview
    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showStatus('Please select a valid image file (JPG, PNG, GIF)', 'error');
            friendPictureInput.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('Image size should be less than 5MB!', 'error');
            friendPictureInput.value = '';
            return;
        }

        selectedFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            // Update card preview
            cardImage.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;

            // Show thumbnail preview below form
            imagePreview.innerHTML = `
                <div class="preview-thumbnail">
                    <img src="${e.target.result}" alt="Preview" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #bf5a5a;">
                    <span class="preview-filename">${file.name}</span>
                    <button type="button" class="btn-remove" onclick="removeImage()">✕</button>
                </div>
            `;
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Remove image
    window.removeImage = function() {
        selectedFile = null;
        friendPictureInput.value = '';
        imagePreview.innerHTML = '';
        imagePreview.classList.add('hidden');
        cardImage.innerHTML = '<div class="image-placeholder">📷</div>';
    };

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Get form values
        const yourName = yourNameInput.value.trim();
        const birthdayWish = birthdayWishInput.value.trim();

        // Validation
        if (!yourName || !birthdayWish) {
            showStatus('Please fill in all required fields!', 'error');
            return;
        }

        if (yourName.length < 2) {
            showStatus('Please enter a valid name (at least 2 characters)', 'error');
            return;
        }

        if (birthdayWish.length < 10) {
            showStatus('Please write a longer birthday wish (at least 10 characters)', 'error');
            return;
        }

        // Disable submit button
        setLoading(true);
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
                birthdayWish,
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
            setLoading(false);
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
                    birthday_wish: wishData.birthdayWish,
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
        imagePreview.innerHTML = '';
        imagePreview.classList.add('hidden');

        // Reset preview card
        cardYourName.textContent = 'YOU';
        cardWishText.textContent = 'Your beautiful birthday wish will appear here...';
        cardImage.innerHTML = '<div class="image-placeholder">📷</div>';

        statusMessage.classList.add('hidden');
    }

    // Set loading state
    function setLoading(isLoading) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        if (isLoading) {
            submitBtn.disabled = true;
            resetBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            resetBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
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
