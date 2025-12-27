# SOCIAL BINGO - INSTALLATION

J'ai généré tous les fichiers nécessaires. Comme je n'ai pas pu exécuter `npm install` automatiquement, voici ce que tu dois faire pour lancer l'application :

1.  **Installe les dépendances :**
    ```bash
    npm install
    ```

2.  **Configure Firebase :**
    *   Renomme `.env.example` en `.env.local`.
    *   Remplace les valeurs fictives par tes vraies clés Firebase.

3.  **Lance l'application :**
    ```bash
    npm run dev
    ```

## Fonctionnalités prêtes :
*   **Création de Grille :** Nom + 9 cases -> Firestore.
*   **Dashboard :** Vue temps réel des grilles.
*   **Jeu :** Clic pour cocher -> Mise à jour temps réel.
*   **Logique de Victoire :** Détection automatique des lignes/colonnes/diagonales et affichage du score.

Enjoy ta partie de Bingo !
