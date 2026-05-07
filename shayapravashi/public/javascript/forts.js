// const forts = [
//   {
//     name: "Pratapgad",
//     location: "Satara District",
//     image: "images/pratapgad.jpg",
//     difficulty: "Moderate",
//     description: "Famous for Shivaji Maharaj’s victory, Pratapgad’s lush slopes and iconic watchtowers offer breathtaking Sahyadri views.",
//     detailPage: "fort-detail.html?id=pratapgad"
//   },
//   {
//     name: "Raigad",
//     location: "Raigad District",
//     image: "images/raigad.jpg",
//     difficulty: "Moderate",
//     description: "Capital fort of the Marathas, Raigad is steeped in history with its famed ropeway and grand Maha Darwaja.",
//     detailPage: "fort-detail.html?id=raigad"
//   },
//   {
//     name: "Sinhagad",
//     location: "Pune District",
//     image: "images/sinhagad.jpg",
//     difficulty: "Easy",
//     description: "Known for its pivotal role in Maratha history and the bravery of Tanaji Malusare, Sinhagad offers sweeping Sahyadri vistas and historic bastions..",
//     detailPage: "fort-detail.html?id=sinhagad"
//   },
//   {
//     name: "Shivneri",
//     location: "Junnar, Pune",
//     image: "images/shivneri.jpg",
//     difficulty: "Easy",
//     description: "Birthplace of Chhatrapati Shivaji Maharaj, Shivneri stands with bastioned gates amidst wildflowers and ancient step wells.",
//     detailPage: "fort-detail.html?id=shivneri"
//   },
//   {
//     name: "Lohagad",
//     location: "Lonavala, Pune",
//     image: "images/lohagad.jpg",
//     difficulty: "Easy",
//     description: "Accessible in all seasons, Lohagad’s long ‘Vinchukata’ tail and mossy ramparts draw adventurers and history buffs.",
//     detailPage: "fort-detail.html?id=lohagad"
//   },
//   {
//     name: "Torna",
//     location: "Pune District",
//     image: "images/torana.jpg",
//     difficulty: "Difficult",
//     description: "The highest fort in Pune district, Torana offers a challenging hike and vibrant wildflower meadows in monsoon.",
//     detailPage: "fort-detail.html?id=torana"
//   },
//   {
//     name: "Rajgad",
//     location: "Pune District",
//     image: "images/rajgad.jpg",
//     difficulty: "Moderate",
//     description: "Known as the king of forts, Rajgad boasts massive ramparts, ‘Balekillas’, and was once Shivaji Maharaj’s capital.",
//     detailPage: "fort-detail.html?id=rajgad"
//   },
//   {
//     name: "Harishchandragad",
//     location: "Ahmednagar District",
//     image: "images/harishchandragad.jpg",
//     difficulty: "Difficult",
//     description: "Renowned for Konkan Kada and ancient caves, Harishchandragad attracts seasoned trekkers seeking night treks and unique geography.",
//     detailPage: "fort-detail.html?id=harishchandragad"
//   },
//   {
//     name: "Salher",
//     location: "Nashik District",
//     image: "images/salher.jpg",
//     difficulty: "Difficult",
//     description: "Maharashtra’s highest fort, Salher, holds battlefield legends and grand mountain landscapes on the Maharashtra-Gujarat border.",
//     detailPage: "fort-detail.html?id=salher"
//   },
//   {
//     name: "Sindhudurg",
//     location: "Malvan, Konkan",
//     image: "images/sindhudurg.jpg",
//     difficulty: "Easy",
//     description: "A sprawling sea fort, Sindhudurg is famed for its hidden entrance, strong ramparts, and intricate Chhatrapati-era carvings.",
//     detailPage: "fort-detail.html?id=sindhudurg"
//   }
// ];

// function renderForts() {
//   const grid = document.getElementById('fortsGrid');
//   forts.forEach(fort => {
//     const card = document.createElement('div');
//     card.className = 'fort-card';
//     card.innerHTML = `
//       <img src="${fort.image}" class="fort-image" alt="${fort.name}">
//       <div class="fort-info">
//         <div class="fort-name">${fort.name}</div>
//         <div class="fort-location">${fort.location}</div>
//         <span class="difficulty">${fort.difficulty}</span>
//         <div class="fort-description">${fort.description}</div>
//         <a href="${fort.detailPage}" class="view-btn">View Details</a>
//       </div>
//     `;
//     grid.appendChild(card);
//   });
// }
// window.onload = renderForts;
document.addEventListener("DOMContentLoaded", () => {
  const fortsList = document.getElementById("fortsList");

  // Fetch all forts
  async function loadForts() {
    fortsList.innerHTML = "<li>Loading...</li>";
    try {
      const res = await fetch("http://127.0.0.1:3000/api/forts");
      const forts = await res.json();
      fortsList.innerHTML = forts.map(f => `
        <li>
          <strong>${f.name}</strong> (${f.location})<br>
          ${f.history || "No history available"}
        </li>
      `).join("");
    } catch (err) {
      fortsList.innerHTML = "<li>Error loading forts</li>";
      console.error("Error loading forts:", err);
    }
  }

  loadForts();
});
