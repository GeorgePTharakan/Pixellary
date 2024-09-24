// Firebase configuration
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
  const db = firebase.firestore(); // Initialize Firestore

  
  
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
          timestamp: firebase.firestore.FieldValue.serverTimestamp() // Optional: add a timestamp
        }).then(() => {
          console.log("Image metadata stored in Firestore");
          // Optionally, add the image to the gallery dynamically
          const imgElement = document.createElement("img");
          imgElement.src = downloadURL;
          imgElement.alt = file.name;
          imgElement.addEventListener("click", function () {
            modal.style.display = "flex";
            modalImage.src = this.src;
          });
          document.querySelector(".gallery").appendChild(imgElement);
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
  
  const images = document.querySelectorAll(".gallery img");
  
  images.forEach((img) => {
    img.addEventListener("click", function () {
      modal.style.display = "flex";
      modalImage.src = this.src;
    });
  });
  
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
  
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  