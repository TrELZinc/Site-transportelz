const form = document.getElementById("formulaire");
    const voyageContainer = document.getElementById("voyageContainer");
    let voyageCount = 0;
    const MAX_VOYAGES = 3;

    addVoyageSection();

    function addVoyageSection() {
      if (voyageCount >= MAX_VOYAGES) return;
      voyageCount++;
      const id = voyageCount;

      const section = document.createElement("div");
      section.className = "section-box";
      section.innerHTML = `
        <h5 class="mb-3">Voyage ${id}</h5>
        <div class="mb-3">
          <label class="form-label fw-bold text-uppercase">Type de voyage</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="type_voyage_${id}" id="km_${id}" value="kilometrage" required>
            <label class="form-check-label" for="km_${id}">Voyage au kilométrage</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="type_voyage_${id}" id="heure_${id}" value="heure" required>
            <label class="form-check-label" for="heure_${id}">Voyage à l’heure</label>
          </div>
        </div>
        <div id="details_${id}"></div>
      `;
      voyageContainer.appendChild(section);

      section.querySelectorAll(`input[name="type_voyage_${id}"]`).forEach((radio) => {
        radio.addEventListener("change", () => {
          const container = section.querySelector(`#details_${id}`);
          if (radio.value === "heure") {
            container.innerHTML = `
              <div class="mb-3">
                <label class="form-label fw-bold text-uppercase">Origine</label>
                <select class="form-select" name="origine_${id}" required>
                  <option value="St-Basile" selected>St-Basile</option>
                  <option value="Vimont">Vimont</option>
                  <option value="Stanstead">Stanstead</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold text-uppercase">Destination</label>
                <input type="text" class="form-control" name="destination_${id}" required />
              </div>
              <div class="mb-3">
  <label class="form-label fw-bold text-uppercase">Heure de début</label>
  <div class="d-flex gap-2">
    <select class="form-select" name="heure_debut_h_${id}" required>
      ${Array.from({length: 24}, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
    </select>
    <select class="form-select" name="heure_debut_m_${id}" required>
      <option value="00">00</option>
      <option value="15">15</option>
      <option value="30">30</option>
      <option value="45">45</option>
    </select>
  </div>
</div>

<div class="mb-3">
  <label class="form-label fw-bold text-uppercase">Heure de fin</label>
  <div class="d-flex gap-2">
    <select class="form-select" name="heure_fin_h_${id}" required>
      ${Array.from({length: 24}, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
    </select>
    <select class="form-select" name="heure_fin_m_${id}" required>
      <option value="00">00</option>
      <option value="15">15</option>
      <option value="30">30</option>
      <option value="45">45</option>
    </select>
  </div>
</div>

              ${id < MAX_VOYAGES ? getSuiviHTML(id) : ''}
            `;
            setupSuiviListener(id);
          } else {
            container.innerHTML = `
              <div class="mb-3">
                <label class="form-label fw-bold text-uppercase">Origine</label>
                <select class="form-select" name="origine_${id}" required>
                  <option value="St-Basile" selected>St-Basile</option>
                  <option value="Vimont">Vimont</option>
                  <option value="Stanstead">Stanstead</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold text-uppercase">Ville de destination</label>
                <input list="destinations" class="form-control" name="destination_${id}" required />
                <datalist id="destinations">
                  <option value="Montréal"></option>
                  <option value="Québec"></option>
                  <option value="Gatineau"></option>
                  <option value="Sherbrooke"></option>
                  <option value="Drummondville"></option>
                </datalist>
              </div>
              ${id < MAX_VOYAGES ? getSuiviHTML(id) : ''}
            `;
            setupSuiviListener(id);
          }
        });
      });
    }

    function getSuiviHTML(id) {
      return `
        <div class="mb-3 mt-3">
          <label class="form-label fw-bold text-uppercase">Avez-vous fait un autre voyage ensuite ?</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="autre_${id}" id="oui_${id}" value="oui" required />
            <label class="form-check-label" for="oui_${id}">Oui</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="autre_${id}" id="non_${id}" value="non" required />
            <label class="form-check-label" for="non_${id}">Non</label>
          </div>
        </div>
      `;
    }

    function setupSuiviListener(id) {
      const oui = document.getElementById(`oui_${id}`);
      const non = document.getElementById(`non_${id}`);
      if (oui) {
        oui.addEventListener("change", () => {
          if (voyageCount < MAX_VOYAGES) {
            addVoyageSection();
          }
        });
      }
      if (non) {
        non.addEventListener("change", afficherSectionFinale);
      }
      if (voyageCount === MAX_VOYAGES) afficherSectionFinale();
    }

    function afficherSectionFinale() {
  const section = document.createElement("div");
  section.className = "section-box";
  section.innerHTML = `
    <h5 class="mb-3">Fin du journal de bord</h5>

    <!-- Diesel -->
    <div class="mb-3">
      <label class="form-label fw-bold text-uppercase">Avez-vous fait le plein de diesel ?</label>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="diesel" value="non" id="diesel_non" required />
        <label class="form-check-label" for="diesel_non">Non</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="diesel" value="stbasile" id="diesel_stbasile" required />
        <label class="form-check-label" for="diesel_stbasile">Oui, St Basile Transport</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="diesel" value="esso" id="diesel_esso" required />
        <label class="form-check-label" for="diesel_esso">Oui, ESSO Deschambault</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="diesel" value="irving" id="diesel_irving" required />
        <label class="form-check-label" for="diesel_irving">Oui, Irving USA</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="diesel" value="autre" id="diesel_autre" required />
        <label class="form-check-label" for="diesel_autre">Spécifiez</label>
      </div>
      <input type="text" class="form-control mt-2 d-none" id="diesel_spec" name="diesel_spec" placeholder="Autre station" />
    </div>

    <!-- Litres diesel -->
    <div class="mb-3 d-none" id="litres_diesel_block">
      <label class="form-label">Inscrivez la quantité de litres (diesel)</label>
      <input type="number" inputmode="numeric" class="form-control" name="litres_diesel" />
    </div>

    <!-- Urée -->
    <div class="mb-3">
      <label class="form-label fw-bold text-uppercase">Avez-vous fait le plein d’urée ?</label>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="uree" value="non" id="uree_non" required />
        <label class="form-check-label" for="uree_non">Non</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="uree" value="garage_elz" id="uree_elz" required />
        <label class="form-check-label" for="uree_elz">Oui, au garage ELZ</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="uree" value="garage_stb" id="uree_stb" required />
        <label class="form-check-label" for="uree_stb">Oui, au garage St-Basile Transport</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="uree" value="autre" id="uree_autre" required />
        <label class="form-check-label" for="uree_autre">Spécifiez</label>
      </div>
      <input type="text" class="form-control mt-2 d-none" id="uree_spec" name="uree_spec" placeholder="Autre endroit" />
    </div>

    <!-- Litres urée -->
    <div class="mb-3 d-none" id="litres_uree_block">
      <label class="form-label">Inscrivez la quantité de litres (urée)</label>
      <input type="number" inputmode="numeric" class="form-control" name="litres_uree" />
    </div>

    <!-- Note -->
    <div class="mb-3">
      <label class="form-label fw-bold text-uppercase">Note</label>
      <textarea class="form-control" name="note" rows="3" placeholder="Votre note (facultatif)"></textarea>
    </div>
  `;

  voyageContainer.appendChild(section);

  // Interactions dynamiques
  const dieselRadios = document.querySelectorAll('input[name="diesel"]');
  const dieselSpec = document.getElementById("diesel_spec");
  const dieselLitres = document.getElementById("litres_diesel_block");

  dieselRadios.forEach((r) => {
    r.addEventListener("change", () => {
      dieselSpec.classList.toggle("d-none", r.id !== "diesel_autre");
      dieselLitres.classList.toggle("d-none", r.value === "non");
    });
  });

  const ureeRadios = document.querySelectorAll('input[name="uree"]');
  const ureeSpec = document.getElementById("uree_spec");
  const ureeLitres = document.getElementById("litres_uree_block");

  ureeRadios.forEach((r) => {
    r.addEventListener("change", () => {
      ureeSpec.classList.toggle("d-none", r.id !== "uree_autre");
      ureeLitres.classList.toggle("d-none", r.value === "non");
    });
  });
}
  </script>
  <!-- Résumé -->
