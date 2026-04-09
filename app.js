// Chargement des données au démarrage (depuis la mémoire du téléphone ou données par défaut)
let projets = JSON.parse(localStorage.getItem('prdtsData')) || [
    { commune: "Ahl Oued Za", intitule: "Achat minibus transport scolaire", secteur: "Education", cout: 1942989, avancement: 100 },
    { commune: "Sidi Lahcen", intitule: "Acquisition minibus scolaire", secteur: "Education", cout: 777195, avancement: 100 },
    { commune: "Ain Lehjer", intitule: "Construction centre de santé sidi moussa", secteur: "Santé", cout: 2922096, avancement: 85 }
];

const tableBody = document.getElementById('projectTableBody');
const projectForm = document.getElementById('projectForm');

// Fonction pour afficher les données et mettre à jour le tableau de bord
function updateUI() {
    tableBody.innerHTML = '';
    let totalCout = 0;
    let sumAvancement = 0;

    projets.forEach((p, index) => {
        totalCout += parseFloat(p.cout);
        sumAvancement += parseFloat(p.avancement);

        const row = `
            <tr>
                <td>
                    <strong>${p.commune}</strong><br>
                    <small class="text-muted">${p.intitule}</small>
                </td>
                <td>${Number(p.cout).toLocaleString()} DH</td>
                <td style="width: 200px;">
                    <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${p.avancement}%"></div>
                        </div>
                        <small>${p.avancement}%</small>
                    </div>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-warning" onclick="editProject(${index})">Modifier</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProject(${index})">❌</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Mise à jour des compteurs en haut
    document.getElementById('statTotal').innerText = projets.length;
    document.getElementById('statCout').innerText = totalCout.toLocaleString() + " DH";
    document.getElementById('statAvg').innerText = projets.length > 0 ? Math.round(sumAvancement / projets.length) + "%" : "0%";

    // Sauvegarde automatique dans le stockage local
    localStorage.setItem('prdtsData', JSON.stringify(projets));
}

// Ajouter ou Modifier un projet
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = document.getElementById('editIndex').value;
    const newData = {
        commune: document.getElementById('commune').value,
        intitule: document.getElementById('intitule').value,
        secteur: document.getElementById('secteur').value,
        cout: document.getElementById('cout').value,
        avancement: document.getElementById('avancement').value
    };

    if (index === "") {
        projets.push(newData); // Nouveau projet
    } else {
        projets[index] = newData; // Mise à jour
    }

    resetForm();
    updateUI();
});

// Charger un projet dans le formulaire pour modification
window.editProject = function(index) {
    const p = projets[index];
    document.getElementById('commune').value = p.commune;
    document.getElementById('intitule').value = p.intitule;
    document.getElementById('secteur').value = p.secteur;
    document.getElementById('cout').value = p.cout;
    document.getElementById('avancement').value = p.avancement;
    document.getElementById('editIndex').value = index;
    document.getElementById('formTitle').innerText = "📝 Modification en cours...";
    window.scrollTo(0, 0);
};

// Supprimer un projet
window.deleteProject = function(index) {
    if(confirm("Voulez-vous vraiment supprimer cette ligne ?")) {
        projets.splice(index, 1);
        updateUI();
    }
};

// Réinitialiser le formulaire
window.resetForm = function() {
    projectForm.reset();
    document.getElementById('editIndex').value = "";
    document.getElementById('formTitle').innerText = "➕ Ajouter / Modifier un Projet";
};

// Lancement initial
updateUI();
