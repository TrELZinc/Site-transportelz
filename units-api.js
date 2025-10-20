// API pour la gestion des unités
// Ce fichier peut être inclus dans les pages qui ont besoin des unités

class UnitsAPI {
  constructor() {
    this.firebaseConfig = {
      apiKey: "AIzaSyAxbpNoGfMEK5N6sy3WYWMTD3WGelff0QA",
      authDomain: "transportelz.firebaseapp.com",
      projectId: "transportelz",
      storageBucket: "transportelz.firebasestorage.app",
      messagingSenderId: "290260714729",
      appId: "1:290260714729:web:a433a445eb44fe5404dc78",
      measurementId: "G-EKZYPTGFT7",
    };

    // Initialiser Firebase si ce n'est pas déjà fait
    if (typeof firebase !== "undefined") {
      // Vérifier si l'app par défaut existe déjà
      if (!firebase.apps.length) {
        firebase.initializeApp(this.firebaseConfig);
      }
      this.db = firebase.firestore();
    }
  }

  // Récupérer toutes les unités actives
  async getActiveUnits() {
    try {
      const snapshot = await this.db
        .collection("units")
        .where("active", "==", true)
        .get();

      const units = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        units.push({
          id: doc.id,
          ...data,
        });
      });

      return units;
    } catch (error) {
      console.error("Erreur lors de la récupération des unités:", error);
      return [];
    }
  }

  // Récupérer les unités par type
  async getUnitsByType(type) {
    try {
      const snapshot = await this.db
        .collection("units")
        .where("active", "==", true)
        .where("type", "==", type)
        .get();

      const units = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        units.push({
          id: doc.id,
          ...data,
        });
      });

      return units;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des unités par type:",
        error
      );
      return [];
    }
  }

  // Récupérer les camions
  async getCamions() {
    return await this.getUnitsByType("camion");
  }

  // Récupérer les remorques
  async getRemorques() {
    return await this.getUnitsByType("remorque");
  }

  // Générer les options HTML pour un select
  generateSelectOptions(units, includeEmpty = true) {
    let options = "";

    if (includeEmpty) {
      options += '<option value="">-- Sélectionner une unité --</option>';
    }

    units.forEach((unit) => {
      const label =
        unit.type === "camion"
          ? `Camion ${unit.number}`
          : `Remorque ${unit.number}`;
      options += `<option value="${unit.number}">${label}</option>`;
    });

    return options;
  }

  // Générer les options HTML pour un select de réparation
  generateRepairSelectOptions(units) {
    let options = "";

    units.forEach((unit) => {
      const label =
        unit.type === "camion"
          ? `Camion ${unit.number}`
          : `Remorque ${unit.number}`;
      options += `<option value="${label}">${label}</option>`;
    });

    return options;
  }
}

// Instance globale
window.unitsAPI = new UnitsAPI();
