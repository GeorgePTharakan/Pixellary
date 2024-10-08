// Load environment variables from .env file
// require('dotenv').config();

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyDbiMu3iAcrWaDDlxqzuIWipkufQucEBoA",
  authDomain: "pixellary-8da71.firebaseapp.com",
  databaseURL: "https://pixellary-8da71-default-rtdb.firebaseio.com",
  projectId: "pixellary-8da71",
  storageBucket: "pixellary-8da71.appspot.com",
  messagingSenderId: "730287076943",
  appId: "1:730287076943:web:cf236a388445ed14415c3a",
  measurementId: "G-ZKL4VZMMS7",
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

 
  const gallery = document.querySelector(".gallery");
  
  // display gallery
 // Function to fetch images from Firestore and display them
function loadGalleryImages() {
  db.collection("images")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const imgData = doc.data();
        const imgElement = document.createElement("img");
        
        // Use data-src for lazy loading
        imgElement.setAttribute("data-src", imgData.url);
        imgElement.alt = imgData.name;
        imgElement.classList.add("lazy"); // Add a class for potential styling

        // Modal functionality for each image
        imgElement.addEventListener("click", function () {
          modal.style.display = "flex";
          modalImage.src = this.src; // Use src here for the modal
        });

        // Append the image to the gallery
        gallery.appendChild(imgElement);
      });
      
      // Set up lazy loading
      lazyLoadImages();
    })
    .catch((error) => {
      console.error("Error loading images: ", error);
    });
}

// Function to lazy load images
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy");
  const config = {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 0.1 // Trigger when 10% of the image is visible
  };

  let observer;

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src'); // Load the image
          img.classList.remove('lazy'); // Remove lazy class
          observer.unobserve(img); // Stop observing this image
        }
      });
    }, config);

    lazyImages.forEach(image => {
      observer.observe(image); // Start observing each image
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    lazyImages.forEach(image => {
      image.src = image.getAttribute('data-src');
    });
  }
}

// Call the function to load images when the page loads
loadGalleryImages();

  
 //selecting file
const fileInput = document.getElementById("fileUpload");
const fileUploadLabel = document.getElementById("fileUploadLabel");
const previewContainer = document.getElementById("previewContainer");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const discardButton = document.getElementById("discardButton");
const uploadButton = document.getElementById("uploadButton");

let selectedFile = null;

fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  
  if (selectedFile) {
    
    fileNameDisplay.textContent = `Selected file: ${selectedFile.name}`;
    fileNameDisplay.style.display = "block"; 
    previewContainer.style.display = "block"; 
    fileInput.style.display = "none";
    fileUploadLabel.style.display = "none";
  }
});


// discard button
discardButton.addEventListener("click", () => {
  selectedFile = null;
  fileNameDisplay.textContent = "";  
  fileNameDisplay.style.display = "none";  
  previewContainer.style.display = "none"; 
  fileInput.value = "";  
  
  
  // fileInput.style.display = "block";
  fileUploadLabel.style.display = "inline-block";
  
  
});

//upload button
uploadButton.addEventListener("click", () => {
  if (!selectedFile) return;

  const storageRefPath = storage.ref().child(`images/${selectedFile.name}`);


  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("uploadProgress");
  const progressText = document.getElementById("progressText");

  progressContainer.style.display = "block";
  progressBar.value = 0;
  progressText.textContent = "0%";

 
  const uploadTask = storageRefPath.put(selectedFile);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      
      progressBar.value = progress;
      progressText.textContent = `${Math.floor(progress)}%`;

      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      
      console.error("Error uploading file: ", error);
      alert("Failed to upload image. Please try again.");
    },
    () => {
      
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);

        
        db.collection("images")
          .add({
            name: selectedFile.name,
            url: downloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            console.log("Image metadata stored in Firestore");

            
            const imgElement = document.createElement("img");//display image
            imgElement.src = downloadURL;
            imgElement.alt = selectedFile.name;
            imgElement.addEventListener("click", function () {
              modal.style.display = "flex";
              modalImage.src = this.src;
            });

            gallery.appendChild(imgElement);
            
            progressContainer.style.display = "none";

            
            selectedFile = null;
            previewContainer.style.display = "none";
            fileNameDisplay.textContent = ""; 
            fileNameDisplay.style.display = "none";
            fileInput.value = ""; 
            // fileInput.style.display = "block"; 
            fileUploadLabel.style.display = "inline-block"; 

            
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      });
    }
  );
});


  
  
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close");
  
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
  
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  