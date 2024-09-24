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
  
  // Reference to the gallery section
  const gallery = document.querySelector(".gallery");
  
  // Function to fetch images from Firestore and display them
  function loadGalleryImages() {
    db.collection("images")
      .orderBy("timestamp", "desc") // Optional: order images by timestamp
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const imgData = doc.data();
          const imgElement = document.createElement("img");
          imgElement.src = imgData.url;
          imgElement.alt = imgData.name;
          
          // Modal functionality for each image
          imgElement.addEventListener("click", function () {
            modal.style.display = "flex";
            modalImage.src = this.src;
          });
          
          // Append the image to the gallery
          gallery.appendChild(imgElement);
        });
      })
      .catch((error) => {
        console.error("Error loading images: ", error);
      });
  }
  
  // Call the function to load images when the page loads
  loadGalleryImages();
  
  // Handle file uploads
  const fileInput = document.getElementById("fileUpload");
  
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref().child(`images/${file.name}`);
  
    storageRef.put(file).then((snapshot) => {
      console.log("Uploaded a file!");
  
      // Get the download URL
      storageRef.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
  
        // Store image metadata in Firestore
        db.collection("images").add({
          name: file.name,
          url: downloadURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Optional: add a timestamp
        }).then(() => {
          console.log("Image metadata stored in Firestore");
  
          // Dynamically add the image to the gallery
          const imgElement = document.createElement("img");
          imgElement.src = downloadURL;
          imgElement.alt = file.name;
          imgElement.addEventListener("click", function () {
            modal.style.display = "flex";
            modalImage.src = this.src;
          });
  
          // Append the image to the gallery
          gallery.appendChild(imgElement);
        }).catch((error) => {
          console.error("Error adding document: ", error);
        });
      });
    });
  });
  
  // Modal functionality remains the same
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
  