<div class="container py-4 d-none" id="resumeContainer">
  <div class="section-box">
    <h4 class="mb-3">Résumé de votre journée</h4>
    <div id="resumeContent"></div>
    <div class="d-flex justify-content-between mt-4">
      <button type="button" class="btn btn-secondary" id="btn-modifier">Modifier</button>
      <button type="submit" class="btn btn-success" id="btn-confirm">Confirmer et envoyer</button>
    </div>
  </div>
</div>

<!-- Confirmation après envoi -->
<div class="container py-4 d-none" id="confirmationContainer">
  <div class="section-box text-center">
    <h4 class="mb-3 text-success">Formulaire envoyé 🎉</h4>
    <p>Merci pour votre envoi. Vos données ont été enregistrées avec succès.</p>
    <button class="btn btn-primary mt-3" onclick="window.location.reload()">Remplir un nouveau formulaire</button>
  </div>
</div>

<script>
  const btnPreview = document.getElementById("btn-preview");
  const resumeContainer = document.getElementById("resumeContainer");
  const resumeContent = document.getElementById("resumeContent");
  const btnModifier = document.getElementById("btn-modifier");

  btnPreview.addEventListener("click", () => {
    const formEl = document.getElementById("formulaire");
    const data = new FormData(formEl);
    let html = "";
    const heures = {};
    let totalMinutes = 0;

    for (const [key, value] of data.entries()) {
      if (value.trim() === "") continue;
      const heureMatch = key.match(/heure_(debut|fin)_([hm])_(\d+)/);
      if (heureMatch) {
        const [, type, part, id] = heureMatch;
        heures[id] = heures[id] || { debut: {}, fin: {} };
        heures[id][type][part] = value;
      } else {
        let label = key.replace(/_/g, " ").replace(/\d+$/, "").toUpperCase();
        if (label === "AUTRE") label = "AUTRE VOYAGE";
        html += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    }

    for (const [id, obj] of Object.entries(heures)) {
      const dH = parseInt(obj.debut.h || "0", 10);
      const dM = parseInt(obj.debut.m || "0", 10);
      const fH = parseInt(obj.fin.h || "0", 10);
      const fM = parseInt(obj.fin.m || "0", 10);
      const debutStr = `${String(dH).padStart(2, "0")}h${String(dM).padStart(2, "0")}`;
      const finStr = `${String(fH).padStart(2, "0")}h${String(fM).padStart(2, "0")}`;
      html += `<p><strong>VOYAGE ${id} - HEURE DE DÉBUT:</strong> ${debutStr}</p>`;
      html += `<p><strong>VOYAGE ${id} - HEURE DE FIN:</strong> ${finStr}</p>`;
      let duration = (fH * 60 + fM) - (dH * 60 + dM);
      if (duration < 0) duration = 0;
      totalMinutes += duration;
      const durH = Math.floor(duration / 60);
      const durM = duration % 60;
      html += `<p><strong>VOYAGE ${id} - DURÉE:</strong> ${durH}h${String(durM).padStart(2, "0")}</p>`;
    }

    if (totalMinutes > 0) {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      html += `<hr/><p><strong>TOTAL D'HEURES TRAVAILLÉES:</strong> ${h}h${String(m).padStart(2, "0")}</p>`;
    }

    resumeContent.innerHTML = html;
    formEl.classList.add("d-none");
    resumeContainer.classList.remove("d-none");
  });

  btnModifier.addEventListener("click", () => {
    resumeContainer.classList.add("d-none");
    document.getElementById("formulaire").classList.remove("d-none");
  });

  document.getElementById("btn-confirm").addEventListener("click", () => {
    const formData = new FormData(document.getElementById("formulaire"));
    const data = {};
    formData.forEach((val, key) => data[key] = val);

    fetch("https://script.google.com/macros/s/AKfycbxakbBK9TUcJ5gQQ4nL3vuDoGw2kt9zY3fMVb1tImOvnWNXdNb3kYIIGRh-VLp5dkNi/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    resumeContainer.classList.add("d-none");
    document.getElementById("confirmationContainer").classList.remove("d-none");
  });
</script>
<script>
  let tauxMap = {}; // par nom chauffeur
  let kmMap = {}; // origine -> destination -> km

  fetch("https://script.google.com/macros/s/AKfycbxakbBK9TUcJ5gQQ4nL3vuDoGw2kt9zY3fMVb1tImOvnWNXdNb3kYIIGRh-VLp5dkNi/exec")
    .then((res) => res.json())
    .then((data) => {
      tauxMap = data.chauffeurs.reduce((acc, el) => {
        acc[el.nom] = {
          taux_h: parseFloat(el.taux_h),
          taux_km: parseFloat(el.taux_km),
        };
        return acc;
      }, {});

      kmMap = data.kilometrages.reduce((acc, el) => {
        acc[el.origine] = acc[el.origine] || {};
        acc[el.origine][el.destination] = parseFloat(el.km);
        return acc;
      }, {});

      const destinationInputs = document.querySelectorAll('input[list="destinations"]');
      destinationInputs.forEach(input => {
        input.addEventListener('focus', () => {
          const origineSelect = input.closest('.section-box').querySelector('select[name^="origine_"]');
          const datalist = input.nextElementSibling;
          const origine = origineSelect?.value;
          datalist.innerHTML = "";
          if (kmMap[origine]) {
            Object.keys(kmMap[origine]).forEach(dest => {
              const option = document.createElement("option");
              option.value = dest;
              datalist.appendChild(option);
            });
          }
        });
      });
    })
    .catch((err) => console.error("Erreur chargement taux ou km:", err));

  btnPreview.addEventListener("click", () => {
    const data = new FormData(document.getElementById("formulaire"));
    const chauffeur = data.get("nom");
    const taux = tauxMap[chauffeur] || { taux_h: 0, taux_km: 0 };
    let html = "";
    let totalMinutes = 0;
    let totalMontant = 0;

    const heures = {};
    const voyages = {};

    for (const [key, value] of data.entries()) {
      const heureMatch = key.match(/heure_(debut|fin)_([hm])_(\d+)/);
      const typeMatch = key.match(/^type_voyage_(\d+)/);
      const origineMatch = key.match(/^origine_(\d+)/);
      const destinationMatch = key.match(/^destination_(\d+)/);

      if (heureMatch) {
        const [, type, part, id] = heureMatch;
        heures[id] = heures[id] || { debut: {}, fin: {} };
        heures[id][type][part] = value;
      } else if (typeMatch) {
        const id = typeMatch[1];
        voyages[id] = voyages[id] || {};
        voyages[id].type = value;
      } else if (origineMatch) {
        const id = origineMatch[1];
        voyages[id] = voyages[id] || {};
        voyages[id].origine = value;
      } else if (destinationMatch) {
        const id = destinationMatch[1];
        voyages[id] = voyages[id] || {};
        voyages[id].destination = value;
      } else {
        let label = key.replace(/_/g, " ").replace(/\d+$/, "").toUpperCase();
        if (label === "AUTRE") label = "AUTRE VOYAGE";
        html += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    }

    for (const [id, obj] of Object.entries(heures)) {
      const dH = parseInt(obj.debut.h || "0", 10);
      const dM = parseInt(obj.debut.m || "0", 10);
      const fH = parseInt(obj.fin.h || "0", 10);
      const fM = parseInt(obj.fin.m || "0", 10);
      const debutStr = `${String(dH).padStart(2, "0")}h${String(dM).padStart(2, "0")}`;
      const finStr = `${String(fH).padStart(2, "0")}h${String(fM).padStart(2, "0")}`;
      html += `<p><strong>VOYAGE ${id} - HEURE DE DÉBUT:</strong> ${debutStr}</p>`;
      html += `<p><strong>VOYAGE ${id} - HEURE DE FIN:</strong> ${finStr}</p>`;
      let duration = (fH * 60 + fM) - (dH * 60 + dM);
      if (duration < 0) duration = 0;
      totalMinutes += duration;
      const durH = Math.floor(duration / 60);
      const durM = duration % 60;
      html += `<p><strong>VOYAGE ${id} - DURÉE:</strong> ${durH}h${String(durM).padStart(2, "0")}</p>`;
      if (voyages[id]?.type === "heure") {
        const montant = (duration / 60) * taux.taux_h;
        totalMontant += montant;
        html += `<p><strong>VOYAGE ${id} - MONTANT (Heure):</strong> ${montant.toFixed(2)}$</p>`;
      }
    }

    for (const [id, v] of Object.entries(voyages)) {
      if (v.type === "kilometrage") {
        const km = kmMap[v.origine]?.[v.destination] || 0;
        const montant = km * taux.taux_km;
        totalMontant += montant;
        html += `<p><strong>VOYAGE ${id} - DISTANCE:</strong> ${km} km</p>`;
        html += `<p><strong>VOYAGE ${id} - MONTANT (KM):</strong> ${montant.toFixed(2)}$</p>`;
      }
    }

    if (totalMinutes > 0) {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      html += `<hr/><p><strong>TOTAL TEMPS:</strong> ${h}h${String(m).padStart(2, "0")}</p>`;
    }

    html += `<p><strong>TOTAL GÉNÉRAL À PAYER:</strong> ${totalMontant.toFixed(2)}$</p>`;

    resumeContent.innerHTML = html;
    formEl.classList.add("d-none");
    resumeContainer.classList.remove("d-none");
  });
</script>

 <script>
  fetch("https://script.google.com/macros/s/AKfycbxakbBK9TUcJ5gQQ4nL3vuDoGw2kt9zY3fMVb1tImOvnWNXdNb3kYIIGRh-VLp5dkNi/exec")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("nom");
      if (data?.chauffeurs?.length) {
        data.chauffeurs.forEach(chauffeur => {
          const opt = document.createElement("option");
          opt.value = chauffeur.nom;
          opt.textContent = chauffeur.nom;
          select.appendChild(opt);
        });
      } else {
        console.warn("Aucun chauffeur trouvé dans la réponse.");
      }
    })
    .catch(err => console.error("Erreur chargement chauffeurs:", err));
</script>
