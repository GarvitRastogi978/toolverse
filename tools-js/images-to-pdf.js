const input = document.getElementById("imageInput");
const imageList = document.getElementById("imageList");
const convertBtn = document.getElementById("convertBtn");

let images = [];

input.addEventListener("change", e => {
  [...e.target.files].forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      images.push({ file, src: reader.result });
      renderImages();
    };
    reader.readAsDataURL(file);
  });
});

function renderImages() {
  imageList.innerHTML = "";

  images.forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "image-item";
    item.draggable = true;

    item.innerHTML = `
      <img src="${img.src}" />
      <button class="remove">🗑️</button>
    `;

    // Remove
    item.querySelector(".remove").onclick = () => {
      images.splice(index, 1);
      renderImages();
    };

    // Drag & Drop
    item.addEventListener("dragstart", e => {
      e.dataTransfer.setData("index", index);
    });

    item.addEventListener("dragover", e => e.preventDefault());

    item.addEventListener("drop", e => {
      const from = e.dataTransfer.getData("index");
      const moved = images.splice(from, 1)[0];
      images.splice(index, 0, moved);
      renderImages();
    });

    imageList.appendChild(item);
  });
}

convertBtn.addEventListener("click", async () => {
  if (!images.length) {
    alert("Please upload at least one image");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < images.length; i++) {
    const img = images[i].src;
    const imgProps = pdf.getImageProperties(img);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, pdfWidth, pdfHeight);
  }

  pdf.save("images-to-pdf.pdf");
});
