import nbformat as nbf

def add_nasa_analysis_to_notebook():
    notebook_path = '../notebooks/1_EDA_Data_Preparation.ipynb'
    
    # Charger le notebook existant
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbf.read(f, as_version=4)
    
    # Créer la cellule Markdown d'analyse
    analysis_text = """\
### 📌 Synthèse Stratégique (Safe_AgriLab) - Météo NASA POWER
L'analyse de ces 4171 jours de relevés climatiques (2015 à aujourd'hui) nous donne les directives suivantes pour la suite :

1. **Une fiabilité quasi-parfaite (Traitement des NA)** : Le remplacement des anomalies (`-999.0`) par des valeurs nulles a révélé qu'il ne nous manque que **6 jours** de données sur plus de 11 ans ! 
   - *Décision technique* : Nous utiliserons une simple **interpolation linéaire temporelle** pour boucher ces 6 trous. L'impact sur notre IA sera absolument nul, préservant ainsi 100% de la fiabilité des données climatiques.
2. **Saisonnalité marquée et Choix des Cultures** : Le graphique des précipitations montre des cycles très stricts (saison des pluies vs saison sèche) avec parfois des pics extrêmes (comme l'inondation visible autour de 2022).
   - *Impact IA* : La machine va apprendre ces "patterns". En croisant cette météo avec les rendements (FAOSTAT), l'IA comprendra mathématiquement quelles cultures résistent le mieux aux excès d'eau ou aux sécheresses.
3. **L'Intelligence de l'Humidité des Sols** : La présence des variables `GWETROOT` (humidité des racines) et `GWETTOP` (humidité de surface) est une arme secrète. Au lieu de se baser uniquement sur la pluie qui tombe, notre application conseillera l'agriculteur sur la **véritable disponibilité en eau dans la terre**, ce qui est le nerf de la guerre pour la germination des graines.
"""
    new_cell = nbf.v4.new_markdown_cell(analysis_text)
    
    # Chercher où insérer : après la section "Analyse NASA"
    # On va chercher la cellule "## 3. Analyse Banque Mondiale" et on insère juste avant.
    insert_index = len(nb.cells)
    for i, cell in enumerate(nb.cells):
        if "## 3. Analyse Banque Mondiale" in cell.source:
            insert_index = i
            break
            
    nb.cells.insert(insert_index, new_cell)
    
    # Sauvegarder
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
    print("Analyse NASA ajoutée avec succès au notebook.")

if __name__ == "__main__":
    add_nasa_analysis_to_notebook()
