import nbformat as nbf

def add_analysis_to_notebook():
    notebook_path = '../notebooks/1_EDA_Data_Preparation.ipynb'
    
    # Charger le notebook existant
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbf.read(f, as_version=4)
    
    # Créer la cellule Markdown d'analyse
    analysis_text = """\
### 📌 Synthèse Stratégique (Safe_AgriLab) - Données FAOSTAT
Suite à l'exécution de l'analyse ci-dessus, voici les conclusions clés pour orienter notre Modèle d'IA :

1. **Intégrité des données** : Le cœur de nos données est **parfaitement propre**. Sur 1702 enregistrements, les colonnes critiques (Produit, Année, Valeur, Unité) ont 0 valeur manquante. Seule la colonne `Note` est vide, nous pourrons la supprimer lors de la fusion.
2. **Étalonnage des Rendements** : Le graphique du Top 10 montre une disparité énorme entre les cultures (de 12 tonnes/ha pour les Bananes à 4 tonnes/ha pour le Manioc). 
   - *Impact IA* : Notre modèle Random Forest (Phase Modélisation) aura désormais des limites d'apprentissage ultra-précises et réalistes. Si un agriculteur saisit un sol très riche, l'IA lui recommandera une culture à haut rendement (comme l'Igname ou le Chou) pour maximiser ses profits, tout en sachant plafonner les prédictions du Manioc à ses vraies limites togolaises.
3. **Lien avec la vente (Objectif End-to-End)** : En connaissant le vrai rendement par hectare, l'IA pourra croiser ce volume avec le prix du marché (données Banque Mondiale) pour garantir un profit estimé avant même la plantation, cassant ainsi le "mur de la vente".
"""
    new_cell = nbf.v4.new_markdown_cell(analysis_text)
    
    # Chercher où insérer (après la cellule de code FAOSTAT)
    # Dans notre structure, la cellule de code FAOSTAT est probablement la 4ème cellule (index 3)
    # Mais pour être sûr, on cherche la cellule qui commence par "## 2. Analyse NASA" et on insère juste avant.
    insert_index = len(nb.cells)
    for i, cell in enumerate(nb.cells):
        if "## 2. Analyse NASA" in cell.source:
            insert_index = i
            break
            
    nb.cells.insert(insert_index, new_cell)
    
    # Sauvegarder
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print("Analyse ajoutée avec succès au notebook.")

if __name__ == "__main__":
    add_analysis_to_notebook()
