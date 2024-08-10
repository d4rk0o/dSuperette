const produits = [
    { id: 1, nom: "Cola", name: "cola", prix: 2, categorie: "Boissons", sousCategorie: "Softs", quantite: 0, image: "./imgs/cola.png" },
    { id: 2, nom: "Bière", name: "biere", prix: 3, categorie: "Boissons", sousCategorie: "Alcools", quantite: 0, image: "./imgs/biere.png" },
    { id: 3, nom: "Chips", name: "chips", prix: 1.5, categorie: "Nourritures", sousCategorie: "Snacks", quantite: 0, image: "./imgs/chips.png" },
    { id: 4, nom: "Sandwich", name: "sandwich", prix: 4, categorie: "Nourritures", sousCategorie: "Plats préparés", quantite: 0, image: "./imgs/sanwich.png" },
    { id: 5, nom: "Pain", name: "bread", prix: 1, categorie: "Nourritures", sousCategorie: "Plats préparés", quantite: 0, image: "./imgs/undefined.png" },
    // Ajouter d'autres produits
];

// Extraction des catégories et sous-catégories uniques
const categories = [...new Set(produits.map(p => p.categorie))];
const sousCategories = [...new Set(produits.map(p => p.sousCategorie))];


// Initialisation des filtres
function initialiserFiltres() {
    const filtreCategorie = document.getElementById('filtre-categorie');
    const filtreSousCategorie = document.getElementById('filtre-sous-categorie');

    filtreCategorie.innerHTML = '<option value="tous">Toutes les catégories</option>';
    filtreSousCategorie.innerHTML = '<option value="tous">Toutes les sous-catégories</option>';

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filtreCategorie.appendChild(option);
    });

    sousCategories.forEach(souscat => {
        const option = document.createElement('option');
        option.value = souscat;
        option.textContent = souscat;
        filtreSousCategorie.appendChild(option);
    });

    filtreCategorie.addEventListener('change', afficherProduits);
    filtreSousCategorie.addEventListener('change', afficherProduits);
}

// Affichage des produits
function afficherProduits() {
    const produitsDiv = document.getElementById("produits");
    produitsDiv.innerHTML = '';

    const categorieFiltree = document.getElementById('filtre-categorie').value;
    const sousCategorieFiltree = document.getElementById('filtre-sous-categorie').value;

    const produitsFiltres = produits.filter(produit => 
        (categorieFiltree === 'tous' || produit.categorie === categorieFiltree) &&
        (sousCategorieFiltree === 'tous' || produit.sousCategorie === sousCategorieFiltree)
    );

    produitsFiltres.forEach(produit => {
        const produitElement = document.createElement("div");
        produitElement.classList.add("produit");
        produitElement.innerHTML = `
            <img src="${produit.image}" alt="${produit.nom}" class="produit-image" onerror="this.src='chemin/vers/image_par_defaut.jpg'">
            <h3>${produit.nom}</h3>
            <p><span style="font-weight: bold;">Prix:</span> <span style="color: green;">${produit.prix}$</span></p>
            <div class="quantite-controls">
                <button class="btn-retirer" data-id="${produit.id}">-</button>
                <span class="quantite-display" id="quantite-${produit.id}">${produit.quantite}</span>
                <button class="btn-ajouter" data-id="${produit.id}">+</button>
            </div>
        `;
        produitsDiv.appendChild(produitElement);
    });
}

function ajouterAuPanier(id) {
    const produit = produits.find(p => p.id === parseInt(id));
    produit.quantite++;
    mettreAJourAffichage();
}
function retirerDuPanier(id) {
    const produit = produits.find(p => p.id === parseInt(id));
    if (produit.quantite > 0) {
        produit.quantite--;
        mettreAJourAffichage();
    }
}

function mettreAJourAffichage() {
    const panierListe = document.getElementById("panier-liste");
    const totalElement = document.getElementById("total");
    const acheterButton = document.getElementById("acheter");
    
    panierListe.innerHTML = "";
    let total = 0;
    
    produits.forEach(produit => {
        if (produit.quantite > 0) {
            const li = document.createElement("li");
            li.innerHTML = `${produit.nom} x${produit.quantite} <span class="prix-total">$${(produit.prix * produit.quantite).toFixed(2)}</span>`;
            panierListe.appendChild(li);
            total += produit.prix * produit.quantite;
        }
        const quantiteElement = document.getElementById(`quantite-${produit.id}`);
        if (quantiteElement) {
            quantiteElement.textContent = produit.quantite;
        }
    });
    
    totalElement.textContent = `$${total}`;
    acheterButton.disabled = total === 0;
}
let panierTotal = [];
let totalPrice = 0;
function acheter() {
    const panier = produits.filter(p => p.quantite > 0);
    if (panier.length > 0) {
        const total = panier.reduce((sum, produit) => sum + (produit.prix * produit.quantite), 0);
        panierTotal.push(panier);
        totalPrice = total;

        fetch(`https://${GetParentResourceName()}/sendPaiement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        })
        .then(resp => resp.json())
        .then(resp => {
            if (resp === 'ok') {
            }
        })
        .catch(error => {
            console.error('Erreur lors du retirer :', error);
        });
    } else {
        fetch(`https://${GetParentResourceName()}/showEmptyCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({}),
        })
        .then(resp => resp.json())
        .then(resp => {
            if (resp === 'ok') {
            }
        })
        .catch(error => {
            console.error('Erreur lors du retirer :', error);
        });
    }
}
document.addEventListener("DOMContentLoaded", function() {
    initialiserFiltres();
    afficherProduits();
    document.getElementById("acheter").addEventListener("click", acheter);

    document.getElementById("produits").addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-ajouter")) {
                ajouterAuPanier(event.target.dataset.id);
        } else if (event.target.classList.contains("btn-retirer")) {
            retirerDuPanier(event.target.dataset.id);
        }
    });
});
function hideSupperette() {
    fetch(`https://${GetParentResourceName()}/hideSuperrette`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({}),
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp === 'ok') {
            produits.forEach(p => p.quantite = 0);
            mettreAJourAffichage();
            panierTotal = [];
            totalPrice = 0;
            document.body.style.display = 'none';
            isUIOpen = false
        }
    })
    .catch(error => {
        console.error('Erreur lors du retirer :', error);
    });
}

function SendPanier() {
    const panierd = produits.filter(p => p.quantite > 0).map(p => ({
        name: p.name,
        quantite: p.quantite
    }));

    fetch(`https://${GetParentResourceName()}/sendPanier`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({panier: panierd, total: totalPrice}),
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp === 'ok') {
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du panier :', error);
    });
}
window.addEventListener('message', function(event) {
    const item = event.data;
    if(item.action === "showSuperrette") {
        document.body.style.display = "flex";
        isUIOpen = true
    } else if(item.action === "paiement") {
        SendPanier()
        hideSupperette()
    }
})
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isUIOpen) {
        hideSupperette()
    }
})