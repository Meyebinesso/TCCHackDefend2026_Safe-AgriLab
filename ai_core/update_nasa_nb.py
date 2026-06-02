import nbformat as nbf

def add_nasa_analysis_to_notebook():
    notebook_path = '../notebooks/1_EDA_Data_Preparation.ipynb'
    
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbf.read(f, as_version=4)
    
    analysis_text = """\
### 📌 Synthèse Stratégique (Safe_AgriLab) - Météo NASA POWER
L'analyse de ces 4171 jours de relevés climatiques (2015 à aujourd'hui) nous donne les directives suivantes pour la suite :

1. **Une fiabilité quasi-parfaite (Traitement des NA)** : Le remplacement des anomalies (`-999.0`) par des valeurs nulles a révélé qu'il ne nous manque que **6 jours** de données sur plus de 11 ans ! Nous utiliserons une simple **interpolation linéaire temporelle** pour boucher ces 6 trous. L'impact sur notre IA sera absolument nul.
2. **Lecture détaillée de la Courbe des Précipitations (Saisonnalité)** : 
   - **Les vallées (proches de 0 mm)** : Chaque année, la courbe s'effondre presque à 0. Cela montre de manière très nette la saison sèche au Togo. L'IA saura qu'aucune culture gourmande en eau ne peut survivre durant ces périodes sans irrigation artificielle.
   - **Les pics réguliers (saison des pluies)** : La majorité des pics annuels montent entre 200 mm et 400 mm. C'est le rythme normal pour vos cultures de rente.
   - **L'anomalie extrême de 2022** : Juste avant l'année 2023, on observe un pic gigantesque et anormal (plus de 600 mm). Cela indique un événement climatique extrême (des inondations massives).
3. **Conclusion pour Safe_AgriLab (Bouclier Climatique)** : L'agriculture au Togo est soumise à des variations violentes (passant de 0 mm à 600 mm). Notre modèle ne va pas seulement recommander une culture ; en croisant cette météo avec les rendements (FAOSTAT), il va devenir un outil d'adaptation en prédisant comment ces chocs d'eau affecteront les récoltes de l'agriculteur. L'intégration de l'humidité des sols (`GWETROOT` et `GWETTOP`) nous permettra de recommander des cultures basées sur la **véritable disponibilité en eau dans la terre**.
"""
    new_cell = nbf.v4.new_markdown_cell(analysis_text)
    
    insert_index = len(nb.cells)
    for i, cell in enumerate(nb.cells):
        if "## 3. Analyse Banque Mondiale" in cell.source:
            insert_index = i
            break
            
    nb.cells.insert(insert_index, new_cell)
    
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print("Analyse NASA détaillée ajoutée avec succès au notebook.")

if __name__ == "__main__":
    add_nasa_analysis_to_notebook()
