let cropper;
const imageInput = document.getElementById('imageInput');
const uploadBox = document.getElementById('uploadBox');
const imageToCrop = document.getElementById('imageToCrop');

uploadBox.onclick = () => imageInput.click();

imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageToCrop.src = event.target.result;
            
            // UI Toggle
            uploadBox.style.display = 'none';
            document.getElementById('ratioToolbar').style.display = 'flex';
            document.getElementById('editorWorkspace').style.display = 'block';
            
            if (cropper) cropper.destroy();
            
            cropper = new Cropper(imageToCrop, {
                viewMode: 1, // Stay inside the container
                dragMode: 'move',
                aspectRatio: NaN, // Default to Free
                autoCropArea: 0.8,
                responsive: true,
                background: true, // Keep checkerboard inside
                modal: true,      // Darken outside crop area
                guides: true,
            });
        };
        reader.readAsDataURL(file);
    }
};

// Handle Ratio Buttons
document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.onclick = function() {
        document.querySelector('.ratio-btn.active')?.classList.remove('active');
        this.classList.add('active');
        const ratio = parseFloat(this.dataset.ratio);
        cropper.setAspectRatio(ratio);
    };
});

// Crop and Download
document.getElementById('cropBtn').onclick = () => {
    const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });
    
    const link = document.createElement('a');
    link.download = 'toolverse-cropped.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};

document.getElementById('resetBtn').onclick = () => cropper.reset();